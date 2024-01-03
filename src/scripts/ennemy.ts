import { randomIntFromInterval } from "./utils";
import { Node } from '@/scripts/math/node';
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@/scripts/gameManager';

export class Ennemy extends Node {
    size;
    speedX;
    speedY;
    color;
    midSize;

    constructor({size = 8, speed = 1.5, color = "red"} = {}) {
        super(0, 0);
        this.size = size;
        this.speedX = speed;
        this.speedY = speed;
        this.color = color;
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
