import { Node } from '@/scripts/math/node';
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@/scripts/gameManager';

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

  constructor({direction = DIRECTIONS.RIGHT, size = 8, speed = 1.5, color = "green"} = {}) {
    super(0, 0, {size: size, color: color});
    this.midSize = Math.ceil(this.size/2) + 1;
    this.speed = speed;
    this.x = this.midSize;
    this.y = this.midSize;
    this.direction = direction;
    this.isInArea = false;
  }

  onCollideBorder() {
    const { x, y, midSize } = this;
    // Border top
    if (y <= midSize && x < CONTAINER_WIDTH - midSize) {
      return DIRECTIONS.RIGHT;
    }
    // Border bottom
    if (y >= CONTAINER_HEIGHT - midSize && x > midSize) {
      return DIRECTIONS.LEFT;
    }
    // Border left
    if (x <= midSize && y > midSize) {
      return DIRECTIONS.UP;
    }
    // Border right
    if (x >= CONTAINER_WIDTH - midSize && y < CONTAINER_HEIGHT - midSize) {
      return DIRECTIONS.DOWN;
    }
    return this.direction;
  }

  onAutomaticMove() {
    this.direction = this.onCollideBorder();
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
