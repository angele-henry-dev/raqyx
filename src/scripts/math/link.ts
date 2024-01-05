import { Node } from '@/scripts/math/node'

export class Link {
    n1;
    n2;
    width;
    color;
    direction;

    constructor(n1: Node, n2: Node, { width = 2, color = "white" } = {}) {
        this.n1 = n1;
        this.n2 = n2;
        this.width = width;
        this.color = color;
        this.direction = this.n1.x == this.n2.x ? "vertical" : "horizontal";
    }

    equals(link: Link) {
        return this.includes(link.n1) && this.includes(link.n2);
    }

    includes(node: Node) {
        return this.n1.equals(node) || this.n2.equals(node);
    }

    includesX(node: Node) {
        return (node.x >= this.n1.x && node.x <= this.n2.x) || (node.x >= this.n2.x && node.x <= this.n1.x);
    }

    includesY(node: Node) {
        return (node.y >= this.n1.y && node.y <= this.n2.y) || (node.y >= this.n2.y && node.y <= this.n1.y);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.n1.x, this.n1.y);
        ctx.lineTo(this.n2.x, this.n2.y);
        ctx.stroke();
    }
}
