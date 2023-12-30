import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'

export class Graph {
    nodes: Node[];
    links: Link[];

    constructor(nodes: Node[] = [], links: Link[] = []) {
        this.nodes = nodes;
        this.links = links;
    }

    addLink(link: Link) {
        if (!this.containsLink(link)) {
            this.links.push(link);
            return true;
        }
        return false;
    }

    addNode(node: Node) {
        if (!this.containsNode(node)) {
            this.nodes.push(node);
            return true;
        }
        return false;
    }

    containsLink(link: Link) {
        return this.links.find((l) => l.equals(link));
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
