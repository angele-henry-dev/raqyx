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
    startLine: number
) => {
    if (x <= startLine || x >= containerRectWidth) {
        return [-1, 1];
    } else if (y <= startLine || y >= containerRectHeight-1) {
        return [1, -1];
    } else return [1, 1];
};
