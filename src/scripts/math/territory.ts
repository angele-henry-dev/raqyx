import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'
import { randomIntFromInterval } from '@/scripts/utils'

const TERRITORIES_COLORS = ["blue", "green", "orange", "red", "pink", "purple"];

export class Territory {
    nodes: Node[];
    links: Link[];
    color;

    constructor() {
        this.color = TERRITORIES_COLORS[randomIntFromInterval(0, TERRITORIES_COLORS.length - 1)];
        this.nodes = [];
        this.links = [];
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

    addLink(n1: Node, n2: Node) {
        const link = new Link(n1, n2, {color: this.color});
        if (!this.containsLink(link) && !link.n1.equals(link.n2)) {
            this.links.push(link);
            return true;
        }
        return false;
    }

    addNode(x: number, y: number) {
        const node = new Node(x, y, {size: 2, color: this.color});
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
