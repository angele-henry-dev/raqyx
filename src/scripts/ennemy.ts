import { Link } from '@/scripts/math/link'
import { Node } from '@/scripts/math/node';

export class Ennemy extends Node {
    speedX;
    speedY;
    midSize;

    constructor(x: number, y: number, {size = 8, speed = 1, color = "red"} = {}) {
        super(x, y, {size: size, color: color});
        const plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
        const plusOrMinusY = Math.random() < 0.5 ? -1 : 1;
        this.speedX = speed * plusOrMinusX;
        this.speedY = speed * plusOrMinusY;
        this.midSize = Math.ceil(this.size/2) + 1;
    }

    onAutomaticMove() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
      
    collidesWithHorizontalWall(wall: Link): boolean {
      return (
        Math.abs(this.y - wall.n1.y) <= this.midSize &&
        this.x < Math.max(wall.n1.x, wall.n2.x) &&
        this.x > Math.min(wall.n1.x, wall.n2.x)
      );
    }
    
    collidesWithVerticalWall(wall: Link): boolean {
      return (
        Math.abs(this.x - wall.n1.x) <= this.midSize &&
        this.y < Math.max(wall.n1.y, wall.n2.y) &&
        this.y > Math.min(wall.n1.y, wall.n2.y)
      );
    }
}
