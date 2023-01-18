use aoc_lib;

fn main() {
    let lines = aoc_lib::input::get_lines("input/01.in");
    let groups = aoc_lib::input::get_line_groups(lines);

    let mut calories: Vec<i32> = Vec::new();

    for group in groups {
        let cals = group.iter().map(|c| c.parse::<i32>().unwrap());

        calories.push(cals.sum());
    }

    calories.sort_by(|a, b| b.cmp(a));

    println!("Part 1: {}", calories[0]);
    println!("Part 2: {}", calories[0] + calories[1] + calories[2]);
}