#!/bin/bash
# Create a new feature branch for speckit workflow
# Called by: before_specify hook (speckit.git.feature)
# Usage: create-new-feature-branch.sh [branch-name]

source "$(dirname "$0")/git-common.sh"

create_feature_branch() {
  local branch_name="$1"

  if ! is_git_repo; then
    log_error "Not a git repository. Run initialize-repo.sh first."
    return 1
  fi

  if [ -z "$branch_name" ]; then
    log_error "Branch name is required."
    log_error "Usage: create-new-feature-branch.sh <branch-name>"
    return 1
  fi

  local main_branch
  main_branch="$(get_main_branch)"

  # Generate sequential feature number
  local feature_num
  feature_num="$(get_next_feature_num)"

  # Build full branch name — skip prefix if user already provided NNN- pattern
  local full_branch_name
  if [[ "$branch_name" =~ ^[0-9]{3}- ]]; then
    full_branch_name="$branch_name"
    feature_num="${branch_name:0:3}"
  else
    full_branch_name="${feature_num}-${branch_name}"
  fi

  # Switch to branch (create if needed)
  if git show-ref --verify --quiet "refs/heads/$full_branch_name"; then
    log_info "Branch '$full_branch_name' already exists — switching to it."
    git checkout "$full_branch_name"
  else
    log_info "Creating feature branch: $full_branch_name (from $main_branch)"
    # Ensure we branch from main
    if git show-ref --verify --quiet "refs/heads/$main_branch"; then
      git checkout -b "$full_branch_name" "$main_branch"
    else
      git checkout -b "$full_branch_name"
    fi
  fi

  if [ $? -ne 0 ]; then
    log_error "Failed to create/switch to branch: $full_branch_name"
    return 1
  fi

  log_success "On feature branch: $full_branch_name"
  echo "{\"BRANCH_NAME\":\"$full_branch_name\",\"FEATURE_NUM\":\"$feature_num\"}"
  return 0
}

create_feature_branch "$@"
