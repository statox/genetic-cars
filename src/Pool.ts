import P5 from 'p5';
import {Boundary} from './Boundary';
import {Car} from './Car';

type ParentsWeigthPoolResult = {
    weightedPool: {car: Car; fitness: number}[];
    totalFitness: number;
};

export class Pool {
    p5: P5;
    cars: Car[];
    nbCars: number;
    lastBestCar: Car;
    lastBestFitness: number;
    generation: number;
    startingPos: P5.Vector;
    CAR_TTL: number;

    constructor(p5: P5, nbCars: number, startingPos) {
        this.CAR_TTL = 400;
        this.p5 = p5;
        this.cars = [];
        this.nbCars = nbCars;
        this.generation = 0;
        this.startingPos = startingPos;
        for (let i = 0; i < nbCars; i++) {
            this.cars.push(new Car(p5, this.startingPos, this.CAR_TTL));
        }
    }

    update(walls: Boundary[]) {
        for (const car of this.cars) {
            car.update(walls);
            car.look(walls);
        }
    }

    draw() {
        this.p5.noStroke();
        this.p5.fill(250);
        this.p5.textSize(15);
        this.p5.text(`Generation ${this.generation}`, 30, 30);
        this.p5.text(`Fittest ${this.lastBestFitness}`, 30, 50);
        for (const car of this.cars) {
            car.draw();
        }
    }

    allFinished() {
        return !this.cars.some((c) => !c.hitWall && c.ttl > 0);
    }

    generateParentsWeightedPool(walls: Boundary[]): ParentsWeigthPoolResult {
        const weightedPool = [];
        let totalFitness = 0;
        for (let i = 0; i < this.cars.length; i++) {
            const car = this.cars[i];
            const fitness = this.cars[i].fitness(walls);
            totalFitness += fitness;
            weightedPool.push({car, fitness});
        }

        return {weightedPool, totalFitness};
    }

    chooseTwoParents(params: ParentsWeigthPoolResult): {p1: Car; p2: Car} {
        const {weightedPool, totalFitness} = params;
        const r1 = Math.random() * totalFitness;
        const r2 = Math.random() * totalFitness;

        let p1;
        let p2;

        let s = 0;
        let i = 0;
        while (s <= r1 || s <= r2) {
            const {fitness, car} = weightedPool[i];
            s += fitness;
            if (s >= r1 && !p1) {
                p1 = car;
            }
            if (s >= r2 && !p2) {
                p2 = car;
            }
            i++;
        }

        return {p1, p2};
    }

    nextGeneration(walls: Boundary[]) {
        this.generation++;

        const {weightedPool, totalFitness} = this.generateParentsWeightedPool(walls);
        this.chooseTwoParents({weightedPool, totalFitness});

        this.cars = [];
        for (let i = 0; i < this.nbCars; i++) {
            this.cars.push(new Car(this.p5, this.startingPos, this.CAR_TTL));
            const {p1, p2} = this.chooseTwoParents({weightedPool, totalFitness});
            this.cars[i].crossoverGenes(p1, p2);
            this.cars[i].mutateGenes(0.1);
        }
    }
}
