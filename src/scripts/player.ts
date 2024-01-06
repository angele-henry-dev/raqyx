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

  constructor(x: number, y: number, {direction = DIRECTIONS.RIGHT, size = 8, speed = 2, color = SELECTED_COLOR} = {}) {
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
          const futurePlusX = this.x + (this.speed * 2);
          const futurePlusY = this.y + (this.speed * 2);
          const futureMinusX = this.x - (this.speed * 2);
          const futureMinusY = this.y - (this.speed * 2);

          if (
              (futurePlusX == nextWall.n1.x || futurePlusX == nextWall.n2.x)
              || (futurePlusY == nextWall.n1.y || futurePlusY == nextWall.n2.y)
              || (futureMinusX == nextWall.n1.x || futureMinusX == nextWall.n2.x)
              || (futureMinusY == nextWall.n1.y || futureMinusY == nextWall.n2.y)
          ) {
              switch (this.direction) {
                  case DIRECTIONS.RIGHT:
                      this.x = futurePlusX;
                      if (nextWall.includesY(futurePlusY)) {
                          this.direction = DIRECTIONS.DOWN;
                      } else {
                          this.direction = DIRECTIONS.UP;
                      }
                      break;
                  case DIRECTIONS.LEFT:
                      this.x = futureMinusX;
                      if (nextWall.includesY(futureMinusY)) {
                          this.direction = DIRECTIONS.UP;
                      } else {
                          this.direction = DIRECTIONS.DOWN;
                      }
                      break;
                  case DIRECTIONS.DOWN:
                      this.y = futurePlusY;
                      if (nextWall.includesX(futureMinusX)) {
                          this.direction = DIRECTIONS.LEFT;
                      } else {
                          this.direction = DIRECTIONS.RIGHT;
                      }
                      break;
                  case DIRECTIONS.UP:
                      this.y = futureMinusY;
                      if (nextWall.includesX(futurePlusX)) {
                          this.direction = DIRECTIONS.RIGHT;
                      } else {
                          this.direction = DIRECTIONS.LEFT;
                      }
                      break;
              }
              return true;
          }
      }
      return false;
  }
  
}
