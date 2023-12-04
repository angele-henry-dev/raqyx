import { Player } from "./player";

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

export const collideTerritories = (ctx: CanvasRenderingContext2D, ennemy: Ennemy) => {
    // if (ctx) {
    //   const p = ctx.getImageData(ennemy.x, ennemy.y, 1, 1).data;
    //   if (p[0] != 0 || p[1] != 0 || p[2] != 0 || p[3] != 255) {
    //     console.log(p[1]);
    //     return true;
    //   } else {console.log(p[1]);}
    // }
    return false;
};
