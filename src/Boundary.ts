import P5 from 'p5';

export class Boundary {
    p5: P5;
    a: P5.Vector;
    b: P5.Vector;

    constructor(p5: P5, x1: number, y1: number, x2: number, y2: number) {
        this.p5 = p5;
        this.a = p5.createVector(x1, y1);
        this.b = p5.createVector(x2, y2);
    }

    draw() {
        const p5 = this.p5;
        p5.strokeWeight(2);
        p5.stroke(255);
        p5.line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}
