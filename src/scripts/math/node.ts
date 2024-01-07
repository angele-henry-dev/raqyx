export class Node {
    x: number;
    y: number;
    size: number;
    color: string;

    /**
     * Creates an instance of the Node class.
     * @param x The x-coordinate of the node.
     * @param y The y-coordinate of the node.
     * @param options Optional parameters like size and color.
     */
    constructor(x: number, y: number, { size = 2, color = "white" }: { size?: number; color?: string } = {}) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    /**
     * Checks if two nodes are equal in terms of x and y coordinates.
     * @param node The node to compare.
     * @returns true if the nodes are equal, otherwise false.
     */
    equals(node: Node): boolean {
        return node.x === this.x && node.y === this.y;
    }

    /**
     * Draws the node on the canvas context.
     * @param ctx The canvas context.
     */
    draw(ctx: CanvasRenderingContext2D): void {
        const radius: number = this.size / 2;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
