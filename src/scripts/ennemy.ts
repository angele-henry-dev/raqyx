import { randomIntFromInterval } from "./utils";
import { Node } from '@/scripts/math/node';
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@/scripts/gameManager';

export class Ennemy extends Node {
    speedX;
    speedY;
    midSize;

    constructor({size = 8, speed = 1.5, color = "red"} = {}) {
        super(0, 0, {size: size, color: color});
        this.speedX = speed;
        this.speedY = speed;
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
