export const randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
};

export const isBetween = function(point: number, a: number, b: number) {
    const min = Math.min.apply(Math, [a, b]);
    const max = Math.max.apply(Math, [a, b]);
    return point > min && point < max;
};
