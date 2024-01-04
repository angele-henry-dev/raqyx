import { Node } from '@/scripts/math/node';
import { randomIntFromInterval } from "./utils";

const TERRITORIES_COLORS = ["blue", "green", "orange", "pink", "purple"];
const SELECTED_COLOR = TERRITORIES_COLORS[randomIntFromInterval(0, TERRITORIES_COLORS.length - 1)];

export const DIRECTIONS = {
  RIGHT: 0,
  LEFT: 1,
  DOWN: 2,
  UP: 3,
};

export class Player extends Node {
  direction;
  midSize;
  speed;
  isInArea;

  constructor({direction = DIRECTIONS.RIGHT, size = 8, speed = 1.5, color = SELECTED_COLOR} = {}) {
    super(0, 0, {size: size, color: color});
    this.midSize = Math.ceil(this.size/2) + 1;
    this.speed = speed;
    this.x = this.midSize;
    this.y = this.midSize;
    this.direction = direction;
    this.isInArea = false;
  }

  onAutomaticMove() {
    switch (this.direction) {
      case DIRECTIONS.RIGHT:
        this.x += this.speed;
        break;
      case DIRECTIONS.LEFT:
        this.x -= this.speed;
        break;
      case DIRECTIONS.DOWN:
        this.y += this.speed;
        break;
      case DIRECTIONS.UP:
        this.y -= this.speed;
        break;
    }
  }
  
}
