#! /bin/bash
set -e

char="$1"
fixed="$(echo "$1" | python3 -c 'import html; import sys; print(html.unescape(sys.stdin.read().strip()))')"

echo "Searching for $1"
echo "Replacing with $fixed"

perl -pi -e "s|${char}|${fixed}|g" "${@:2}"
