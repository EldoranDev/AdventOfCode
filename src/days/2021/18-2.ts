import { } from '@lib/input';
import { Context } from '@app/types';
import deepcopy from 'deepcopy';

type SnailNumber = [ SnailNumber|number, SnailNumber|number];

type TreeNode = { 
    left?: TreeNode|number, 
    right?: TreeNode|number,
    parent?: TreeNode,
}

export default function (input: string[], { logger }: Context) {
    let numbers: Array<TreeNode> = [];

    let highest = 0;

    for (const line of input) {
        numbers.push(
            createNode(JSON.parse(line))
        );
    }

    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            if (i == j) continue;

            let A = deepcopy(numbers[i]);
            let b = deepcopy(numbers[j]);

            let N: TreeNode = {
                left: A,
                right: b,
            };

            A.parent = N;
            b.parent = N;

            reduce(N);

            let m = getMagnitude(N);

            if (m > highest) {
                highest = m;
            }
        }
    }

    return highest
};

function reduce(number: TreeNode) {
    while(true) {
        // print(number);

        // Check Explodes
        let explodeNode = findExplode(number);
        
        if (explodeNode !== null) {
            // Do explode
            let left = findLeft(explodeNode);
            
            if (left !== null) {
                if (Number.isInteger(left.right)) {
                    (left.right as number) += explodeNode.left as number;
                } else if (Number.isInteger(left.left)) {
                    (left.left as number) += explodeNode.left as number;
                } 
            }

            let right = findRight(explodeNode);

            if (right !== null) {
                if (Number.isInteger(right.left)) {
                    (right.left as number) += explodeNode.right as number;
                } else if (Number.isInteger(right.right)) {
                    (right.right as number) += explodeNode.right as number;
                } 
            }

            // Replace with 0
            if (explodeNode.parent.left === explodeNode) {
                explodeNode.parent.left = 0;
            } else {
                explodeNode.parent.right = 0;
            }
            
            // restart checking
            continue;
        }
        
        let splitNode = findSplit(number);

        // Do Split
        if (splitNode !== null) {
            if (splitNode.left >= 10) {
                splitNode.left = {
                    parent: splitNode,
                    left: Math.floor((splitNode.left as number) / 2),
                    right: Math.ceil((splitNode.left as number) / 2)
                };

                continue;
            }

            if (splitNode.right >= 10) {
                splitNode.right = {
                    parent: splitNode,
                    left: Math.floor((splitNode.right as number) / 2),
                    right: Math.ceil((splitNode.right as number) / 2)
                };

                continue;
            }
        }
        

        return number;
    }
}

function getMagnitude(number: TreeNode|Number) {
    if (typeof number === 'number') {
        return number;
    }

    return getMagnitude((number as TreeNode).left) * 3 + getMagnitude((number as TreeNode).right) * 2;
}

function findExplode(number: TreeNode, cd: number = 0): TreeNode {
    if (cd === 4) {
        return number;
    } else {
        let node = null;
        if (!Number.isInteger(number.left)) {
            node = findExplode(number.left as TreeNode, cd + 1);
            
            if (node !== null) {
                return node;
            }
        }

        if (!Number.isInteger(number.right)) {
            node = findExplode(number.right as TreeNode, cd + 1);
            
            if (node !== null) {
                return node;
            }
        }

        return null;
    }
}

function findSplit(number: TreeNode): TreeNode {
    if (number.left >= 10) {
        return number;
    }

    let node = null;

    if (typeof(number.left) !== 'number') {
        node = findSplit(number.left as TreeNode);

        if (node !== null) {
            return node;
        }
    }

    if (number.right >= 10) {
        return number;
    }
    
    if (typeof(number.right) !== 'number') {
        node = findSplit(number.right as TreeNode);

        if (node !== null) {
            return node;
        }
    }

    return null;
}

function findLeft(number: TreeNode): TreeNode {
    let current = number;

    while (current !== null) {
        if (current.parent === null || current.parent === undefined) {
            return null;
        }

        if (current.parent.left === current) {
            current = current.parent;
            continue;
        }

        if (Number.isInteger(current.parent.left)) {
            return current.parent;
        }

        current = current.parent.left as TreeNode;
        break;
    }

    if (current === null) {
        return null;
    }

    while(true) {
        if (Number.isInteger(current.right)) {
            return current;
        }

        current = current.right as TreeNode;
    }
}

function findRight(number: TreeNode): TreeNode {
    let current = number;

    while(current !== null) {
        if (current.parent === null || current.parent === undefined) {
            return null;
        }

        if (current.parent.right === current) {
            current = current.parent;
            continue;
        }

        if (Number.isInteger(current.parent.right)) {
            return current.parent;
        }

        current = current.parent.right as TreeNode;
        break;
    }

    if (current === null) {
        return null;
    }

    while(true) {
        if (Number.isInteger(current.left)) {
            return current;
        }

        current = current.left as TreeNode;
    }
}

function createNode(num: SnailNumber, parent: TreeNode|null = null): TreeNode {
    const node: TreeNode = {
        parent,
    };

    if (Array.isArray(num[0])) {
        node.left = createNode(num[0], node);
    } else {
        node.left = num[0];
    }

    if (Array.isArray(num[1])) {
        node.right = createNode(num[1], node);
    } else {
        node.right = num[1];
    }

    return node;
};

function createArray(number: TreeNode): Array<SnailNumber> {
    let v = [];

    if (typeof(number.left) === 'number') {
        v[0] = number.left;
    } else {
        v[0] = createArray(number.left as TreeNode);
    }

    if (typeof(number.right) === 'number') {
        v[1] = number.right;
    } else {
        v[1] = createArray(number.right as TreeNode);
    }

    return v;
}

function print(number: TreeNode): void {
    console.log(JSON.stringify(createArray(number)));
}
