#!/bin/bash
set -e

# Evitar: WARN[0000] buildx: failed to read current commit information with git rev-parse --is-inside-work-tree
export BUILDX_GIT_LABELS=0

ARGS="--build ${*}"

# Use this folder as context
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

# shellcheck disable=SC2068
sudo -E docker compose up ${ARGS[@]}
