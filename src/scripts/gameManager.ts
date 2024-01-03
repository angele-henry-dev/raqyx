import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'
import { Player } from "@/scripts/player";
import { Ennemy } from "@/scripts/ennemy";

export const CONTAINER_WIDTH = 301;
export const CONTAINER_HEIGHT = 493;

export class GameManager {
    gameWalls;
    player;
    ennemies;
    numberOfEnnemies;

    constructor(numberOfEnnemies = 1) {
        this.numberOfEnnemies = numberOfEnnemies;
        this.player = new Player();
        this.gameWalls = this.generateWalls();
        this.ennemies = this.generateEnnemies();
    }

    gameOver() {
        alert("Game Over");
    }

    playerCollidesEnnemy() {
        for (const ennemy of this.ennemies) {
            if (
                (this.player.x <= (ennemy.x + this.player.midSize) && this.player.x >= (ennemy.x - this.player.midSize)) &&
                (this.player.y <= (ennemy.y + this.player.midSize) && this.player.y >= (ennemy.y - this.player.midSize))
            ) {
                this.gameOver();
            }
        }
    }

    generateEnnemies() {
        const ennemies: Ennemy[] = [];
        for (let i=0; i<this.numberOfEnnemies; i++) {
            ennemies.push(
                new Ennemy(this.gameWalls)
            );
        }
        return ennemies;
    }

    generateWalls() {
        const left = this.player.size + 2;
        const top = this.player.size + 2;
        const right = CONTAINER_WIDTH - this.player.size - 2;
        const bottom = CONTAINER_HEIGHT - this.player.size - 2;
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
        return [topWall, bottomWall, leftWall, rightWall];
    }

    generateTerritories(ctx: CanvasRenderingContext2D) {
        for (const territory of this.player.territories) {
            territory.draw(ctx);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Draw
        for (const wall of this.gameWalls) {
            wall.draw(ctx);
        }
        for (const ennemy of this.ennemies) {
            ennemy.draw(ctx);
        }
        this.player.draw(ctx);
    
        // Moves
        this.player.onAutomaticMove();
        this.generateTerritories(ctx);
        for (const ennemy of this.ennemies) {
          ennemy.onAutomaticMove();
        }
        if (this.player.isInArea) {
            this.playerCollidesEnnemy();
        }
    }
}
