#!/usr/bin/env bash
# ============================================================================
# Deploy noby.aizim.co.zw via SSH + tar pipe.
# Requires:  ~/.ssh/config alias "aizim" pointing at ssh.us.stackcp.com
#            and a built dist/ folder.
# Usage:     bash scripts/deploy.sh
# Or:        npm run deploy
# ============================================================================
set -euo pipefail

cd "$(dirname "$0")/.."

REMOTE_ALIAS="aizim"
REMOTE_DIR="public_html/noby"

echo "==> Building production bundle..."
npm run build

if [[ ! -d dist ]]; then
  echo "ERROR: dist/ not found after build" >&2
  exit 1
fi

echo "==> Uploading dist/ contents to ${REMOTE_ALIAS}:${REMOTE_DIR}/ ..."
( cd dist && tar czf - . ) \
  | ssh "$REMOTE_ALIAS" "mkdir -p ${REMOTE_DIR} && cd ${REMOTE_DIR} && tar xzf -"

echo "==> Smoke-testing live URL..."
status=$(curl -s -o /dev/null -w "%{http_code}" -L https://noby.aizim.co.zw/)
if [[ "$status" != "200" ]]; then
  echo "WARN: live URL returned HTTP $status (expected 200)" >&2
  exit 2
fi

echo "==> Done — https://noby.aizim.co.zw/ is live"
