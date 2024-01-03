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

  isOnBorder() {
    const { x, y, midSize } = this;
    if (y <= midSize && x < CONTAINER_WIDTH - midSize) {
      return 0; // Border top
    }
    if (y >= CONTAINER_HEIGHT - midSize && x > midSize) {
      return 1; // Border bottom
    }
    if (x <= midSize && y > midSize) {
      return 2; // Border left
    }
    if (x >= CONTAINER_WIDTH - midSize && y < CONTAINER_HEIGHT - midSize) {
      return 3; // Border right
    }
    return -1;
  }

  onCollideBorder(borderSide: number) {
    switch (borderSide) {
      case 3: // Border right go down
        this.isInArea = false;
        return DIRECTIONS.DOWN;
      case 1: // Border bottom go left
        this.isInArea = false;
        return DIRECTIONS.LEFT;
      case 2: // Border left go up
        this.isInArea = false;
        return DIRECTIONS.UP;
      case 0: // Border top go right
        this.isInArea = false;
        return DIRECTIONS.RIGHT;
      default:
        return this.direction;
    }
  }

  onAutomaticMove() {
    const borderSide = this.isOnBorder();
  
    if (borderSide >= 0) {
      this.direction = this.onCollideBorder(borderSide);
    }
  
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
