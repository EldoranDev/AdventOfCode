use std::{collections::HashSet, hash::Hash};

pub fn intersection<T: Clone + Eq + Hash + Copy>(vecs: Vec<Vec<T>>) -> Vec<T> {
    let mut result = vecs[0].clone();
 
    for temp_vec in vecs {
        let unique: HashSet<_> = temp_vec.into_iter().collect();
        result = unique
            .intersection(&result.into_iter().collect())
            .map(|i| *i)
            .collect::<Vec<_>>();
    }

    result
}