import P5 from 'p5';
import {Boundary} from './Boundary';
import {collideLineLine, distanceToWall} from './Collision';
import {Ray} from './Ray';

export class Car {
    p5: P5;
    startingPos: P5.Vector;
    pos: P5.Vector;
    vel: P5.Vector;
    acc: P5.Vector;
    rays: Ray[];
    w: number;
    h: number;
    hitWall: boolean;
    genes: number[];
    MAX_STEERING_ANGLE: number;
    MAX_VELOCITY: number;
    INITIAL_TTL: number;
    ttl: number;
    // Ready is a dirty hack: At spawn all rays return -1 as their distance
    // and update would mark the car as hit already
    ready: boolean;

    constructor(p5: P5, pos: P5.Vector, ttl?: number) {
        // this.MAX_STEERING_ANGLE = p5.PI / 5;
        this.MAX_STEERING_ANGLE = p5.PI;
        this.MAX_VELOCITY = 4;
        this.startingPos = pos.copy();
        this.p5 = p5;
        this.pos = pos.copy();
        this.vel = p5.createVector(1, 0);
        this.acc = p5.createVector(0, 0);
        this.hitWall = false;
        this.ready = false;
        this.ttl = ttl || 150;
        this.INITIAL_TTL = this.ttl;

        this.w = 5;
        this.h = 30;

        this.turnRays();
        this.randomGenes();
        // this.manualGenes();
    }

    manualGenes() {
        if (!this.rays) {
            throw new Error('Gene generation function called before ray generation');
        }
        this.genes = [-0.1, 0.1];
    }

    randomGenes() {
        if (!this.rays) {
            throw new Error('Gene generation function called before ray generation');
        }
        this.genes = [];

        for (let i = 0; i < this.rays.length; i++) {
            for (let j = 0; j < 1; j++) {
                this.genes.push(Math.random() * 2 - 1);
            }
        }
    }

    crossoverGenes(p1: Car, p2: Car) {
        if (!this.rays) {
            throw new Error('Gene generation function called before ray generation');
        }
        this.genes = [];
        for (let i = 0; i < p1.genes.length; i++) {
            if (Math.random() < 0.5) {
                this.genes.push(p1.genes[i]);
            } else {
                this.genes.push(p1.genes[i]);
            }
        }
    }

    copyGenes(car: Car) {
        this.genes = [...car.genes];
    }

    mutateGenes(percentage: number) {
        if (percentage < 0 || percentage > 1) {
            throw new Error(`percentage is not in [0, 1]: ${percentage}`);
        }

        for (let i = 0; i < this.genes.length; i++) {
            if (Math.random() < percentage) {
                this.genes[i] = Math.random();
            }
        }
    }

    steer() {
        let totalLeftRight = 0;

        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            const dist = ray.distanceToWall();

            if (dist > 0) {
                this.ready = true;
                const d = dist;
                const coeffLeftRight = this.genes[i];
                totalLeftRight += 1 / (d * coeffLeftRight);
            }
        }

        // Not sure why I need the last param to constrain the values in the [-1, 1] range
        // but it looks like sometimes the value is just a bit above or under the limit
        const normalizedLeftRight = this.p5.map(totalLeftRight, -this.rays.length, this.rays.length, -1, 1, true);
        this.turnPercentage(normalizedLeftRight);
    }

    update(walls: Boundary[]) {
        if (this.hitWall || this.ttl < 0) {
            return;
        }
        this.ttl--;
        this.steer();
        this.vel.add(this.acc);
        this.vel.limit(this.MAX_VELOCITY);
        this.pos.add(this.vel);
        this.acc.mult(0);

        if (this.collide(walls) && this.ready) {
            this.hitWall = true;
        }
    }

    turnRays() {
        this.rays = [];
        const currentAngle = this.vel.heading();
        this.rays.push(new Ray(this.p5, this.pos, currentAngle - this.p5.PI / 4));
        this.rays.push(new Ray(this.p5, this.pos, currentAngle + this.p5.PI / 4));

        /*
         * this.rays = [];
         * const currentAngle = this.vel.heading();
         * this.rays.push(new Ray(this.p5, this.pos, currentAngle));
         *
         * for (let i = 1; i < 2; i++) {
         *     const dir1 = currentAngle + (this.p5.PI / 4) * i;
         *     const dir2 = currentAngle + (this.p5.PI / 4) * -i;
         *
         *     this.rays.push(new Ray(this.p5, this.pos, dir1));
         *     this.rays.push(new Ray(this.p5, this.pos, dir2));
         * }
         */
    }

    turnPercentage(percentage: number) {
        if (percentage < -1 || percentage > 1) {
            throw new Error(`percentage is not in [-1, 1]: ${percentage}`);
        }

        const angle = this.p5.map(percentage, -1, 1, -this.MAX_STEERING_ANGLE, this.MAX_STEERING_ANGLE);
        this.acc = this.vel.copy().rotate(angle);

        this.acc.setMag(0.5);
        this.turnRays();
    }

    turn(direction: 'left' | 'right') {
        const angle = (this.p5.PI / 5) * (direction === 'left' ? -1 : 1);
        this.acc = this.vel.copy().rotate(angle);

        this.acc.setMag(0.5);
        this.turnRays();
    }

    draw() {
        const p5 = this.p5;
        const line = this.vel.copy().setMag(30);
        p5.stroke(250);
        if (this.hitWall) {
            p5.stroke('red');
        }
        p5.push();
        p5.translate(this.pos.x, this.pos.y);
        p5.strokeWeight(5);
        p5.line(-line.x / 2, -line.y / 2, line.x / 2, line.y / 2);
        p5.pop();

        /*
         * for (const ray of this.rays) {
         *     ray.draw();
         * }
         */
    }

    look(walls: Boundary[]) {
        for (const ray of this.rays) {
            let closest = null;
            let record = Number.MAX_SAFE_INTEGER;
            for (let wall of walls) {
                const pt = ray.cast(wall);
                if (pt) {
                    const d = P5.Vector.dist(this.pos, pt);
                    if (d < record) {
                        record = d;
                        closest = pt;
                    }
                }
            }
            ray.hitPoint = closest;
        }
    }

    collide(walls: Boundary[]) {
        const line = this.vel.copy().setMag(30);

        for (const wall of walls) {
            const x1 = wall.a.x;
            const y1 = wall.a.y;
            const x2 = wall.b.x;
            const y2 = wall.b.y;

            const x3 = this.pos.x - line.x / 2;
            const y3 = this.pos.y - line.y / 2;
            const x4 = this.pos.x + line.x / 2;
            const y4 = this.pos.y + line.y / 2;
            if (collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4)) {
                return true;
            }
        }
        return false;
    }

    fitness(walls: Boundary[]): number {
        const maxDist = 1131;
        const distanceRan = this.pos.dist(this.startingPos);
        return distanceRan;
    }
}
