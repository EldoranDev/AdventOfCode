#!/usr/bin/env bash
set -euo pipefail
day=$1
year=${2:-2025}
padded=$(printf '%02d' "$day")
dir="${year}/day${padded}"

mkdir -p "$dir"
sed "s/{{day}}/day${padded}/g" templates/day_template.odin > "$dir/main.odin"

mkdir -p "inputs/${year}"
touch "inputs/${year}/day${padded}.test.txt"

echo "Created $dir"
