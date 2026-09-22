#!/bin/bash
# Shared utilities for speckit git extension

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/../../git-config.yml"

get_project_root() {
  git rev-parse --show-toplevel 2>/dev/null
}

get_current_branch() {
  git rev-parse --abbrev-ref HEAD 2>/dev/null
}

get_main_branch() {
  if [ -f "$CONFIG_FILE" ]; then
    local branch
    branch=$(grep "main_branch:" "$CONFIG_FILE" | awk '{print $2}' | tr -d '"' | tr -d "'")
    echo "${branch:-main}"
  else
    echo "main"
  fi
}

is_git_repo() {
  git rev-parse --is-inside-work-tree >/dev/null 2>&1
}

has_uncommitted_changes() {
  [ -n "$(git status --porcelain 2>/dev/null)" ]
}

has_staged_changes() {
  ! git diff --cached --quiet 2>/dev/null
}

ensure_clean_workdir() {
  if has_uncommitted_changes; then
    log_error "Working directory has uncommitted changes. Commit or stash before proceeding."
    return 1
  fi
  return 0
}

get_next_feature_num() {
  local existing
  existing=$(git branch --list 2>/dev/null | grep -oE '[0-9]{3}' | sort -n | tail -1)
  if [ -z "$existing" ]; then
    echo "001"
  else
    printf "%03d" $((10#$existing + 1))
  fi
}

log_info() {
  echo "[git-ext] INFO: $*"
}

log_error() {
  echo "[git-ext] ERROR: $*" >&2
}

log_success() {
  echo "[git-ext] OK: $*"
}
