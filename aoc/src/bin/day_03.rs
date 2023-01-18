fn main() {
    let lines = aoc_lib::input::get_lines("input/03-test.in");

    println!("Part 1: {}", part_1(lines.clone()))
}

fn part_1(lines: Vec<String>) -> u32 {
    for line in lines {
        let b = Rucksack { 
            a: line[0..line.len()/2].split("").map(|s| s.chars().nth(0).expect("")).collect(),
            b: line[line.len()/2..].split("").map(|s| s.chars().nth(0).expect("")).collect(),
        };

        let intersection = aoc_lib::vec::intersection(vec![b.a, b.b]);

        println!("{:?}", intersection);
    }

    0
}

#[derive(Debug)]
struct Rucksack {
    a: Vec<char>,
    b: Vec<char>,
}