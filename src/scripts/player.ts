import { Node } from '@/scripts/math/node';
import { Link } from '@/scripts/math/link';
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

  constructor(x: number, y: number, {direction = DIRECTIONS.RIGHT, size = 8, speed = 1.5, color = SELECTED_COLOR} = {}) {
    super(x, y, {size: size, color: color});
    this.midSize = Math.ceil(this.size/2) + 1;
    this.speed = speed;
    this.direction = direction;
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

  detectWallCollision(nextWall: Link) {
    if (nextWall) {
        const { x, y, speed, direction } = this;
        const futureX = (direction === DIRECTIONS.RIGHT || direction === DIRECTIONS.UP) ? x + speed : x - speed;
        const futureY = (direction === DIRECTIONS.DOWN || direction === DIRECTIONS.RIGHT) ? y + speed : y - speed;

        const isCollision =
            (direction === DIRECTIONS.RIGHT && futureX >= nextWall.n1.x && futureX >= nextWall.n2.x) ||
            (direction === DIRECTIONS.LEFT && futureX <= nextWall.n1.x && futureX <= nextWall.n2.x) ||
            (direction === DIRECTIONS.DOWN && futureY >= nextWall.n1.y && futureY >= nextWall.n2.y) ||
            (direction === DIRECTIONS.UP && futureY <= nextWall.n1.y && futureY <= nextWall.n2.y);

        if (isCollision) {
            switch (direction) {
                case DIRECTIONS.RIGHT: {
                  const tooMuch = futureX >= nextWall.n1.x ? futureX - nextWall.n1.x : futureX - nextWall.n2.x;
                  this.x = this.x + speed - tooMuch;
                  this.direction = nextWall.includesY(futureY) ? DIRECTIONS.DOWN : DIRECTIONS.UP;
                  break;
                }
                case DIRECTIONS.LEFT: {
                  const notEnough = futureX <= nextWall.n1.x ? nextWall.n1.x - futureX : nextWall.n2.x - futureX;
                  this.x = this.x - speed + notEnough;
                  this.direction = nextWall.includesY(futureY) ? DIRECTIONS.UP : DIRECTIONS.DOWN;
                  break;
                }
                case DIRECTIONS.DOWN: {
                  const tooMuch = futureY >= nextWall.n1.y ? futureY - nextWall.n1.y : futureY - nextWall.n2.y;
                  this.y = this.y + speed - tooMuch;
                  this.direction = nextWall.includesX(futureX) ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
                  break;
                }
                case DIRECTIONS.UP: {
                  const notEnough = futureY <= nextWall.n1.y ? nextWall.n1.y - futureY : nextWall.n2.y - futureY;
                  this.y = this.y - speed + notEnough;
                  this.direction = nextWall.includesX(futureX) ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
                  break;
                }
            }
            return true;
        }
    }
    return false;
  }
  
}
