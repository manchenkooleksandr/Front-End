#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: bash scripts/build-pages.sh NEW_OUTPUT_DIRECTORY" >&2
  exit 2
fi

mkdir -- "$1"
output=$(cd -- "$1" && pwd -P)
cd -- "$(dirname -- "$0")/.."

cp -- index.html site.css "$output/"
touch "$output/.nojekyll"

for lab in Lab01 Lab02 Lab03 Lab04 Lab05 Lab06 Lab08; do
  while IFS= read -r -d '' path; do
    case "$path" in
      *.html|*.css|*.js|*.jpg)
        mkdir -p -- "$output/$(dirname -- "$path")"
        cp -- "$path" "$output/$path"
        ;;
    esac
  done < <(git ls-files -z -- "$lab")
  test -f "$output/$lab/index.html"
done

build=$(mktemp -d)
trap 'rm -rf -- "$build"' EXIT
cp -R -- Lab07/index.html Lab07/package.json Lab07/package-lock.json \
  Lab07/vite.config.js Lab07/src Lab07/public "$build/"
(
  cd -- "$build"
  npm ci --no-audit --no-fund
  npm run build
)
cp -R -- "$build/dist" "$output/Lab07"
