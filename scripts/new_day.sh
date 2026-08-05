#!/usr/bin/env bash
set -euo pipefail
day=$1
year=${2:-2025}
padded=$(printf '%02d' "$day")
dir="${year}/day${padded}"

mkdir -p "$dir"
sed -e "s/{{day}}/${day}/g" -e "s/{{year}}/${year}/g" templates/day_template.odin > "$dir/main.odin"

echo "Created $dir"
