import { Node } from '@/scripts/math/node';
import { Link } from '@/scripts/math/link';

/**
 * Represents a territory in the game, which consists of nodes and links.
 * A territory is formed as the player draws boundaries on the screen.
 */
export class Territory {
    nodes: Node[];
    links: Link[];
    color: string;

    /**
     * Creates an instance of the Territory class.
     * @param color The color of the territory. Default is "orange".
     */
    constructor(color = "orange") {
        this.color = color;
        this.nodes = [];
        this.links = [];
    }

    /**
     * Clears the nodes and links of the territory, resetting it.
     */
    clearGraph(): void {
        this.nodes = [];
        this.links = [];
    }

    /**
     * Gets all links in the territory that include a specific node.
     * @param node The node to check for links.
     * @returns An array of links associated with the provided node.
     */
    getLinksWithNodes(node: Node): Link[] {
        return this.links.filter((link) => link.includes(node));
    }

    /**
     * Removes a specific link from the territory.
     * @param link The link to be removed.
     */
    removeLink(link: Link): void {
        const index = this.links.indexOf(link);
        if (index !== -1) {
            this.links.splice(index, 1);
        }
    }

    /**
     * Removes a specific node from the territory and its associated links.
     * @param node The node to be removed.
     */
    removeNode(node: Node): void {
        const links = this.getLinksWithNodes(node);
        links.forEach((link) => this.removeLink(link));
        const nodeIndex = this.nodes.indexOf(node);
        if (nodeIndex !== -1) {
            this.nodes.splice(nodeIndex, 1);
        }
    }

    /**
     * Adds a new link to the territory between two nodes.
     * Adds also the given nodes if they are not yet added.
     * @param n1 The first node.
     * @param n2 The second node.
     * @returns True if the link was added successfully, otherwise false.
     */
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

    /**
     * Adds a new node to the territory at the specified coordinates.
     * @param x The x-coordinate of the new node.
     * @param y The y-coordinate of the new node.
     * @returns True if the node was added successfully, otherwise false.
     */
    addNode(x: number, y: number): boolean {
        const node = new Node(x, y, { size: 2, color: this.color });
        if (!this.containsNode(node)) {
            this.nodes.push(node);
            return true;
        }
        return false;
    }

    /**
     * Checks if a link of the territory includes any part of the given link.
     * @param link The link to check.
     * @returns True if the territory includes any part of the given link, otherwise false.
     */
    includesLink(link: Link): Link | null {
        return this.links.find((l) => l.includesX(link.n1.x) && l.includesY(link.n1.y) && l.includesX(link.n2.x) && l.includesY(link.n2.y)) || null;
    }

    /**
     * Checks if a specific link is already in the territory.
     * @param link The link to check.
     * @returns True if the link is in the territory, otherwise false.
     */
    containsLink(link: Link): boolean {
        return this.links.some((l) => l.equals(link));
    }

    /**
     * Checks if a specific node is already in the territory.
     * @param node The node to check.
     * @returns True if the node is in the territory, otherwise false.
     */
    containsNode(node: Node): boolean {
        return this.nodes.some((n) => n.equals(node));
    }

    /**
     * Draws a territory by adding a node and link based on the provided coordinates.
     * @param x The x-coordinate of the new node.
     * @param y The y-coordinate of the new node.
     */
    drawTerritory(x: number, y: number): void {
        this.addNode(x, y);
        this.addLink(
            this.nodes[this.nodes.length - 2],
            this.nodes[this.nodes.length - 1]
        );
    }

    /**
     * Completes the territory in progress by checking the direction of the first and last links
     * and adding the final link to close the territory.
     * @param CONTAINER_HEIGHT The height of the container.
     * @param CONTAINER_WIDTH The width of the container.
     * @param borderWidth The width of the border.
     */
    completeTerritory(CONTAINER_HEIGHT: number, CONTAINER_WIDTH: number, borderWidth: number): void {
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
            this.completeTerritory(CONTAINER_HEIGHT, CONTAINER_WIDTH, borderWidth);
        }
    }

    /**
     * Handles the case where the first and last links have the same direction.
     * Adjusts the coordinates to close the territory properly.
     * @param lastPos The last node's position.
     * @param lastDirection The direction of the last link.
     * @param CONTAINER_HEIGHT The height of the container.
     * @param CONTAINER_WIDTH The width of the container.
     * @param borderWidth The width of the border.
     */
    handleSameDirectionCase(lastPos: Node, lastDirection: string, CONTAINER_HEIGHT: number, CONTAINER_WIDTH: number, borderWidth: number): void {
        if (lastDirection === "horizontal") {
            const y = lastPos.y > Math.ceil(CONTAINER_HEIGHT / 2) ? (CONTAINER_HEIGHT - borderWidth) : borderWidth;
            this.drawTerritory(lastPos.x, y);
        } else {
            const x = lastPos.x > Math.ceil(CONTAINER_WIDTH / 2) ? (CONTAINER_WIDTH - borderWidth) : borderWidth;
            this.drawTerritory(x, lastPos.y);
        }
    }

    /**
     * Checks if the coordinates of two nodes are equal.
     * @param n1 The first node.
     * @param n2 The second node.
     * @returns True if the coordinates are equal, otherwise false.
     */
    areCoordinatesEqual(n1: Node, n2: Node): boolean {
        return n1.x === n2.x || n1.y === n2.y;
    }

    /**
     * Adds the final link to close the territory.
     */
    addFinalLinkToTerritory(): void {
        this.addLink(
            this.nodes[0],
            this.nodes[this.nodes.length - 1]
        );
    }

    drawLines(ctx: CanvasRenderingContext2D) {
        this.links.forEach((link) => link.drawRect(ctx));
    }

    /**
     * Draws the territory by rendering its nodes and links on the canvas.
     * @param ctx The CanvasRenderingContext2D to draw on.
     */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.links[0].n1.x, this.links[0].n1.y);
        this.links.forEach((link) => link.draw(ctx));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

