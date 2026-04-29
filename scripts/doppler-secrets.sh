#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SECRETS_FILE_DEFAULT="$ROOT_DIR/.secrets/doppler.dev.env"
SECRETS_FILE="${SECRETS_FILE:-$SECRETS_FILE_DEFAULT}"
ENV_TEMPLATE="$ROOT_DIR/.env.example"
EDITOR_CMD="${EDITOR:-vi}"

usage() {
  cat <<'USAGE'
Usage:
  scripts/doppler-secrets.sh init
  scripts/doppler-secrets.sh edit
  scripts/doppler-secrets.sh pull
  scripts/doppler-secrets.sh push
  scripts/doppler-secrets.sh doctor

Environment overrides:
  SECRETS_FILE     Path to local editable secrets file.
  DOPPLER_PROJECT  Doppler project (optional if doppler setup scope already set).
  DOPPLER_CONFIG   Doppler config (optional if doppler setup scope already set).
USAGE
}

die() {
  echo "Error: $*" >&2
  exit 1
}

ensure_parent_dir() {
  mkdir -p "$(dirname "$SECRETS_FILE")"
}

lock_permissions() {
  chmod 600 "$SECRETS_FILE" 2>/dev/null || true
}

doppler_args() {
  local args=()
  if [[ -n "${DOPPLER_PROJECT:-}" ]]; then
    args+=("--project" "$DOPPLER_PROJECT")
  fi
  if [[ -n "${DOPPLER_CONFIG:-}" ]]; then
    args+=("--config" "$DOPPLER_CONFIG")
  fi
  if (( ${#args[@]} > 0 )); then
    printf '%s\n' "${args[@]}"
  fi
}

run_doppler() {
  local subcommand="$1"
  shift
  local args=()
  while IFS= read -r item; do
    [[ -n "$item" ]] && args+=("$item")
  done < <(doppler_args)
  if (( ${#args[@]} > 0 )); then
    doppler secrets "$subcommand" "$@" "${args[@]}"
  else
    doppler secrets "$subcommand" "$@"
  fi
}

cmd_doctor() {
  command -v doppler >/dev/null 2>&1 || die "doppler CLI is not installed"
  doppler me >/dev/null 2>&1 || die "not authenticated. Run: doppler login"
  echo "Doppler CLI is installed and authenticated."
  echo
  echo "Current scoped config:"
  doppler configure --scope "$ROOT_DIR" --all || true
  echo
  echo "Secrets file path: $SECRETS_FILE"
  if [[ -f "$SECRETS_FILE" ]]; then
    echo "Local secrets file exists."
  else
    echo "Local secrets file does not exist yet."
  fi
}

cmd_init() {
  ensure_parent_dir
  if [[ -f "$SECRETS_FILE" ]]; then
    lock_permissions
    echo "Already exists: $SECRETS_FILE"
    return 0
  fi

  if [[ -f "$ENV_TEMPLATE" ]]; then
    awk -F= '/^[A-Za-z_][A-Za-z0-9_]*=/{print $1"="}' "$ENV_TEMPLATE" > "$SECRETS_FILE"
  else
    : > "$SECRETS_FILE"
  fi

  lock_permissions
  echo "Created: $SECRETS_FILE"
  echo "Edit values, then run: npm run secrets:push"
}

cmd_edit() {
  cmd_init
  "$EDITOR_CMD" "$SECRETS_FILE"
  lock_permissions
  echo "Saved: $SECRETS_FILE"
}

cmd_pull() {
  ensure_parent_dir
  run_doppler download --format env "$SECRETS_FILE"
  lock_permissions
  echo "Downloaded secrets to: $SECRETS_FILE"
}

cmd_push() {
  [[ -f "$SECRETS_FILE" ]] || die "Missing $SECRETS_FILE (run: npm run secrets:init)"

  local filtered_file
  filtered_file="$(mktemp)"

  # Upload only non-empty KEY=VALUE entries to avoid overwriting secrets with blanks.
  grep -E '^[A-Za-z_][A-Za-z0-9_]*=.+' "$SECRETS_FILE" > "$filtered_file" || true

  if [[ ! -s "$filtered_file" ]]; then
    rm -f "$filtered_file"
    die "No non-empty secrets found in $SECRETS_FILE"
  fi

  run_doppler upload "$filtered_file" --silent
  rm -f "$filtered_file"
  echo "Uploaded secrets from: $SECRETS_FILE"
}

main() {
  local cmd="${1:-}"
  case "$cmd" in
    init)
      cmd_init
      ;;
    edit)
      cmd_edit
      ;;
    pull)
      cmd_pull
      ;;
    push)
      cmd_push
      ;;
    doctor)
      cmd_doctor
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"
