#!/usr/bin/env bash
set -euo pipefail

shopt -s nullglob
workflow_files=(workflows/n8n/*.json)

if [ ${#workflow_files[@]} -eq 0 ]; then
  echo "No n8n workflow files found in workflows/n8n"
  exit 1
fi

assert_node_names() {
  local file="$1"
  shift

  local missing=0
  local node_names
  node_names="$(jq -r '.nodes[].name' "$file")"

  for required_name in "$@"; do
    if ! grep -Fxq "$required_name" <<<"$node_names"; then
      echo "Missing node \"$required_name\" in $file"
      missing=1
    fi
  done

  if [ "$missing" -ne 0 ]; then
    exit 1
  fi
}

for file in "${workflow_files[@]}"; do
  echo "Validating $file"

  jq -e '
    type == "object" and
    (.name | type == "string" and length > 0) and
    (.nodes | type == "array" and length > 0) and
    (.connections | type == "object") and
    (.settings | type == "object")
  ' "$file" >/dev/null
done

assert_node_names \
  "workflows/n8n/rosalynn-beo-generation-v1.json" \
  "Schedule Trigger" \
  "Fetch Ready Events" \
  "Authorize Ready To Generate" \
  "Recipient Mismatch Guard" \
  "Send Emails" \
  "Mark Generated" \
  "Mark Error"

assert_node_names \
  "workflows/n8n/rosalynn-beo-dead-letter-reconcile-v1.json" \
  "Schedule Trigger" \
  "Fetch Dead Letters" \
  "Authorize Dead Letter Replay" \
  "Replay Entry"

echo "n8n workflow contracts validated."
