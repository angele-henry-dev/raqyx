import { Graph } from "@/scripts/math/graph";
import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'
import { Player } from "@/scripts/player";
import { Ennemy } from "@/scripts/ennemy";

export const CONTAINER_WIDTH = 301;
export const CONTAINER_HEIGHT = 493;

export class GameManager {
    TERRITORIES_COLORS = ["blue", "green", "orange", "red", "pink", "purple"];

    gameWalls: Link[];
    player: Player;
    ennemies: Ennemy[];

    constructor() {
        this.player = new Player();
        this.ennemies = [];
        const left = (this.player.midSize * 2);
        const top = (this.player.midSize * 2);
        const right = (CONTAINER_WIDTH - (this.player.midSize * 2));
        const bottom = (CONTAINER_HEIGHT - this.player.midSize * 2);

        const topWall = new Link(
            new Node(left, top),
            new Node(right, top)
        );
        const bottomWall = new Link(
            new Node(left, bottom),
            new Node(right, bottom)
        );
        const leftWall = new Link(
            new Node(left, top),
            new Node(left, bottom)
        );
        const rightWall = new Link(
            new Node(right, top),
            new Node(right, bottom)
        );
        this.gameWalls = [topWall, bottomWall, leftWall, rightWall];
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.player.draw(ctx, { color: this.player.color });
        for (const wall of this.gameWalls) {
            wall.draw(ctx);
        }
    }
}
