import { Graph } from "@/scripts/math/graph";
import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'
import { Player } from "@/scripts/player";
import { Ennemy } from "@/scripts/ennemy";

export const CONTAINER_WIDTH = 301;
export const CONTAINER_HEIGHT = 493;

export class GameManager {
    TERRITORIES_COLORS = ["blue", "green", "orange", "red", "pink", "purple"];

    gameWalls: Link[] = [];
    player: Player | null = null;
    ennemies: Ennemy[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.player = new Player();

        const topWall = new Link(
            new Node((this.player.size * 2), (this.player.size * 2)),
            new Node((CONTAINER_WIDTH - (this.player.size * 2)), (this.player.size * 2))
        );
        const bottomWall = new Link(
            new Node((this.player.size * 2), (CONTAINER_HEIGHT - this.player.size * 2)),
            new Node((CONTAINER_WIDTH - (this.player.size * 2)), (CONTAINER_HEIGHT - this.player.size * 2))
        );
        const leftWall = new Link(
            new Node((this.player.size * 2), (this.player.size * 2)),
            new Node((this.player.size * 2), (CONTAINER_HEIGHT - this.player.size * 2))
        );
        const rightWall = new Link(
            new Node((CONTAINER_WIDTH - (this.player.size * 2)), (this.player.size * 2)),
            new Node((CONTAINER_WIDTH - (this.player.size * 2)), (CONTAINER_HEIGHT - this.player.size * 2))
        );
        this.gameWalls = [topWall, bottomWall, leftWall, rightWall];
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.player?.draw(ctx, { color: "green" });
        for (const wall of this.gameWalls) {
            wall.draw(ctx);
        }
    }
}
