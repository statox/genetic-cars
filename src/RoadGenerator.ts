import P5 from 'p5';
import {Boundary} from './Boundary';

export function generateCircularRoad(p5: P5) {
    const {width, height, PI} = p5;
    const nbSegments = 5;
    const walls: Boundary[] = [];
    let startingPos;

    for (let i = 0; i < nbSegments; i++) {
        const angle = i * ((2 * PI) / nbSegments);
        const nextAngle = (i + 1) * ((2 * PI) / nbSegments);

        const r1 = (height / 2) * 0.95;
        const r2 = (height / 2) * 0.6;

        const x1 = p5.width / 2 + r1 * Math.cos(angle);
        const y1 = p5.height / 2 + r1 * Math.sin(angle);

        const x2 = p5.width / 2 + r1 * Math.cos(nextAngle);
        const y2 = p5.height / 2 + r1 * Math.sin(nextAngle);

        const x3 = p5.width / 2 + r2 * Math.cos(angle);
        const y3 = p5.height / 2 + r2 * Math.sin(angle);

        const x4 = p5.width / 2 + r2 * Math.cos(nextAngle);
        const y4 = p5.height / 2 + r2 * Math.sin(nextAngle);

        const w1 = new Boundary(p5, x1, y1, x2, y2);
        const w2 = new Boundary(p5, x3, y3, x4, y4);

        if (i === 0) {
            const middleWall1 = w1.b.copy().add(w1.a).mult(0.5);
            const middleWall2 = w2.b.copy().add(w2.a).mult(0.5);
            startingPos = middleWall2.add(middleWall1).mult(0.5);

            const startBoundary = new Boundary(p5, w1.b.x, w1.b.y, w2.b.x, w2.b.y);
            walls.push(startBoundary);
        }

        walls.push(w1);
        walls.push(w2);
    }

    return {walls, startingPos};
}

export function generateRandomWalls(p5, nbWalls: number) {
    const {width, height} = p5;
    const walls: Boundary[] = [];
    for (let i = 0; i < nbWalls; i++) {
        walls.push(
            new Boundary(
                p5,
                Math.random() * width,
                Math.random() * height,
                Math.random() * width,
                Math.random() * height
            )
        );
    }
    const startingPos = p5.createVector(width / 2, height / 2);
    return {walls, startingPos};
}

export function generatTunnel(p5) {
    const {width, height} = p5;
    const startingPos = p5.createVector(200, height / 2);
    const walls: Boundary[] = [];
    walls.push(new Boundary(p5, 100, 300, 500, 300));
    walls.push(new Boundary(p5, 100, 500, 500, 500));

    return {walls, startingPos};
}

/*
 *         roadWalls.push(new Boundary(p5, 0, 500, 100, 450));
 *         roadWalls.push(new Boundary(p5, 0, 700, 100, 650));
 *
 *         roadWalls.push(new Boundary(p5, 100, 450, 200, 500));
 *         roadWalls.push(new Boundary(p5, 100, 650, 200, 700));
 *
 *         roadWalls.push(new Boundary(p5, 200, 500, 400, 550));
 *         roadWalls.push(new Boundary(p5, 200, 700, 400, 650));
 *
 *         roadWalls.push(new Boundary(p5, 400, 550, 600, 450));
 *         roadWalls.push(new Boundary(p5, 400, 650, 625, 650));
 *
 *         roadWalls.push(new Boundary(p5, 600, 450, 650, 400));
 *         roadWalls.push(new Boundary(p5, 625, 650, 780, 500));
 *
 *         roadWalls.push(new Boundary(p5, 650, 400, 600, 350));
 *         roadWalls.push(new Boundary(p5, 780, 500, 780, 350));
 *
 *         roadWalls.push(new Boundary(p5, 600, 350, 500, 200));
 *         roadWalls.push(new Boundary(p5, 780, 350, 600, 200));
 *
 *         roadWalls.push(new Boundary(p5, 500, 200, 550, 150));
 *         roadWalls.push(new Boundary(p5, 600, 200, 780, 150));
 *
 *         roadWalls.push(new Boundary(p5, 550, 150, 600, 0));
 *         roadWalls.push(new Boundary(p5, 780, 150, 780, 0));
 *
 *         // roadWalls.push(new Boundary(p5, 100, 450, 200, 500));
 *         // roadWalls.push(new Boundary(p5, 100, 650, 200, 700));
 */
