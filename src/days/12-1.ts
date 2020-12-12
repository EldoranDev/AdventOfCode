import { } from '../lib/input';

type Vec2 = { x: number, y: number };

export default function (input: string[]) {

    const ship: { pos: Vec2, forward: Vec2 } = { pos: {x:0 , y:0}, forward: { x: 1, y: 0}};
  
    for (let line of input) {
        let amount = Number(line.substring(1));
        console.log(line.charAt(0), amount);
        
        switch (line.charAt(0)) {
            case 'N':
                ship.pos = add(ship.pos, mult({ x:0, y: 1}, amount));
                break;
            case 'S':
                ship.pos = add(ship.pos, mult({ x: 0, y: -1}, amount));
                break;
            case 'E':
                    ship.pos = add(ship.pos, mult({ x: 1, y: 0}, amount));
                    break;
            case 'W':
                ship.pos = add(ship.pos, mult({ x: -1, y: 0}, amount));
                break;
            case 'L':
                ship.forward = rotate(ship.forward, amount);
                break;
            case 'R':
                ship.forward = rotate(ship.forward, -amount);
                break;
            case 'F':
                ship.pos = add(ship.pos, mult(ship.forward, amount));
                break;
        }

        // console.log(ship.pos);
    }

    console.log(ship);
    return Math.abs(ship.pos.x) + Math.abs(ship.pos.y);
};

function add(a: Vec2, b: Vec2): Vec2 {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}

function mult(a: Vec2, m: number) {
    return {
        x: a.x * m,
        y: a.y * m,
    };
}

function rotate(vec: Vec2, degrees: number): Vec2 {
    const rad = degrees * Math.PI / 180;
    return {
        x: Math.round(Math.cos(rad)) * vec.x - Math.round(Math.sin(rad)) * vec.y,
        y: Math.round(Math.sin(rad)) * vec.x + Math.round(Math.cos(rad))* vec.y,
    };
}