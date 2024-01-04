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
        return node.x == this.x && node.y == this.y;
    }

    getNearestNode(nodes: Node[], threshold = 10) {
        let minDist = Number.MAX_SAFE_INTEGER;
        let nearest = null;
        for (const node of nodes) {
            const dist = this.distance(node, this);
            if (dist < minDist) {
                minDist = dist;
                nearest = node;
            }
        }
        return nearest;
    }

    distance(n1: Node, n2: Node) {
        return Math.hypot(n1.x - n2.x, n1.y, n2.y);
    }

    draw(ctx: CanvasRenderingContext2D) {
        const radius = this.size / 2;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
