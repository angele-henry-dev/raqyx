import { Player } from "./player";
import { TerritoryTemp } from "./territory";
import { isBetween } from "./utils";

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

export const collideTerritories = (territoryPoints: TerritoryTemp[], ennemy: Ennemy, PLAYERS_SIZE: number) => {
    if (territoryPoints.length <= 1) {
        return false;
    }
    for (let i = 1; i < territoryPoints.length; i++) {
        let top = territoryPoints[i].top;
        let left = territoryPoints[i].left;
        if (ennemy.speedY < 0) { top = territoryPoints[i].top + PLAYERS_SIZE; }
        else if (ennemy.speedX < 0) { left = territoryPoints[i].left + PLAYERS_SIZE; }

        if ((ennemy.y == top && isBetween(ennemy.x, left, territoryPoints[i - 1].left))
        || (ennemy.x == left && isBetween(ennemy.y, top, territoryPoints[i - 1].top))) {
            return true;
        }
    }
    return false;
};
