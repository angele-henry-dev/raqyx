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
    PLAYER_SIZE: number,
) => {
    if (x <= (PLAYER_SIZE / 2) + 1 || x >= containerRectWidth) {
        return [-1, 1];
    } else if (y <= (PLAYER_SIZE / 2) + 1 || y >= containerRectHeight-1) {
        return [1, -1];
    } else return [1, 1];
};
