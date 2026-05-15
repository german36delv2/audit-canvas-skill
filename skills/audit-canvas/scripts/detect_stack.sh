#!/usr/bin/env bash
# audit-canvas — quick stack detector
# Usage: ./detect_stack.sh [path]    (defaults to current directory)
# Output: lines like "STACK=laravel"; "STACK=nextjs"; "VERSION=php:^8.2"
set -euo pipefail

ROOT="${1:-.}"
cd "$ROOT"

emit() { printf '%s\n' "$1"; }

# --- Backend / server-rendered ---
if [[ -f composer.json ]] && grep -q '"laravel/framework"' composer.json 2>/dev/null; then
  emit "STACK=laravel"
fi
if [[ -f composer.json ]] && grep -q '"symfony/framework-bundle"' composer.json 2>/dev/null; then
  emit "STACK=symfony"
fi
if [[ -f manage.py ]]; then
  emit "STACK=django"
fi
if [[ -f Gemfile ]] && grep -q "^[[:space:]]*gem ['\"]rails['\"]" Gemfile 2>/dev/null; then
  emit "STACK=rails"
fi
if [[ -f wp-config.php ]] || [[ -f wp-config-sample.php ]]; then
  emit "STACK=wordpress"
fi

# --- Python web ---
if [[ -f requirements.txt ]] || [[ -f pyproject.toml ]]; then
  if [[ -f requirements.txt ]] && grep -qiE '^fastapi' requirements.txt 2>/dev/null; then
    emit "STACK=fastapi"
  fi
  if [[ -f requirements.txt ]] && grep -qiE '^flask' requirements.txt 2>/dev/null; then
    emit "STACK=flask"
  fi
  if [[ -f pyproject.toml ]] && grep -qiE 'fastapi' pyproject.toml 2>/dev/null; then
    emit "STACK=fastapi"
  fi
  if [[ -f pyproject.toml ]] && grep -qiE 'flask' pyproject.toml 2>/dev/null; then
    emit "STACK=flask"
  fi
fi

# --- Node ---
if [[ -f package.json ]]; then
  grep -q '"next"' package.json 2>/dev/null && emit "STACK=nextjs" || true
  grep -q '"vite"' package.json 2>/dev/null && emit "STACK=vite" || true
  grep -q '"@nestjs/core"' package.json 2>/dev/null && emit "STACK=nestjs" || true
  grep -q '"express"' package.json 2>/dev/null && emit "STACK=express" || true
  grep -q '"react-native"' package.json 2>/dev/null && emit "STACK=react-native" || true
  grep -q '"expo"' package.json 2>/dev/null && emit "STACK=expo" || true
  grep -q '"@supabase/' package.json 2>/dev/null && emit "STACK=supabase" || true
fi

# --- Backends as a service ---
if [[ -d supabase ]]; then
  emit "STACK=supabase"
fi
if [[ -f firebase.json ]]; then
  emit "STACK=firebase"
fi
if [[ -f firestore.rules ]]; then
  emit "STACK=firebase"
fi

# --- Deploy targets ---
[[ -f Dockerfile ]] && emit "DEPLOY=docker" || true
[[ -f vercel.json ]] && emit "DEPLOY=vercel" || true
[[ -f netlify.toml ]] && emit "DEPLOY=netlify" || true
[[ -f fly.toml ]] && emit "DEPLOY=fly" || true
[[ -d .github/workflows ]] && emit "CI=github-actions" || true
[[ -f .gitlab-ci.yml ]] && emit "CI=gitlab-ci" || true

# --- Languages and versions (best-effort) ---
if [[ -f composer.json ]]; then
  PHP_VER=$(grep -oE '"php"[[:space:]]*:[[:space:]]*"[^"]+"' composer.json | head -1 | sed -n 's/.*"\([^"]*\)"$/\1/p' || true)
  if [[ -n "$PHP_VER" ]]; then
    emit "VERSION=php:${PHP_VER}"
  fi
fi
[[ -f .nvmrc ]] && emit "VERSION=node:$(cat .nvmrc)" || true
[[ -f .python-version ]] && emit "VERSION=python:$(cat .python-version)" || true
[[ -f .ruby-version ]] && emit "VERSION=ruby:$(cat .ruby-version)" || true
