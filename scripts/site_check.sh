#!/usr/bin/env zsh
set -euo pipefail

echo "[1/2] Rendering site..."
quarto render

echo "[2/2] Checking local links/assets in source files..."
missing=0

while IFS= read -r -d '' f; do
  while IFS= read -r u; do
    case "$u" in
      http*|mailto:*|tel:*|\#*|javascript:*|"")
        continue
        ;;
    esac

    # Support both relative paths and site-root style paths (/foo/bar).
    abs="$u"
    if [[ "${u#/}" != "$u" ]]; then
      abs=".$u"
    fi

    if [[ ! -e "$(dirname "$f")/$u" && ! -e "$abs" ]]; then
      echo "MISSING: $f -> $u"
      missing=1
    fi
  done < <(perl -ne 'while(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g){print "$1\n"}' "$f")
done < <(find . \( -name '*.qmd' -o -name '*.md' \) -print0)

if [[ "$missing" -eq 1 ]]; then
  echo "Site check failed: missing local links/assets found."
  exit 1
fi

echo "Site check passed."
