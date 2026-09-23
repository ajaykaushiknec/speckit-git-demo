#!/bin/bash
# Auto-push to remote after commit
# Called by: after_implement hook (speckit.git.push)
# Usage: auto-push.sh [stage]

source "$(dirname "$0")/git-common.sh"

auto_push() {
  local stage="${1:-speckit}"

  if ! is_git_repo; then
    log_error "Not a git repository."
    return 1
  fi

  # Check if remote exists
  local remote
  remote=$(git remote 2>/dev/null | head -1)
  if [ -z "$remote" ]; then
    log_info "No remote configured. Skipping push."
    echo "{\"status\":\"no_remote\",\"stage\":\"$stage\"}"
    return 0
  fi

  local branch
  branch="$(get_current_branch)"

  # Check if there are commits to push
  local unpushed
  unpushed=$(git log "${remote}/${branch}..HEAD" --oneline 2>/dev/null)
  if [ -z "$unpushed" ]; then
    log_info "No new commits to push."
    echo "{\"status\":\"no_commits_to_push\",\"stage\":\"$stage\",\"branch\":\"$branch\"}"
    return 0
  fi

  # Push to remote
  log_info "Pushing $branch to $remote..."
  if git push -u "$remote" "$branch" 2>&1; then
    local commit_count
    commit_count=$(echo "$unpushed" | wc -l | tr -d ' ')
    log_success "Pushed $commit_count commit(s) to $remote/$branch"
    echo "{\"status\":\"pushed\",\"stage\":\"$stage\",\"branch\":\"$branch\",\"remote\":\"$remote\",\"commits\":$commit_count}"
    return 0
  else
    log_error "Push failed for $branch to $remote"
    echo "{\"status\":\"push_failed\",\"stage\":\"$stage\",\"branch\":\"$branch\"}"
    return 1
  fi
}

auto_push "$@"
