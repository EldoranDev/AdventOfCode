import {} from "@lib/input";

export default function (input: string[]) {
    const cups = input[0].split("").map((c) => Number(c));

    let orderdCups = [...cups].sort((a, b) => a - b);

    for (let i = orderdCups[orderdCups.length - 1] + 1; i <= 1000000; i++) {
        cups.push(i);
    }

    orderdCups = [...cups].sort((a, b) => a - b);

    const circle = new LinkedList<number>();
    const reverse: ListNode<number>[] = new Array(cups.length);

    let last: ListNode<number> = null;

    for (const label of cups) {
        const cup = new ListNode(label);

        if (last !== null) {
            last.next = cup;
        } else {
            circle.head = cup;
        }

        reverse[label] = cup;

        last = cup;
    }

    last.next = circle.head;

    let current = circle.head;

    for (let i = 0; i < 10000000; i++) {
        circle.head = current;

        // circle.print();

        const pickup = circle.splice(3);
        const pickupValues = getValuesOfList(pickup);

        let destinationLabel = current.data;

        do {
            destinationLabel--;

            if (destinationLabel < orderdCups[0]) {
                destinationLabel = orderdCups[orderdCups.length - 1];
            }
        } while (pickupValues.includes(destinationLabel));

        const destination = reverse[destinationLabel];
        circle.head = destination;

        circle.insert(pickup);

        current = current.next;
    }

    const one = reverse[1];

    return one.next.data * one.next.next.data;
}

class LinkedList<T> {
    public head: ListNode<T>;

    constructor() {
        this.head = null;
    }

    public splice(count: number): ListNode<T> {
        const splice = this.head.next;
        let current = this.head.next;

        for (let i = 0; i < count - 1; i++) {
            current = current.next;
        }

        this.head.next = current.next;
        current.next = null;

        return splice;
    }

    public insert(node: ListNode<T>): void {
        const end = this.head.next;

        this.head.next = node;

        let current = node;
        while (current.next !== null) {
            current = current.next;
        }

        current.next = end;
    }

    public print() {
        process.stdout.write(`(${this.head.data}) `);

        let current = this.head.next;
        while (current !== this.head) {
            process.stdout.write(`${current.data} `);
            current = current.next;
        }
        console.log();
    }
}

class ListNode<T> {
    public next: ListNode<T>;

    constructor(public data: T) {}
}

function getValuesOfList<T>(node: ListNode<T>): T[] {
    const res: T[] = [];

    let current = node;

    while (current !== null) {
        res.push(current.data);
        current = current.next;
    }

    return res;
}
