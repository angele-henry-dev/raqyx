import { randomIntFromInterval } from "./utils";
import { Node } from '@/scripts/math/node';
import { Link } from '@/scripts/math/link';
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@/scripts/gameManager';

export class Ennemy extends Node {
    size;
    speedX;
    speedY;
    color;
    midSize;
    gameWalls;

    constructor(gameWalls: Link[], {size = 8, speed = 1.5, color = "red"} = {}) {
        super(0, 0);
        this.gameWalls = gameWalls;
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

    onCollideBorder() {
        // [topWall, bottomWall, leftWall, rightWall]
        if (this.y <= (this.gameWalls[0].n1.y + this.midSize)) {
            this.speedY *= -1;
        }
        if (this.y >= (this.gameWalls[1].n1.y - this.midSize)) {
            this.speedY *= -1;
        }
        if (this.x <= (this.gameWalls[2].n1.x + this.midSize)) {
            this.speedX *= -1;
        }
        if (this.x >= (this.gameWalls[3].n1.x) - this.midSize) {
            this.speedX *= -1;
        }
    }

    onAutomaticMove() {
        this.onCollideBorder();
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

// export interface Ennemy {
//     x: number;
//     y: number;
//     speedX: number;
//     speedY: number;
//     intervalId: number;
// }

// export const collideBorder = (
//     x: number,
//     y: number,
//     containerRectWidth: number,
//     containerRectHeight: number,
//     startLines: number,
// ) => {
//     if (x <= startLines || x >= containerRectWidth) {
//         return [-1, 1];
//     } else if (y <= startLines || y >= containerRectHeight) {
//         return [1, -1];
//     } else return [1, 1];
// };

// export const collidePlayer = (ennemy: Ennemy, playerTable: Player, PLAYERS_SIZE: number) => {
//     if (
//         (playerTable.x <= (ennemy.x + PLAYERS_SIZE - 2) && playerTable.x >= (ennemy.x - PLAYERS_SIZE + 2)) &&
//         (playerTable.y <= (ennemy.y + PLAYERS_SIZE - 2) && playerTable.y >= (ennemy.y - PLAYERS_SIZE + 2))
//     ) {
//         return true;
//     }
//     return false;
// };

// export const collideTerritories = (territoryPoints: TerritoryTemp[], ennemy: Ennemy, PLAYERS_SIZE: number) => {
//     if (territoryPoints.length <= 1) {
//         return false;
//     }
//     for (let i = 1; i < territoryPoints.length; i++) {
//         let top = territoryPoints[i].top;
//         let left = territoryPoints[i].left;
//         if (ennemy.speedY < 0) { top = territoryPoints[i].top + PLAYERS_SIZE; }
//         else if (ennemy.speedX < 0) { left = territoryPoints[i].left + PLAYERS_SIZE; }

//         if ((ennemy.y == top && isBetween(ennemy.x, left, territoryPoints[i - 1].left))
//         || (ennemy.x == left && isBetween(ennemy.y, top, territoryPoints[i - 1].top))) {
//             return true;
//         }
//     }
//     return false;
// };
