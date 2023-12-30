export class Node {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(node: Node) {
        return node.x == this.x && node.y == this.y;
    }

    draw(ctx: CanvasRenderingContext2D, size = 8, color = "white") {
        const radius = size / 2;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
