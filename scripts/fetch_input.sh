#!/usr/bin/env bash

set -euo pipefail

trap 'echo "Error on line $LINENO"' ERR

INPUT="./inputs/$1/$2.in"

curl --silent \
    -o "./inputs/$1/$2.in" \
    --cookie "session=$3" \
    "https://adventofcode.com/$1/day/$(($2))/input"

echo "Created input at: $INPUT"
