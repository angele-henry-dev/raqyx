import { Link } from '@/scripts/math/link';
import { Node } from '@/scripts/math/node';

export class Enemy extends Node {
    speedX: number;
    speedY: number;
    midSize: number;

    /**
     * Creates an instance of the Enemy class.
     * @param x The x-coordinate of the enemy.
     * @param y The y-coordinate of the enemy.
     * @param options Optional parameters like size, speed, and color.
     */
    constructor(x: number, y: number, { size = 8, speed = 1, color = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-tertiary') }: { size?: number; speed?: number; color?: string } = {}) {
        super(x, y, { size, color });
        const plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
        const plusOrMinusY = Math.random() < 0.5 ? -1 : 1;
        this.speedX = speed * plusOrMinusX;
        this.speedY = speed * plusOrMinusY;
        this.midSize = Math.ceil(this.size / 2) + 1;
    }

    /**
     * Moves the enemy automatically based on its speed.
     */
    onAutomaticMove(): void {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    /**
     * Checks if the enemy collides with a horizontal wall.
     * @param wall The horizontal wall represented by a Link.
     * @returns true if a collision occurs, otherwise false.
     */
    collidesWithHorizontalWall(wall: Link): boolean {
        return (
            Math.abs(this.y - wall.n1.y) <= this.midSize &&
            this.x < Math.max(wall.n1.x, wall.n2.x) &&
            this.x > Math.min(wall.n1.x, wall.n2.x)
        );
    }

    /**
     * Checks if the enemy collides with a vertical wall.
     * @param wall The vertical wall represented by a Link.
     * @returns true if a collision occurs, otherwise false.
     */
    collidesWithVerticalWall(wall: Link): boolean {
        return (
            Math.abs(this.x - wall.n1.x) <= this.midSize &&
            this.y < Math.max(wall.n1.y, wall.n2.y) &&
            this.y > Math.min(wall.n1.y, wall.n2.y)
        );
    }
}

