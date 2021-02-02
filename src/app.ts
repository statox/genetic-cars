import P5 from 'p5';
import 'p5/lib/addons/p5.dom';
import './styles.scss';

import {Pool} from './Pool';
import {Car} from './Car';
import {Boundary} from './Boundary';
import {generateCircularRoad, generateRandomWalls, generatTunnel} from './RoadGenerator';

const sketch = (p5: P5) => {
    let car: Car;
    let walls: Boundary[];
    let roadWalls: Boundary[];
    let pool: Pool;
    let prevPoint: P5.Vector; // Used to draw walls manually

    const setupWalls = () => {
        walls = [];
        roadWalls = [];
        const {width, height} = p5;

        const {walls: newWalls, startingPos} = generateCircularRoad(p5);
        // const {walls: newWalls, startingPos} = generateRandomWalls(p5, 5);
        // const {walls: newWalls, startingPos} = generatTunnel(p5);
        roadWalls = [...newWalls];

        // Borders of the screen
        walls = [...roadWalls];
        walls.push(new Boundary(p5, -1, -1, width, -1));
        walls.push(new Boundary(p5, width, -1, width, height));
        walls.push(new Boundary(p5, width, height, -1, height));
        walls.push(new Boundary(p5, -1, height, -1, -1));
        return startingPos;
    };

    // The sketch setup method
    p5.setup = () => {
        // Creating and positioning the canvas
        const canvas = p5.createCanvas(800, 800);
        canvas.parent('app');
        const startingPos = setupWalls();
        // pool = new Pool(p5, 100, startingPos);
        pool = new Pool(p5, 100, startingPos);
    };

    // The sketch draw method
    p5.draw = () => {
        p5.background(50, 50, 50);

        pool.update(walls);
        pool.draw();

        if (pool.allFinished()) {
            pool.nextGeneration(walls);
        }

        walls.forEach((w) => w.draw());

        if (prevPoint) {
            p5.noFill();
            p5.stroke(250);
            p5.circle(prevPoint.x, prevPoint.y, 20);
        }
    };

    p5.mousePressed = () => {
        const {mouseX, mouseY} = p5;
        if (mouseX < 0 || mouseY < 0 || mouseX > p5.width || mouseY > p5.height) {
            return;
        }
        // Draw walls by clicking the screen
        if (!prevPoint) {
            prevPoint = p5.createVector(mouseX, mouseY);
            return;
        }

        walls.push(new Boundary(p5, prevPoint.x, prevPoint.y, mouseX, mouseY));
        prevPoint = null;
    };
};

new P5(sketch);
