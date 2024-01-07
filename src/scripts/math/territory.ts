import { Node } from '@/scripts/math/node';
import { Link } from '@/scripts/math/link';

export class Territory {
    nodes: Node[];
    links: Link[];
    color: string;

    constructor(color = "green") {
        this.color = color;
        this.nodes = [];
        this.links = [];
    }

    clearGraph(): void {
        this.nodes = [];
        this.links = [];
    }

    getLinksWithNodes(node: Node): Link[] {
        return this.links.filter((link) => link.includes(node));
    }

    removeLink(link: Link): void {
        const index = this.links.indexOf(link);
        if (index !== -1) {
            this.links.splice(index, 1);
        }
    }

    removeNode(node: Node): void {
        const links = this.getLinksWithNodes(node);
        links.forEach((link) => this.removeLink(link));
        const nodeIndex = this.nodes.indexOf(node);
        if (nodeIndex !== -1) {
            this.nodes.splice(nodeIndex, 1);
        }
    }

    addLink(n1: Node, n2: Node): boolean {
        const link = new Link(n1, n2, { color: this.color });
        if (!this.containsLink(link) && !link.n1.equals(link.n2)) {
            this.links.push(link);
            this.addNode(n1.x, n1.y);
            this.addNode(n2.x, n2.y);
            return true;
        }
        return false;
    }

    addNode(x: number, y: number): boolean {
        const node = new Node(x, y, { size: 2, color: this.color });
        if (!this.containsNode(node)) {
            this.nodes.push(node);
            return true;
        }
        return false;
    }

    includesLink(link: Link): Link | null {
        return this.links.find((l) => l.includesX(link.n1.x) && l.includesY(link.n1.y) && l.includesX(link.n2.x) && l.includesY(link.n2.y)) || null;
    }

    containsLink(link: Link): boolean {
        return this.links.some((l) => l.equals(link));
    }

    containsNode(node: Node): boolean {
        return this.nodes.some((n) => n.equals(node));
    }

    drawTerritory(x: number, y: number): void {
        this.addNode(x, y);
        this.addLink(
            this.nodes[this.nodes.length - 2],
            this.nodes[this.nodes.length - 1]
        );
    }

    completePolygon(CONTAINER_HEIGHT: number, CONTAINER_WIDTH: number, borderWidth: number): void {
        const firstPos = this.nodes[0];
        const lastPos = this.nodes[this.nodes.length - 1];
        const firstDirection = this.links[0].direction;
        const lastDirection = this.links[this.links.length - 1].direction;

        if (firstDirection !== lastDirection) {
            this.drawTerritory(
                lastDirection === "horizontal" ? lastPos.x : firstPos.x,
                lastDirection === "horizontal" ? firstPos.y : lastPos.y
            );
            this.addFinalLinkToTerritory();
        } else if (firstDirection === lastDirection) {
            if (this.areCoordinatesEqual(firstPos, lastPos) && this.links.length > 1) {
                this.addFinalLinkToTerritory();
            } else {
                this.handleSameDirectionCase(lastPos, lastDirection, CONTAINER_HEIGHT, CONTAINER_WIDTH, borderWidth);
            }
        } else {
            this.addFinalLinkToTerritory();
        }

        if (this.nodes.length !== this.links.length) {
            this.completePolygon(CONTAINER_HEIGHT, CONTAINER_WIDTH, borderWidth);
        }
    }

    handleSameDirectionCase(lastPos: Node, lastDirection: string, CONTAINER_HEIGHT: number, CONTAINER_WIDTH: number, borderWidth: number): void {
        if (lastDirection === "horizontal") {
            const y = lastPos.y > Math.ceil(CONTAINER_HEIGHT / 2) ? (CONTAINER_HEIGHT - borderWidth) : borderWidth;
            this.drawTerritory(lastPos.x, y);
        } else {
            const x = lastPos.x > Math.ceil(CONTAINER_WIDTH / 2) ? (CONTAINER_WIDTH - borderWidth) : borderWidth;
            this.drawTerritory(x, lastPos.y);
        }
    }

    areCoordinatesEqual(n1: Node, n2: Node): boolean {
        return n1.x === n2.x || n1.y === n2.y;
    }

    addFinalLinkToTerritory(): void {
        this.addLink(
            this.nodes[0],
            this.nodes[this.nodes.length - 1]
        );
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.links.forEach((link) => link.draw(ctx));
        this.nodes.forEach((node) => node.draw(ctx));
    }
}

