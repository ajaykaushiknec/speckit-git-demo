#!/bin/bash
# Auto-commit speckit artifacts after workflow steps
# Called by: after_specify, after_plan, after_implement hooks (speckit.git.commit)
# Usage: auto-commit.sh [stage]
#   stage: specify | plan | tasks | implement (default: speckit)

source "$(dirname "$0")/git-common.sh"

auto_commit() {
  local stage="${1:-speckit}"

  if ! is_git_repo; then
    log_error "Not a git repository."
    return 1
  fi

  # Map stage to conventional commit prefix
  local message_prefix
  case "$stage" in
    specify|spec)   message_prefix="spec" ;;
    plan)           message_prefix="plan" ;;
    tasks)          message_prefix="tasks" ;;
    implement|impl) message_prefix="impl" ;;
    *)              message_prefix="speckit" ;;
  esac

  # Check for changes
  local changes
  changes="$(git status --porcelain)"
  if [ -z "$changes" ]; then
    log_info "No changes to commit."
    echo "{\"status\":\"no_changes\",\"stage\":\"$stage\"}"
    return 0
  fi

  # Stage speckit-related files
  git add specs/ .specify/ 2>/dev/null
  git add -u 2>/dev/null

  # Verify we actually have staged changes
  if ! has_staged_changes; then
    log_info "No staged changes to commit."
    echo "{\"status\":\"no_staged_changes\",\"stage\":\"$stage\"}"
    return 0
  fi

  # Build commit message
  local branch
  branch="$(get_current_branch)"
  local commit_msg="${message_prefix}: update ${stage} artifacts [${branch}]"

  # Get list of changed files for commit body
  local file_list
  file_list="$(git diff --cached --name-only)"

  git commit -m "$commit_msg" -m "Files changed:" -m "$file_list"

  if [ $? -ne 0 ]; then
    log_error "Commit failed."
    return 1
  fi

  local commit_hash
  commit_hash="$(git rev-parse --short HEAD)"

  log_success "Committed: $commit_msg ($commit_hash)"
  echo "{\"status\":\"committed\",\"stage\":\"$stage\",\"commit\":\"$commit_hash\",\"branch\":\"$branch\"}"
  return 0
}

auto_commit "$@"
