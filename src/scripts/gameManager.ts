import { GestureDetail } from '@ionic/vue';
import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'
import { Territory } from "@/scripts/math/territory";
import { Player, DIRECTIONS } from "@/scripts/player";
import { Ennemy } from "@/scripts/ennemy";

export const CONTAINER_WIDTH = 301;
export const CONTAINER_HEIGHT = 493;

export class GameManager {
    gameWalls;
    territoryInProgress: Territory | null;
    player;
    ennemies;
    numberOfEnnemies;

    constructor(numberOfEnnemies = 1) {
        this.territoryInProgress = null;
        this.numberOfEnnemies = numberOfEnnemies;
        this.player = new Player();
        this.gameWalls = this.generateWalls();
        this.ennemies = this.generateEnnemies();
    }

    onManualMove(detail: GestureDetail) {
      this.player.isInArea = true;
      if (!this.territoryInProgress) {
        this.createTerritory();
      } else {
        this.drawTerritory();
      }
    
      const isHorizontalMove = Math.abs(detail.deltaX) > Math.abs(detail.deltaY);
    
      if (isHorizontalMove) {
        this.player.x += detail.deltaX > 0 ? this.player.speed : - this.player.speed;
        this.player.direction = detail.deltaX > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
      } else {
        this.player.y += detail.deltaY > 0 ? this.player.speed : - this.player.speed;
        this.player.direction = detail.deltaY > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
      }
    }

    createTerritory() {
        this.territoryInProgress = new Territory();
        this.territoryInProgress.addNode(this.player.x, this.player.y);
    }
  
    drawTerritory() {
        if (this.territoryInProgress) {
            this.territoryInProgress.addNode(this.player.x, this.player.y);
            for (let i = 1; i < this.territoryInProgress.nodes.length; i++) {
                this.territoryInProgress.addLink(this.territoryInProgress.nodes[i - 1], this.territoryInProgress.nodes[i]);
            }
        }
    }

    endTerritory() {
        if (this.territoryInProgress) {
            this.drawTerritory();
            console.log(this.territoryInProgress);
            for (const link of this.territoryInProgress.links) {
                this.gameWalls.push(link);
            }
            this.territoryInProgress = null;
        }
    }

    gameOver() {
        alert("Game Over");
    }

    playerCollidesEnnemy() {
        for (const ennemy of this.ennemies) {
          const playerCollidesX = this.player.x + this.player.midSize >= ennemy.x &&
                                   this.player.x - this.player.midSize <= ennemy.x;
      
          const playerCollidesY = this.player.y + this.player.midSize >= ennemy.y &&
                                   this.player.y - this.player.midSize <= ennemy.y;
      
          if (playerCollidesX && playerCollidesY) {
            this.gameOver();
            break;
          }
        }
      }
      

    ennemyCollidesWall(ennemy: Ennemy) {
        for (const wall of this.gameWalls) {
            if (wall.direction === 'horizontal' && Math.abs(ennemy.y - wall.n1.y) <= ennemy.midSize) {
                ennemy.speedY *= -1;
            }
            if (wall.direction === 'vertical' && Math.abs(ennemy.x - wall.n1.x) <= ennemy.midSize) {
                ennemy.speedX *= -1;
            }
          }
    }

    generateEnnemies() {
        const ennemies: Ennemy[] = [];
        for (let i=0; i<this.numberOfEnnemies; i++) {
            ennemies.push(new Ennemy());
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

    drawEnnemies(ctx: CanvasRenderingContext2D) {
        for (const ennemy of this.ennemies) {
            ennemy.draw(ctx);
            ennemy.onAutomaticMove();
            this.ennemyCollidesWall(ennemy);
        }
    }

    drawWalls(ctx: CanvasRenderingContext2D) {
        for (const wall of this.gameWalls) {
            wall.draw(ctx);
        }
    }

    drawPlayer(ctx: CanvasRenderingContext2D) {
        this.player.draw(ctx);
        this.player.onAutomaticMove();
        if (this.player.isInArea) {
            this.playerCollidesEnnemy();
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.drawWalls(ctx);
        if (this.territoryInProgress) {
            this.territoryInProgress.draw(ctx);
        }
        this.drawEnnemies(ctx);
        this.drawPlayer(ctx);
    }
}
