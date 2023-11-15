export const randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
};

export const isGoingBackOnBorder = (
    x: number,
    y: number,
    containerRectWidth: number,
    containerRectHeight: number,
    startLine: number
) => {
    return (x <= startLine || x >= containerRectWidth
        || y <= startLine || y >= containerRectHeight-1)
};
