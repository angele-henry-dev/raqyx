import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'

export class Graph {
    nodes: Node[];
    links: Link[];

    constructor(nodes: Node[] = [], links: Link[] = []) {
        this.nodes = nodes;
        this.links = links;
    }

    clearGraph() {
        this.nodes = [];
        this.links = [];
    }

    getLinksWithNodes(node: Node) {
        const links = [];
        for (const link of this.links) {
            if (link.includes(node)) {
                links.push(link);
            }
        }
        return links;
    }

    removeLink(link: Link) {
        this.links.splice(this.links.indexOf(link), 1);
    }

    removeNode(node: Node) {
        const links = this.getLinksWithNodes(node);
        for (const link of links) {
            this.removeLink(link);
        }
        this.nodes.splice(this.nodes.indexOf(node), 1);
    }

    addLink(link: Link) {
        if (!this.containsLink(link) && !link.p1.equals(link.p2)) {
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
