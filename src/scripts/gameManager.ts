import { GestureDetail } from '@ionic/vue';
import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'
import { Territory } from "@/scripts/math/territory";
import { Player, DIRECTIONS } from "@/scripts/player";
import { Ennemy } from "@/scripts/ennemy";
import { randomIntFromInterval } from "./utils";

export const CONTAINER_WIDTH = 300;
export const CONTAINER_HEIGHT = 492;

export class GameManager {
    borderWidth = 10;
    wallWidth = 2;
    gameWalls;
    territoryInProgress: Territory | null;
    player;
    ennemies;
    numberOfEnnemies;

    constructor(numberOfEnnemies = 1) {
        this.territoryInProgress = null;
        this.numberOfEnnemies = numberOfEnnemies;
        this.gameWalls = this.generateWalls();
        this.player = new Player(this.borderWidth, this.borderWidth);
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
                this.territoryInProgress.drawTerritory(this.player.x, this.player.y);
            }
    
            if (isHorizontalMove) {
                this.player.direction = directionX;
            } else {
                this.player.direction = directionY;
            }
        }
    }

    createTerritory() {
        this.territoryInProgress = new Territory(this.player.color);
        const x = this.player.x;
        const y = this.player.y;
        this.territoryInProgress.addNode(this.player.x, this.player.y);
    }

    endTerritory() {
        if (this.territoryInProgress) {
            this.territoryInProgress.drawTerritory(this.player.x, this.player.y);
            this.territoryInProgress.completePolygon(CONTAINER_HEIGHT, CONTAINER_WIDTH, this.borderWidth);
            for (const link of this.territoryInProgress.links) {
                this.gameWalls.push(link);
            }
            this.territoryInProgress = null;
        }
    }

    gameOver() {
        alert("Game Over");
    }

    isWallOnTrajectory(player: Player, wall: Link) {
        const includesX = wall.includesX(player.x);
        const includesY = wall.includesY(player.y);
    
        if (
            (player.direction === DIRECTIONS.UP && wall.direction === 'horizontal' && player.y > wall.n1.y && player.y > wall.n2.y && includesX) ||
            (player.direction === DIRECTIONS.DOWN && wall.direction === 'horizontal' && player.y < wall.n1.y && player.y < wall.n2.y && includesX) ||
            (player.direction === DIRECTIONS.LEFT && wall.direction === 'vertical' && player.x > wall.n1.x && player.x > wall.n2.x && includesY) ||
            (player.direction === DIRECTIONS.RIGHT && wall.direction === 'vertical' && player.x < wall.n1.x && player.x < wall.n2.x && includesY)
        ) {
            return true;
        }
        return false;
    }
    
    getNextWall() {
        const { player, gameWalls } = this;
        let closestWall = null;
        let minDistance = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < gameWalls.length; i++) {
            const wall = gameWalls[i];
            if (this.isWallOnTrajectory(player, wall)) {
                const distance = wall.direction === 'horizontal' ? Math.abs(player.y - wall.n1.y) : Math.abs(player.x - wall.n1.x);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestWall = wall;
                }
            }
        }
        return closestWall;
    }

    detectWallCollision() {
        const nextWall = this.getNextWall();
        if (nextWall) {
            const futurePlusX = this.player.x + (this.player.speed * 2);
            const futurePlusY = this.player.y + (this.player.speed * 2);
            const futureMinusX = this.player.x - (this.player.speed * 2);
            const futureMinusY = this.player.y - (this.player.speed * 2);

            if (
                (futurePlusX == nextWall.n1.x || futurePlusX == nextWall.n2.x)
                || (futurePlusY == nextWall.n1.y || futurePlusY == nextWall.n2.y)
                || (futureMinusX == nextWall.n1.x || futureMinusX == nextWall.n2.x)
                || (futureMinusY == nextWall.n1.y || futureMinusY == nextWall.n2.y)
            ) {
                switch (this.player.direction) {
                    case DIRECTIONS.RIGHT:
                        this.player.x += (this.player.speed * 2);
                        if (nextWall.includesY(futurePlusY)) {
                            this.player.direction = DIRECTIONS.DOWN;
                        } else {
                            this.player.direction = DIRECTIONS.UP;
                        }
                        break;
                    case DIRECTIONS.LEFT:
                        this.player.x -= (this.player.speed * 2);
                        if (nextWall.includesY(futureMinusY)) {
                            this.player.direction = DIRECTIONS.UP;
                        } else {
                            this.player.direction = DIRECTIONS.DOWN;
                        }
                        break;
                    case DIRECTIONS.DOWN:
                        this.player.y += (this.player.speed * 2);
                        if (nextWall.includesX(futureMinusX)) {
                            this.player.direction = DIRECTIONS.LEFT;
                        } else {
                            this.player.direction = DIRECTIONS.RIGHT;
                        }
                        break;
                    case DIRECTIONS.UP:
                        this.player.y -= (this.player.speed * 2);
                        if (nextWall.includesX(futurePlusX)) {
                            this.player.direction = DIRECTIONS.RIGHT;
                        } else {
                            this.player.direction = DIRECTIONS.LEFT;
                        }
                        break;
                }
                return true;
            }
        }
        return false;
    }
    
    playerCollidesWall() {
        const didCollide = this.detectWallCollision();
        if (didCollide && this.territoryInProgress) {
            this.endTerritory();
        }
    }

    playerCollidesEnnemy(ennemy: Ennemy) {
        const playerCollidesX = this.player.x + this.player.midSize >= ennemy.x &&
                                this.player.x - this.player.midSize <= ennemy.x;
    
        const playerCollidesY = this.player.y + this.player.midSize >= ennemy.y &&
                                this.player.y - this.player.midSize <= ennemy.y;
        if (playerCollidesX && playerCollidesY) {
            this.gameOver();
        }
    }

    ennemyCollidesWalls(ennemy: Ennemy) {
        for (const link of this.gameWalls) {
            if (link.direction === 'horizontal' && ennemy.collidesWithHorizontalWall(link)) {
            ennemy.speedY *= -1;
            } else if (link.direction === 'vertical' && ennemy.collidesWithVerticalWall(link)) {
            ennemy.speedX *= -1;
            }
        }
    }

    ennemyCollidesTerritoryInProgess(ennemy: Ennemy) {
        if (this.territoryInProgress) {
            for (const link of this.territoryInProgress.links) {
                if (
                    ennemy.collidesWithHorizontalWall(link)
                    || ennemy.collidesWithVerticalWall(link)
                ) {
                    this.gameOver();
                }
            }
        }
    }

    generateEnnemies() {
        const ennemies: Ennemy[] = [];
        const min = (this.borderWidth + (this.wallWidth * 2));
        const xMax = (CONTAINER_WIDTH - min);
        const yMax = (CONTAINER_HEIGHT - min);
        for (let i=0; i<this.numberOfEnnemies; i++) {
            ennemies.push(new Ennemy(randomIntFromInterval(min, xMax), randomIntFromInterval(min, yMax)));
        }
        return ennemies;
    }

    generateWalls() {
        const left = this.borderWidth;
        const top = this.borderWidth;
        const right = CONTAINER_WIDTH - this.borderWidth;
        const bottom = CONTAINER_HEIGHT - this.borderWidth;
        const topWall = new Link(new Node(left, top), new Node(right, top), {width: this.wallWidth});
        const bottomWall = new Link(new Node(left, bottom), new Node(right, bottom), {width: this.wallWidth});
        const leftWall = new Link(new Node(left, top), new Node(left, bottom), {width: this.wallWidth});
        const rightWall = new Link(new Node(right, top), new Node(right, bottom), {width: this.wallWidth});
        return [topWall, bottomWall, leftWall, rightWall];
    }

    drawEnnemies(ctx: CanvasRenderingContext2D) {
        for (const ennemy of this.ennemies) {
            ennemy.draw(ctx);
            ennemy.onAutomaticMove();
            if (this.player.isInArea) {
                this.playerCollidesEnnemy(ennemy);
            }
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
        if (this.territoryInProgress) {
            const lastNode = this.territoryInProgress.nodes[this.territoryInProgress.nodes.length - 1];
            const inProgressLink = new Link(lastNode, this.player, {color: this.territoryInProgress.color});
            inProgressLink.draw(ctx);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.drawWalls(ctx);
        if (this.territoryInProgress) {
            this.territoryInProgress.draw(ctx);
        }
        this.drawPlayer(ctx);
        this.drawEnnemies(ctx);
    }
}
