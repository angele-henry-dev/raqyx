export class Node {
    x;
    y;
    size;
    color;

    constructor(x: number, y: number, { size = 2, color = "white" } = {}) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    equals(node: Node) {
        return node.x === this.x && node.y === this.y;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const radius = this.size / 2;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
