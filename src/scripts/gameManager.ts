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

    isGestureAuthorized(isHorizontalMove: boolean, directionX: number, directionY: number) {
        return (
          (isHorizontalMove
            && (this.player.direction !== DIRECTIONS.LEFT && this.player.direction !== DIRECTIONS.RIGHT)
            && ((directionX === DIRECTIONS.LEFT && this.player.x - this.player.speed > this.player.midSize)
              || (directionX === DIRECTIONS.RIGHT && this.player.x + this.player.speed < (CONTAINER_WIDTH - this.player.midSize))))
          || (!isHorizontalMove
            && (this.player.direction !== DIRECTIONS.UP && this.player.direction !== DIRECTIONS.DOWN)
            && ((directionY === DIRECTIONS.UP && this.player.y - this.player.speed > this.player.midSize)
              || (directionY === DIRECTIONS.DOWN && this.player.y + this.player.speed < (CONTAINER_HEIGHT - this.player.midSize))))
        );
      }
      

    onManualMove(detail: GestureDetail) {
        const isHorizontalMove = Math.abs(detail.deltaX) > Math.abs(detail.deltaY);
        const directionX = detail.deltaX > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
        const directionY = detail.deltaY > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;

        if (this.isGestureAuthorized(isHorizontalMove, directionX, directionY)) {
            this.player.isInArea = true;
            if (!this.territoryInProgress) {
                this.createTerritory();
            } else {
                this.drawTerritory(this.player.x, this.player.y);
            }
    
            if (isHorizontalMove) {
                this.player.x += detail.deltaX > 0 ? this.player.speed : - this.player.speed;
                this.player.direction = directionX;
            } else {
                this.player.y += detail.deltaY > 0 ? this.player.speed : - this.player.speed;
                this.player.direction = directionY;
            }
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

    endTerritory() {
        if (this.territoryInProgress) {
            let x = this.player.x;
            let y = this.player.y;
            switch (this.player.direction) {
                case DIRECTIONS.DOWN: x -= this.player.midSize; break;
                case DIRECTIONS.UP: x += this.player.midSize; break;
                case DIRECTIONS.LEFT: y -= this.player.midSize; break;
                case DIRECTIONS.RIGHT: y += this.player.midSize; break;
            }
            this.drawTerritory(x, y);
            this.completePolygon();
            for (const link of this.territoryInProgress.links) {
                this.gameWalls.push(link);
            }
            this.territoryInProgress = null;
        }
    }
  
    drawTerritory(x: number, y: number) {
        if (this.territoryInProgress) {
            this.territoryInProgress.addNode(x, y);
            this.territoryInProgress.addLink(
                this.territoryInProgress.nodes[this.territoryInProgress.nodes.length - 2],
                this.territoryInProgress.nodes[this.territoryInProgress.nodes.length - 1]
            );
        }
    }

    completePolygon() {
        if (this.territoryInProgress) {
            const firstPos = this.territoryInProgress.nodes[0];
            const lastPos = this.territoryInProgress.nodes[this.territoryInProgress.nodes.length - 1];
            const firstDirection = this.territoryInProgress.links[0].direction;
            const lastDirection = this.territoryInProgress.links[this.territoryInProgress.links.length - 1].direction;

            if (firstDirection != lastDirection) {
                this.drawTerritory(
                    lastDirection === "horizontal" ? lastPos.x : firstPos.x,
                    lastDirection === "horizontal" ? firstPos.y : lastPos.y
                );
                this.addLinkToTerritory();
            }
            else if (firstDirection == lastDirection) {
                if (this.areCoordinatesEqual(firstPos, lastPos) && this.territoryInProgress.links.length > 1) {
                    this.addLinkToTerritory();
                } else {
                    this.handleSameDirectionCase(lastPos, lastDirection);
                }
            } else {
                this.addLinkToTerritory();
            }

            if (this.territoryInProgress.nodes.length != this.territoryInProgress.links.length) {
                this.completePolygon();
            }
        }
    }

    handleSameDirectionCase(lastPos: Node, lastDirection: string) {
        if (lastDirection === "horizontal") {
            const y = lastPos.y > Math.ceil(CONTAINER_HEIGHT / 2) ?
                (CONTAINER_HEIGHT - this.player.size - 2) : this.player.size + 2;
            this.drawTerritory(lastPos.x, y);
        } else {
            const x = lastPos.x > Math.ceil(CONTAINER_WIDTH / 2) ?
                (CONTAINER_WIDTH - this.player.size - 2) : this.player.size + 2;
            this.drawTerritory(x, lastPos.y);
        }
    }

    areCoordinatesEqual(n1: Node, n2: Node) {
        return n1.x === n2.x || n1.y === n2.y;
    }

    addLinkToTerritory() {
        this.territoryInProgress?.addLink(
            this.territoryInProgress.nodes[0],
            this.territoryInProgress.nodes[this.territoryInProgress.nodes.length - 1]
        );
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
