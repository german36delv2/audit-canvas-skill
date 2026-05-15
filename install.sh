#!/usr/bin/env bash
# audit-canvas — universal installer
# Detects Cursor and Claude Code on the local machine and symlinks the skill so
# both clients pick it up. One source of truth, two clients.
#
# Usage:
#   ./install.sh                       # install for the current user
#   ./install.sh --project <path>      # install scoped to a project
#   ./install.sh --uninstall           # remove the skill from both clients
#   curl -fsSL https://raw.githubusercontent.com/<you>/audit-canvas/main/install.sh | bash
set -euo pipefail

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SKILL_NAME="audit-canvas"
SKILL_SRC="$REPO_ROOT/skills/$SKILL_NAME"

UNINSTALL=0
PROJECT_PATH=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --uninstall) UNINSTALL=1; shift ;;
    --project)   PROJECT_PATH="$2"; shift 2 ;;
    -h|--help)
      sed -n '1,15p' "$0"
      exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 1 ;;
  esac
done

if [[ ! -d "$SKILL_SRC" ]]; then
  echo "audit-canvas: skill source not found at $SKILL_SRC" >&2
  exit 1
fi

link() {
  local dst="$1"
  mkdir -p "$(dirname "$dst")"
  if [[ -e "$dst" || -L "$dst" ]]; then
    if [[ -L "$dst" ]] && [[ "$(readlink "$dst")" == "$SKILL_SRC" ]]; then
      echo "  already linked  $dst"
      return
    fi
    echo "  exists (skipped) $dst"
    return
  fi
  ln -s "$SKILL_SRC" "$dst"
  echo "  linked          $dst"
}

unlink_if_ours() {
  local dst="$1"
  if [[ -L "$dst" ]] && [[ "$(readlink "$dst")" == "$SKILL_SRC" ]]; then
    rm "$dst"
    echo "  removed         $dst"
  fi
}

declare -a TARGETS

if [[ -n "$PROJECT_PATH" ]]; then
  PROJECT_PATH="$(cd "$PROJECT_PATH" && pwd)"
  TARGETS+=("$PROJECT_PATH/.cursor/skills/$SKILL_NAME")
  TARGETS+=("$PROJECT_PATH/.claude/skills/$SKILL_NAME")
else
  TARGETS+=("$HOME/.cursor/skills/$SKILL_NAME")
  TARGETS+=("$HOME/.claude/skills/$SKILL_NAME")
fi

if [[ "$UNINSTALL" -eq 1 ]]; then
  echo "audit-canvas: uninstalling..."
  for t in "${TARGETS[@]}"; do unlink_if_ours "$t"; done
  echo "done."
  exit 0
fi

echo "audit-canvas: installing from $SKILL_SRC"
for t in "${TARGETS[@]}"; do link "$t"; done

cat <<EOF

audit-canvas installed.

Usage in Cursor or Claude Code:
  - Ask: "audit my codebase for security issues"
  - Or:  "use the audit-canvas skill on this repo"

The skill will detect the stack, run universal + stack-specific checks, and
deliver a Cursor canvas (in Cursor) or a Markdown report (in Claude Code) at:
  ./audit-canvas-report.md          (Markdown fallback)
  ./audit-canvas/patches/*.patch    (one patch per Critical/High finding)
  ~/.cursor/projects/<workspace>/canvases/<repo>-security-audit.canvas.tsx

Updates: cd $(basename "$REPO_ROOT") && git pull
Uninstall: $0 --uninstall
EOF
