#!/usr/bin/env bash
set -eo pipefail

usage() {
  echo "usage: ./bin/deploy.sh <tag|latest>"
  echo ""
  echo "    latest                      Deploy to Dev (master push)"
  echo "    \$tag                        Deploy to Stage (git tag)"
  echo ""
  exit 1
}

[ $# -lt 1 ] && usage

echo "Build directory contains:"
# Just to prove that the files are there. For now.
ls -l build

echo "DEPLOY: $1 PLEASE"
