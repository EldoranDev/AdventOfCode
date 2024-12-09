import {} from "@lib/input";
import { Context } from "@app/types";
import { clear } from "console";

type Block = {
    id?: number;
    size: number;
    index: number;
};

export default function ([line]: string[], { logger, test }: Context) {
    const blocks: Block[] = [];

    for (let i = 0; i < line.length; i++) {
        blocks.push({
            id: i % 2 === 0 ? i / 2 : null,
            size: Number(line[i]),
            index: i,
        });
    }

    const disk = [...blocks];

    blocks.sort((a, b) => b.index - a.index);

    // Itterate over the original order
    for (const block of blocks) {
        // Empty blocks do not get moved
        if (block.id === null) {
            continue;
        }

        for (let i = 0; i < disk.length && i < block.index; i++) {
            if (disk[i].id !== null) {
                // Skip Files
                continue;
            }

            if (disk[i].size < block.size) {
                // Skipping Free blocks that are not big enough
                continue;
            }

            const oi = block.index;

            disk[i].size -= block.size;
            block.index = disk[i].index;

            for (let j = disk[i].index; j < oi; j++) {
                disk[j].index += 1;
            }

            // Insert empty space where we moved the files from
            disk.push({
                id: null,
                size: block.size,
                index: oi,
            });

            break;
        }

        disk.sort((a, b) => a.index - b.index);
    }

    let i = 0;
    let sum = 0;

    for (const block of disk) {
        for (let j = 0; j < block.size; j++) {
            if (block.id !== null) {
                sum += block.id * i;
            }

            i++;
        }
    }

    return sum;
}
