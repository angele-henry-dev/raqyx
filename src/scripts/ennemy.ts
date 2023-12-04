import { Player } from "./player";
import { TerritoryTemp } from "./territory";

export interface Ennemy {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
    intervalId: number;
}

export const collideBorder = (
    x: number,
    y: number,
    containerRectWidth: number,
    containerRectHeight: number,
    startLines: number,
) => {
    if (x <= startLines || x >= containerRectWidth) {
        return [-1, 1];
    } else if (y <= startLines || y >= containerRectHeight) {
        return [1, -1];
    } else return [1, 1];
};

export const collidePlayer = (ennemy: Ennemy, playerTable: Player, PLAYERS_SIZE: number) => {
    if (
        (playerTable.x <= (ennemy.x + PLAYERS_SIZE - 2) && playerTable.x >= (ennemy.x - PLAYERS_SIZE + 2)) &&
        (playerTable.y <= (ennemy.y + PLAYERS_SIZE - 2) && playerTable.y >= (ennemy.y - PLAYERS_SIZE + 2))
    ) {
        return true;
    }
    return false;
};

export const isBetween = function(point: number, a: number, b: number) {
    const min = Math.min.apply(Math, [a, b]);
    const max = Math.max.apply(Math, [a, b]);
    return point > min && point < max;
};

export const collideTerritories = (territoryPoints: TerritoryTemp[], ennemy: Ennemy) => {
    if (territoryPoints.length <= 1) {
        return false;
    }
    for (let i = 1; i < territoryPoints.length; i++) {
        if ((ennemy.y == territoryPoints[i].top && isBetween(ennemy.x, territoryPoints[i].left, territoryPoints[i - 1].left))
        || (ennemy.x == territoryPoints[i].left && isBetween(ennemy.y, territoryPoints[i].top, territoryPoints[i - 1].top))) {
            return true;
        }
    }
    return false;
};
