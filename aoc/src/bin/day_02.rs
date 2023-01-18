use aoc_lib;

use std::collections::HashMap;

fn main() {
    let lines = aoc_lib::input::get_lines("input/02.in");

    println!("Part 1: {}", part1(lines.clone()));
    println!("Part 2: {}", part2(lines.clone()));
}

fn part1(lines: Vec<String>) -> u32 {
    let map = HashMap::from([
        ("X", "A"),
        ("Y", "B"),
        ("Z", "C"),
    ]);

    let win = HashMap::from([
        ("A", "C"),
        ("B", "A"),
        ("C", "B"),
    ]);

    let mut score = 0;

    for game in lines {
        let split: Vec<&str> = game.split(" ").collect();

        let p = map.get(split[1]).expect("Mapping is not correct");

        score += p.chars().nth(0).unwrap() as u32 - 'A' as u32 + 1;

        if (&split[0]).eq(p) {
            score += 3;
            continue;
        }

        if (&split[0]).eq(win.get(p).unwrap()) {
            score += 6;
        }
    }

    score
}

fn part2(lines: Vec<String>) -> u32 {
    let lose = HashMap::from([
        ("A", "B"),
        ("B", "C"),
        ("C", "A"),
    ]);

    let win = HashMap::from([
        ("A", "C"),
        ("B", "A"),
        ("C", "B"),
    ]);

    let mut score = 0;

    for game in lines {
        let split: Vec<&str> = game.split(" ").collect();

        let p = match split[1] {
            "X" => win.get(split[0]).unwrap(),
            "Y" => split[0],
            "Z" => lose.get(split[0]).unwrap(),
            _ => panic!("Unknown input data"),
        };
        
        score += p.chars().nth(0).unwrap() as u32 - 'A' as u32 + 1;

        if (split[0]).eq(p) {
            score += 3;
            continue;
        }

        if (&split[0]).eq(win.get(p).unwrap()) {
            score += 6;
        }
    }

    score
}