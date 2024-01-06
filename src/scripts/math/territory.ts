import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'

export class Territory {
    nodes: Node[];
    links: Link[];
    color;

    constructor(color = "green") {
        this.color = color;
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
  
    drawTerritory(x: number, y: number) {
        this.addNode(x, y);
        this.addLink(
            this.nodes[this.nodes.length - 2],
            this.nodes[this.nodes.length - 1]
        );
    }

    completePolygon(CONTAINER_HEIGHT: number, CONTAINER_WIDTH: number, borderWidth: number) {
        const firstPos = this.nodes[0];
        const lastPos = this.nodes[this.nodes.length - 1];
        const firstDirection = this.links[0].direction;
        const lastDirection = this.links[this.links.length - 1].direction;

        if (firstDirection != lastDirection) {
            this.drawTerritory(
                lastDirection === "horizontal" ? lastPos.x : firstPos.x,
                lastDirection === "horizontal" ? firstPos.y : lastPos.y
            );
            this.addFinalLinkToTerritory();
        }
        else if (firstDirection === lastDirection) {
            if (this.areCoordinatesEqual(firstPos, lastPos) && this.links.length > 1) {
                this.addFinalLinkToTerritory();
            } else {
                this.handleSameDirectionCase(lastPos, lastDirection, CONTAINER_HEIGHT, CONTAINER_WIDTH, borderWidth);
            }
        } else {
            this.addFinalLinkToTerritory();
        }

        if (this.nodes.length != this.links.length) {
            this.completePolygon(CONTAINER_HEIGHT, CONTAINER_WIDTH, borderWidth);
        }
    }

    handleSameDirectionCase(lastPos: Node, lastDirection: string, CONTAINER_HEIGHT: number, CONTAINER_WIDTH: number, borderWidth: number) {
        if (lastDirection === "horizontal") {
            const y = lastPos.y > Math.ceil(CONTAINER_HEIGHT / 2) ?
                (CONTAINER_HEIGHT - borderWidth) : borderWidth;
            this.drawTerritory(lastPos.x, y);
        } else {
            const x = lastPos.x > Math.ceil(CONTAINER_WIDTH / 2) ?
                (CONTAINER_WIDTH - borderWidth) : borderWidth;
            this.drawTerritory(x, lastPos.y);
        }
    }

    areCoordinatesEqual(n1: Node, n2: Node) {
        return n1.x === n2.x || n1.y === n2.y;
    }

    addFinalLinkToTerritory() {
        this.addLink(
            this.nodes[0],
            this.nodes[this.nodes.length - 1]
        );
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
