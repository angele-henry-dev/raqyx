import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'

export class Graph {
    nodes: Node[];
    links: Link[];

    constructor(nodes: Node[] = [], links: Link[] = []) {
        this.nodes = nodes;
        this.links = links;
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const link of this.links) {
            link.draw(ctx);
        }
        for (const node of this.nodes) {
            node.draw(ctx);
        }
    }
}
