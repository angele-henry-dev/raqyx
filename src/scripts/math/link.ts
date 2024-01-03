import { Node } from '@/scripts/math/node'

export class Link {
    p1;
    p2;
    width;
    color;

    constructor(p1: Node, p2: Node, { width = 2, color = "white" } = {}) {
        this.p1 = p1;
        this.p2 = p2;
        this.width = width;
        this.color = color;
    }

    equals(link: Link) {
        return this.includes(link.p1) && this.includes(link.p2);
    }

    includes(node: Node) {
        return this.p1.equals(node) || this.p2.equals(node);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
    }
}
