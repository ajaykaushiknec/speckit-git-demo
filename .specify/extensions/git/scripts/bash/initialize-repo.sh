#!/bin/bash
# Initialize git repository for speckit project
# Called by: before_constitution hook (speckit.git.init)

source "$(dirname "$0")/git-common.sh"

initialize_repo() {
  if is_git_repo; then
    local root
    root="$(get_project_root)"
    log_info "Git repository already initialized at: $root"
    echo "{\"status\":\"already_initialized\",\"path\":\"$root\"}"
    return 0
  fi

  log_info "Initializing git repository..."
  git init
  if [ $? -ne 0 ]; then
    log_error "Failed to initialize git repository"
    return 1
  fi

  # Create .gitignore if not present
  if [ ! -f ".gitignore" ]; then
    cat > .gitignore <<'GITIGNORE'
node_modules/
.specify/feature.json
.specify/extensions/*/local-config.yml
GITIGNORE
    git add .gitignore
  fi

  # Initial commit if no commits exist
  if ! git log --oneline -1 >/dev/null 2>&1; then
    git add -A
    git commit -m "chore: initial project setup"
    log_success "Created initial commit"
  fi

  log_success "Git repository initialized"
  echo "{\"status\":\"initialized\",\"path\":\"$(pwd)\"}"
  return 0
}

initialize_repo "$@"
