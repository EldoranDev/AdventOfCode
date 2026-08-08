# Advent of Code Solutions

Solutions for Advent of Code written in Odin, for typescript solutions for years 2015-2025 check the [typescript branch](https://github.com/EldoranDev/AdventOfCode/tree/typescript).

## Commands

Commands are ran using [go-task](https://taskfile.dev/)

> [!TIP]
> Variables `YEAR` and `DAY` can be overwriten for all commands

```bash
# will create odin file and download input file to inputs/
#
# create current day
task new
task new YEAR=[year] DAY=[day]
```

```bash
# Will run the code for the specified part of day
# --test can be used to run against the test data from inputs/
# 
# Execute part of day
task run -- [part]
task run YEAR=[year] DAY=[day]-- [part]
```

```bash
# Benchmark part of day
# requires hyperfine to be 
task bench -- [part]
task bench YEAR=[year] DAY=[day] -- [part]
```

```bash
# Fetch input of day
# As the inputs are not shared with this repo (see below)
task get
task get YEAR=[year] DAY=[day]
```

## Inputs

My personal inputs are not shared in this repository.

Althouhg it is not strictly forbidden it is [asked by the creator](https://www.reddit.com/r/adventofcode/comments/e7khy8/are_everyones_input_data_and_by_extension/fa13hb9/) to not share/collect personal inputs.

To refetch the input of an already created day `task get YEAR=[year] DAY=[day]` can be run.
