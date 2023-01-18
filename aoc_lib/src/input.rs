use std:: {
    fs::File,
    io::{prelude::*, BufReader},
    path::Path
};

// Always get correct input

pub fn get_lines(path: impl AsRef<Path>) -> Vec<String> {
    let file = File::open(path).expect("no such file");
    let buf = BufReader::new(file);

    buf.lines()
        .map(|l| l.expect("Could not parse line"))
        .collect()
}

pub fn get_line_groups(lines: Vec<String>) -> Vec<Vec<String>> {
    let mut groups: Vec<Vec<String>> = Vec::new();

    let mut group: Vec<String> = Vec::new();

    for line in &lines {
        if line.trim() == "" {
            groups.push(group);
            group = Vec::new();
            continue;
        }

        group.push(line.clone());
    }

    groups
}