#!/usr/bin/env bash
# audit-canvas — optional static analysis runner.
# Calls third-party scanners IF they are installed locally; otherwise prints a hint.
# Output is appended to audit-canvas/static-output.log so the agent can reason over it.
#
# Usage: ./run_static_checks.sh [path]
set -uo pipefail

ROOT="${1:-.}"
cd "$ROOT"
mkdir -p audit-canvas
LOG="audit-canvas/static-output.log"
: > "$LOG"

run() {
  local name="$1"; shift
  if command -v "$1" >/dev/null 2>&1; then
    {
      echo "=== $name ==="
      "$@"
      echo
    } >> "$LOG" 2>&1
  else
    echo "[skip] $name not installed ($1). Install hint: $2" >> "$LOG"
  fi
}

# Secret scanning
run "gitleaks" gitleaks "detect" "--no-banner" "--redact" "--exit-code=0"
# Hint shown on skip:
# brew install gitleaks  /  https://github.com/gitleaks/gitleaks

# Generic SAST
run "semgrep" semgrep "scan" "--config=auto" "--quiet" "--no-rewrite-rule-ids" "--text"
# pip install semgrep  /  https://semgrep.dev

# Dependency audits (best-effort, all platforms)
run "npm audit" npm "audit" "--omit=dev"
run "composer audit" composer "audit"
run "bundler-audit" bundler-audit "check" "--update"
run "pip-audit" pip-audit
run "trivy fs" trivy "fs" "."

echo
echo "Static checks finished. Log: $LOG"
