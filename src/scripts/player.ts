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

  detectWallCollision() {  
      switch (true) {
      case this.y <= this.midSize && this.x < CONTAINER_WIDTH - this.midSize:
        this.direction = DIRECTIONS.RIGHT;
          return true;
      case this.y >= CONTAINER_HEIGHT - this.midSize && this.x > this.midSize:
        this.direction = DIRECTIONS.LEFT;
          return true;
      case this.x <= this.midSize && this.y > this.midSize:
        this.direction = DIRECTIONS.UP;
          return true;
      case this.x >= CONTAINER_WIDTH - this.midSize && this.y < CONTAINER_HEIGHT - this.midSize:
        this.direction = DIRECTIONS.DOWN;
          return true;
      default:
          return false;
      }
  }
  
}
