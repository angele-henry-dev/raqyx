import { Node } from '@/scripts/math/node';

export class Link {
    n1: Node;
    n2: Node;
    width: number;
    color: string;
    direction: "vertical" | "horizontal";

    /**
     * Creates an instance of the Link class.
     * @param n1 The first node of the link.
     * @param n2 The second node of the link.
     * @param options Optional parameters like width and color.
     */
    constructor(n1: Node, n2: Node, { width = 2, color = "orange" }: { width?: number; color?: string } = {}) {
        this.n1 = n1;
        this.n2 = n2;
        this.width = width;
        this.color = color;
        this.direction = this.n1.x === this.n2.x ? "vertical" : "horizontal";
    }

    /**
     * Checks if two links are equal by comparing the included nodes.
     * @param link The link to compare.
     * @returns true if the links are equal, otherwise false.
     */
    equals(link: Link): boolean {
        return this.includes(link.n1) && this.includes(link.n2);
    }

    /**
     * Checks if the link includes a specific node.
     * @param node The node to check for inclusion.
     * @returns true if the link includes the node, otherwise false.
     */
    includes(node: Node): boolean {
        return this.n1.equals(node) || this.n2.equals(node);
    }

    /**
     * Checks if the link includes any part of one of the link from the given links.
     * @param links The array of links to check for inclusion.
     * @returns The first included link if found, otherwise null.
     */
    includesLink(links: Link[]): Link | null {
        for (const l of links) {
            if (
                (this.includesX(l.n1.x) && this.includesY(l.n1.y)) &&
                (this.includesX(l.n2.x) && this.includesY(l.n2.y))
            ) {
                return l;
            }
        }
        return null;
    }

    /**
     * Checks if the link includes a specific x-coordinate.
     * @param x The x-coordinate to check for inclusion.
     * @returns true if the link includes the x-coordinate, otherwise false.
     */
    includesX(x: number): boolean {
        return (x >= this.n1.x && x <= this.n2.x) || (x >= this.n2.x && x <= this.n1.x);
    }

    /**
     * Checks if the link includes a specific y-coordinate.
     * @param y The y-coordinate to check for inclusion.
     * @returns true if the link includes the y-coordinate, otherwise false.
     */
    includesY(y: number): boolean {
        return (y >= this.n1.y && y <= this.n2.y) || (y >= this.n2.y && y <= this.n1.y);
    }

    /**
     * Draws the link on the canvas context.
     * @param ctx The canvas context.
     */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineTo(this.n2.x, this.n2.y);
    }

    /**
     * Draws the link on the canvas context.
     * @param ctx The canvas context.
     */
    drawRect(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.moveTo(this.n1.x, this.n1.y);
        ctx.lineTo(this.n2.x, this.n2.y);
        ctx.stroke();
    }
}

