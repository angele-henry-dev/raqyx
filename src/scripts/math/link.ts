import { Node } from '@/scripts/math/node'

export class Link {
    p1: Node;
    p2: Node;

    constructor(p1: Node, p2: Node){
        this.p1 = p1;
        this.p2 = p2;
    }

    draw(ctx: CanvasRenderingContext2D, width = 2, color = "white") {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
    }
}
