import { Graph } from "@/scripts/math/graph";
import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'
import { Player } from "@/scripts/player";
import { Ennemy } from "@/scripts/ennemy";

export const CONTAINER_WIDTH = 301;
export const CONTAINER_HEIGHT = 493;

export class GameManager {
    DPR = window.devicePixelRatio || 1;
    TERRITORIES_COLORS = ["blue", "green", "orange", "red", "pink", "purple"];

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null = null;
    graph = new Graph();
    gameWalls: Link[] = [];
    player: Player | null = null;
    ennemies: Ennemy[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.player = new Player();
        this.canvas = canvas;

        canvas.width = CONTAINER_WIDTH * this.DPR;
        canvas.height = CONTAINER_HEIGHT * this.DPR;
        canvas.style.width = `${CONTAINER_WIDTH}px`;
        canvas.style.height = `${CONTAINER_HEIGHT}px`;

        this.ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });

        if (this.ctx) {
            this.ctx.scale(this.DPR, this.DPR);

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
    }

    draw() {
        if (this.ctx) {
            this.graph.draw(this.ctx);
            this.player?.draw(this.ctx, { color: "green" });
            for (const wall of this.gameWalls) {
                wall.draw(this.ctx);
            }
        }
    }

    animate() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
            this.graph.draw(this.ctx);
            requestAnimationFrame(this.animate);
        }
    }
}
