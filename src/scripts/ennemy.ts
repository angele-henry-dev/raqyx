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
    } else if (y <= startLines || y >= containerRectHeight-1) {
        return [1, -1];
    } else return [1, 1];
};
