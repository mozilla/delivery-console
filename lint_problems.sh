#!/usr/bin/env bash
set -eo pipefail

prelude() {
  echo "
You have prettier-eslint linting errors!
----------------------------------
The following files would turn out different if you process them with prettier-eslint.

"
}

any=false
first=true
while read line
do
  $first && prelude
  echo "To fix:"
  echo "    prettier-eslint --write ${line}"
  echo "To see:"
  echo "    prettier-eslint ${line} | diff ${line} -"
  echo ""
  # echo "$line"
  any=true
  first=false
done < "${1:-/dev/stdin}"


$any && echo "
If you're not interested in how they're different, consider running:

  yarn run lint:prettier-eslintfix
"

$any && exit 1 || exit 0
