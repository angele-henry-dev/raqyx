import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'

export class Graph {
    nodes: Node[];
    links: Link[];

    constructor(nodes: Node[] = [], links: Link[] = []) {
        this.nodes = nodes;
        this.links = links;
    }

    addNode(node: Node) {
        this.nodes.push(node);
    }

    tryAddNode(node: Node) {
        if (!this.containsNode(node)) {
            this.addNode(node);
            return true;
        }
        return false;
    }

    containsNode(node: Node) {
        return this.nodes.find((n) => n.equals(node));
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
