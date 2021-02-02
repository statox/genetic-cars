/*
 * Ray casting inspired by
 * https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_145_Ray_Casting/P5
 */

import P5 from 'p5';
import {Boundary} from './Boundary';

export class Ray {
    p5: P5;
    pos: P5.Vector;
    dir: P5.Vector;
    hitPoint: P5.Vector;

    constructor(p5: P5, pos: P5.Vector, angle: number) {
        this.p5 = p5;
        this.pos = pos;
        this.dir = P5.Vector.fromAngle(angle);
    }

    draw() {
        if (this.hitPoint) {
            const paint = this.p5.map(1 / this.distanceToWall(), 0, 1, 0, 150);
            this.p5.strokeWeight(paint);
            this.p5.stroke(255);
            this.p5.line(this.pos.x, this.pos.y, this.hitPoint.x, this.hitPoint.y);
        }
    }

    /*
     * TODO: I can probably use the squared distance and remove one costly
     * computation of square root here.
     * To be done when I'll need to improve the perfs a bit
     */
    distanceToWall() {
        if (!this.hitPoint) {
            return -1;
        }
        return P5.Vector.dist(this.pos, this.hitPoint);
    }

    squaredDistanceToWall() {
        if (!this.hitPoint) {
            return -1;
        }
        const x1 = this.pos.x;
        const y1 = this.pos.y;
        const x2 = this.hitPoint.x;
        const y2 = this.hitPoint.y;
        return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    }

    cast(wall: Boundary) {
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) {
            return;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        if (t > 0 && t < 1 && u > 0) {
            const pt = this.p5.createVector();
            pt.x = x1 + t * (x2 - x1);
            pt.y = y1 + t * (y2 - y1);
            return pt;
        }

        return;
    }
}
