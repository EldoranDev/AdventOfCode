#!/usr/bin/env bash
set -euo pipefail

year=$1
day=$(printf '%02d' "$2")

dir="${year}/day${day}"

mkdir -p "$dir"
sed -e "s/{{day}}/$((day))/g" -e "s/{{year}}/${year}/g" templates/day_template.odin > "$dir/main.odin"

echo "Created $dir"
