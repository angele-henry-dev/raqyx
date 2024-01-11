import { Node } from '@/scripts/math/node';
import { Link } from '@/scripts/math/link';
// import { randomIntFromInterval } from "./utils";

// const TERRITORIES_COLORS = ["blue", "green", "orange", "pink", "purple"];
// const SELECTED_COLOR = TERRITORIES_COLORS[randomIntFromInterval(0, TERRITORIES_COLORS.length - 1)];

export const DIRECTIONS = {
  RIGHT: 0,
  LEFT: 1,
  DOWN: 2,
  UP: 3,
};

export class Player extends Node {
  direction: number;
  midSize: number;
  speed: number;

  /**
   * Creates an instance of the Player class.
   * @param x The x-coordinate of the player.
   * @param y The y-coordinate of the player.
   * @param options Optional parameters like direction, size, speed, and color.
   */
  constructor(
      x: number,
      y: number,
      {
        direction = DIRECTIONS.RIGHT, size = 8, speed = 1.5,
        color = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary')
      }: { direction?: number; size?: number; speed?: number; color?: string} = {}
    ) {
    super(x, y, { size, color });
    this.midSize = Math.ceil(this.size / 2) + 1;
    this.speed = speed;
    this.direction = direction;
  }

  /**
   * Moves the player automatically based on its speed and direction.
   */
  onAutomaticMove(): void {
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

  /**
   * Detects collision with a wall and adjusts the player's position and direction accordingly.
   * @param nextWall The next wall the player might collide with.
   * @returns true if a collision occurs, otherwise false.
   */
  detectWallCollision(nextWall: Link): boolean {
    if (nextWall) {
        const { x, y, speed, direction } = this;
        const futureX = (direction === DIRECTIONS.RIGHT || direction === DIRECTIONS.UP) ? x + speed : x - speed;
        const futureY = (direction === DIRECTIONS.DOWN || direction === DIRECTIONS.RIGHT) ? y + speed : y - speed;

        const isCollision =
            (direction === DIRECTIONS.RIGHT && futureX >= Math.max(nextWall.n1.x, nextWall.n2.x)) ||
            (direction === DIRECTIONS.LEFT && futureX <= Math.min(nextWall.n1.x, nextWall.n2.x)) ||
            (direction === DIRECTIONS.DOWN && futureY >= Math.max(nextWall.n1.y, nextWall.n2.y)) ||
            (direction === DIRECTIONS.UP && futureY <= Math.min(nextWall.n1.y, nextWall.n2.y));

        if (isCollision) {
            this.handleCollision(nextWall, futureX, futureY);
            return true;
        }
    }
    return false;
  }

  /**
   * Handles the player's position and direction adjustment after a collision with a wall.
   * @param nextWall The wall the player collided with.
   * @param futureX The future x-coordinate of the player.
   * @param futureY The future y-coordinate of the player.
   */
  handleCollision(nextWall: Link, futureX: number, futureY: number): void {
    switch (this.direction) {
      case DIRECTIONS.RIGHT: {
        const tooMuch = futureX >= nextWall.n1.x ? futureX - nextWall.n1.x : futureX - nextWall.n2.x;
        this.x = this.x + this.speed - tooMuch;
        this.direction = nextWall.includesY(futureY) ? DIRECTIONS.DOWN : DIRECTIONS.UP;
        break;
      }
      case DIRECTIONS.LEFT: {
        const notEnough = futureX <= nextWall.n1.x ? nextWall.n1.x - futureX : nextWall.n2.x - futureX;
        this.x = this.x - this.speed + notEnough;
        this.direction = nextWall.includesY(futureY) ? DIRECTIONS.UP : DIRECTIONS.DOWN;
        break;
      }
      case DIRECTIONS.DOWN: {
        const tooMuch = futureY >= nextWall.n1.y ? futureY - nextWall.n1.y : futureY - nextWall.n2.y;
        this.y = this.y + this.speed - tooMuch;
        this.direction = nextWall.includesX(futureX) ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
        break;
      }
      case DIRECTIONS.UP: {
        const notEnough = futureY <= nextWall.n1.y ? nextWall.n1.y - futureY : nextWall.n2.y - futureY;
        this.y = this.y - this.speed + notEnough;
        this.direction = nextWall.includesX(futureX) ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
        break;
      }
    }
  }
  
}
