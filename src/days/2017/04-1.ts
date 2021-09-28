import { } from '@lib/input';

export default function (input: string[]) {
    return input.filter((line) => {
        const split = line.split(' ');

        const unique = split.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });

        return split.length === unique.length;
    }).length;
};
