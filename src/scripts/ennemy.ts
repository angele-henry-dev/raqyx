import { randomIntFromInterval } from "./utils";
import { Node } from '@/scripts/math/node';
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@/scripts/gameManager';

export class Ennemy extends Node {
    speedX;
    speedY;
    midSize;

    constructor({size = 8, speed = 1, color = "red"} = {}) {
        super(0, 0, {size: size, color: color});
        const plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
        const plusOrMinusY = Math.random() < 0.5 ? -1 : 1;
        this.speedX = speed * plusOrMinusX;
        this.speedY = speed * plusOrMinusY;
        this.midSize = Math.ceil(this.size/2) + 1;

        const min = (this.size * 2);
        const xMax = (CONTAINER_WIDTH - min);
        const yMax = (CONTAINER_HEIGHT - min);
        this.x = randomIntFromInterval(min, xMax);
        this.y = randomIntFromInterval(min, yMax);
    }

    onAutomaticMove() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}
