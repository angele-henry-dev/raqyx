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
        let x = this.player.x;
        let y = this.player.y;
        switch (this.player.direction) {
            case DIRECTIONS.DOWN: x -= this.player.midSize; break;
            case DIRECTIONS.UP: x += this.player.midSize; break;
            case DIRECTIONS.LEFT: y -= this.player.midSize; break;
            case DIRECTIONS.RIGHT: y += this.player.midSize; break;
        }
        this.territoryInProgress.addNode(x, y);
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

    detectWallCollision() {
        const { player } = this;
    
        switch (true) {
        case player.y <= player.midSize && player.x < CONTAINER_WIDTH - player.midSize:
            player.direction = DIRECTIONS.RIGHT;
            return true;
        case player.y >= CONTAINER_HEIGHT - player.midSize && player.x > player.midSize:
            player.direction = DIRECTIONS.LEFT;
            return true;
        case player.x <= player.midSize && player.y > player.midSize:
            player.direction = DIRECTIONS.UP;
            return true;
        case player.x >= CONTAINER_WIDTH - player.midSize && player.y < CONTAINER_HEIGHT - player.midSize:
            player.direction = DIRECTIONS.DOWN;
            return true;
        default:
            return false;
        }
    }
    
    playerCollidesWall() {
        const didCollide = this.detectWallCollision();
    
        if (didCollide && this.territoryInProgress) {
            this.endTerritory();
        }
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

      ennemyCollidesWalls(ennemy: Ennemy) {
        for (const link of this.gameWalls) {
          if (link.direction === 'horizontal' && this.collidesWithHorizontalWall(ennemy, link)) {
            ennemy.speedY *= -1;
          } else if (link.direction === 'vertical' && this.collidesWithVerticalWall(ennemy, link)) {
            ennemy.speedX *= -1;
          }
        }
      }

      ennemyCollidesTerritoryInProgess(ennemy: Ennemy) {
        if (this.territoryInProgress) {
            for (const link of this.territoryInProgress.links) {
                if (this.collidesWithHorizontalWall(ennemy, link) || this.collidesWithVerticalWall(ennemy, link)) {
                    this.gameOver();
                }
            }
        }
      }
      
      collidesWithHorizontalWall(ennemy: Ennemy, wall: Link): boolean {
        return (
          Math.abs(ennemy.y - wall.n1.y) <= ennemy.midSize &&
          ennemy.x < Math.max(wall.n1.x, wall.n2.x) &&
          ennemy.x > Math.min(wall.n1.x, wall.n2.x)
        );
      }
      
      collidesWithVerticalWall(ennemy: Ennemy, wall: Link): boolean {
        return (
          Math.abs(ennemy.x - wall.n1.x) <= ennemy.midSize &&
          ennemy.y < Math.max(wall.n1.y, wall.n2.y) &&
          ennemy.y > Math.min(wall.n1.y, wall.n2.y)
        );
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
            this.ennemyCollidesWalls(ennemy);
            this.ennemyCollidesTerritoryInProgess(ennemy);
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
        this.playerCollidesWall();
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
