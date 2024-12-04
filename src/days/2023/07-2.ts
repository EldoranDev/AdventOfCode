import {} from "@lib/input";
import { Context } from "@app/types";

enum Type {
    FiveOfAKind = 0,
    FourOfAKind = 1,
    FullHouse = 2,
    ThreeOfAKind = 3,
    TwoPairs = 4,
    OnePair = 5,
    HihgCard = 6,
}

const CARDS = {
    A: 0,
    K: 1,
    Q: 2,
    T: 3,
    9: 4,
    8: 5,
    7: 6,
    6: 7,
    5: 8,
    4: 9,
    3: 10,
    2: 11,
    J: 12,
};

interface Hand {
    cards: number[];
    type: Type;
    bid: number;
}

export default function (input: string[], { logger }: Context) {
    const hands = input.map(parseHand);

    hands.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type - b.type;
        }

        for (let i = 0; i < a.cards.length; i++) {
            if (a.cards[i] !== b.cards[i]) {
                return a.cards[i] - b.cards[i];
            }
        }

        throw new Error("Input error");
    });

    return hands.reduce((acc, hand, index) => acc + hand.bid * (input.length - index), 0);
}

function parseHand(hand: string): Hand {
    const [cardsStr, bid] = hand.split(" ");

    const cards = cardsStr.split("").map((card) => CARDS[card]);

    return {
        cards,
        type: getType(cards),
        bid: parseInt(bid, 10),
    };
}

function getType(cards: number[]): Type {
    const counts: number[] = Array.from({ length: 13 }).fill(0) as number[];

    for (let i = 0; i < cards.length; i++) {
        counts[cards[i]]++;
    }

    const J = counts[CARDS.J];
    counts[CARDS.J] = 0;

    const max = Math.max(...counts);

    if (max === 5 || max + J === 5) {
        return Type.FiveOfAKind;
    }

    if (max === 4 || max + J === 4) {
        return Type.FourOfAKind;
    }

    if (counts.indexOf(3) !== -1 && counts.indexOf(2) !== -1) {
        return Type.FullHouse;
    }

    if (J > 0 && counts.filter((count) => count === 2).length === 2) {
        return Type.FullHouse;
    }

    if (max === 3 || max + J === 3) {
        return Type.ThreeOfAKind;
    }

    counts[CARDS.J] = J;

    if (counts.filter((count) => count === 2).length === 2) {
        return Type.TwoPairs;
    }

    if (max === 2 || max + J === 2) {
        return Type.OnePair;
    }

    return Type.HihgCard;
}
