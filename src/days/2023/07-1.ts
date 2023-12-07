import { } from '@lib/input';
import { Context } from '@app/types';

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
    J: 3,
    T: 4,
    9: 5,
    8: 6,
    7: 7,
    6: 8,
    5: 9,
    4: 10,
    3: 11,
    2: 12,
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

        throw new Error('Input error');
    });

    console.log(hands);

    return hands.reduce((acc, hand, index) => acc + (hand.bid * (input.length - index)), 0);
}

function parseHand(hand: string): Hand {
    const [cardsStr, bid] = hand.split(' ');

    const cards = cardsStr.split('').map((card) => CARDS[card]);

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

    if (counts.indexOf(5) !== -1) {
        return Type.FiveOfAKind;
    }

    if (counts.indexOf(4) !== -1) {
        return Type.FourOfAKind;
    }

    if (counts.indexOf(3) !== -1 && counts.indexOf(2) !== -1) {
        return Type.FullHouse;
    }

    if (counts.indexOf(3) !== -1) {
        return Type.ThreeOfAKind;
    }

    if (counts.filter((count) => count === 2).length === 2) {
        return Type.TwoPairs;
    }

    if (counts.indexOf(2) !== -1) {
        return Type.OnePair;
    }

    return Type.HihgCard;
}
