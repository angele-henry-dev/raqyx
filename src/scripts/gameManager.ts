import { GestureDetail } from '@ionic/vue';
import { Node } from '@/scripts/math/node'
import { Link } from '@/scripts/math/link'
import { Territory } from "@/scripts/math/territory";
import { Player, DIRECTIONS } from "@/scripts/player";
import { Enemy } from "@/scripts/enemy";
import { randomIntFromInterval } from "./utils";

export const CONTAINER_WIDTH = 300;
export const CONTAINER_HEIGHT = 492;

export class GameManager {
    borderWidth = 10;
    wallWidth = 2;
    fullArea;
    gameSettings;
    gameArea: Territory;
    territoryInProgress: Territory | null = null;
    player;
    ennemies;

    constructor(numberOfEnnemies = 1, level = 1) {
        this.gameArea = this.generateWalls();
        this.player = new Player(this.borderWidth, this.borderWidth);
        this.gameSettings = {
            percentage: 0,
            score: 0,
            level: level,
            numberOfEnnemies: numberOfEnnemies
        };
        this.fullArea = this.getPolygonArea(this.gameArea.nodes);
        this.ennemies = this.generateEnnemies();
    }

    getPolygonArea(nodes: Node[]) {
        let total = 0;
    
        for (let i = 0, l = nodes.length; i < l; i++) {
          const addX = nodes[i].x;
          const addY = nodes[i === nodes.length - 1 ? 0 : i + 1].y;
          const subX = nodes[i === nodes.length - 1 ? 0 : i + 1].x;
          const subY = nodes[i].y;
    
          total += (addX * addY * 0.5);
          total -= (subX * subY * 0.5);
        }
        return Math.abs(total);
    }

    isGestureAuthorized(isHorizontalMove: boolean, directionX: number, directionY: number) {
        return (
          (isHorizontalMove
            && (this.player.direction !== DIRECTIONS.LEFT && this.player.direction !== DIRECTIONS.RIGHT)
            && ((directionX === DIRECTIONS.LEFT && this.player.x - this.player.speed > this.borderWidth)
              || (directionX === DIRECTIONS.RIGHT && this.player.x + this.player.speed < (CONTAINER_WIDTH - this.borderWidth))))
          || (!isHorizontalMove
            && (this.player.direction !== DIRECTIONS.UP && this.player.direction !== DIRECTIONS.DOWN)
            && ((directionY === DIRECTIONS.UP && this.player.y - this.player.speed > this.borderWidth)
              || (directionY === DIRECTIONS.DOWN && this.player.y + this.player.speed < (CONTAINER_HEIGHT - this.borderWidth))))
        );
    }
      

    onManualMove(detail: GestureDetail) {
        const isHorizontalMove = Math.abs(detail.deltaX) > Math.abs(detail.deltaY);
        const directionX = detail.deltaX > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
        const directionY = detail.deltaY > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;

        if (this.isGestureAuthorized(isHorizontalMove, directionX, directionY)) {
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
        this.territoryInProgress.addNode(this.player.x, this.player.y);
    }

    endTerritory() {
        if (this.territoryInProgress) {
            this.territoryInProgress.drawTerritory(this.player.x, this.player.y);
            this.territoryInProgress.completePolygon(CONTAINER_HEIGHT, CONTAINER_WIDTH, this.borderWidth);
            this.recreateGameArea();
            this.gameSettings.percentage += Math.ceil(100 * this.getPolygonArea(this.territoryInProgress.nodes) / this.fullArea);
            if (this.gameSettings.percentage >= 75) {
                this.victory();
            }
            this.territoryInProgress = null;
        }
    }

    isNodeInsidePolygon(node: Node) {
        if (this.territoryInProgress) {
            for (const link of this.territoryInProgress.links) {
                if (link.includesX(node.x) && link.includesY(node.y)) {
                    return true;
                }
            }
        }
        return false;
    }

    isLinkInsidePolygon(link: Link) {
        return false;
    }

    recreateGameArea() {
        if (this.territoryInProgress) {
            const newGameArea = new Territory("white");

            // Links we want to keep from gameArea
            for (const link of this.gameArea.links) {
                const linkIncludes = link.includesLink(this.territoryInProgress.links);
                if (linkIncludes) {
                    const commonNode = link.n1.equals(linkIncludes.n1) || link.n1.equals(linkIncludes.n2) ? link.n1 : link.n2;
                    const nonCommonNode1 = link.n1.equals(commonNode) ? link.n2 : link.n1;
                    const nonCommonNode2 = linkIncludes.n1.equals(commonNode) ? linkIncludes.n2 : linkIncludes.n1;
                    newGameArea.addNode(nonCommonNode1.x, nonCommonNode1.y);
                    newGameArea.addNode(nonCommonNode2.x, nonCommonNode2.y);
                    newGameArea.addLink(nonCommonNode1, nonCommonNode2);
                } else {
                    newGameArea.addLink(link.n1, link.n2);
                }
            }

            // Links we want to keep from territoryInProgress
            for (const link of this.territoryInProgress.links) {
                if (!this.gameArea.includesLink(link)) {
                    newGameArea.addLink(link.n1, link.n2);
                }
            }

            this.gameArea = newGameArea;
        }
    }

    victory() {
        alert("Victory!");
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
        const { player, gameArea } = this;
        let closestWall = null;
        let minDistance = Number.MAX_SAFE_INTEGER;

        for (const wall of gameArea.links) {
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

    playerCollidesWall() {
        const nextWall = this.getNextWall();
        const didCollide = nextWall ? this.player.detectWallCollision(nextWall) : false;
        if (didCollide && this.territoryInProgress) {
            this.endTerritory();
        }
    }

    playerCollidesEnemy(Enemy: Enemy) {
        const playerCollidesX = this.player.x + this.player.midSize >= Enemy.x &&
                                this.player.x - this.player.midSize <= Enemy.x;
    
        const playerCollidesY = this.player.y + this.player.midSize >= Enemy.y &&
                                this.player.y - this.player.midSize <= Enemy.y;
        if (playerCollidesX && playerCollidesY) {
            this.gameOver();
        }
    }

    EnemyCollidesWalls(Enemy: Enemy) {
        for (const link of this.gameArea.links) {
            if (link.direction === 'horizontal' && Enemy.collidesWithHorizontalWall(link)) {
            Enemy.speedY *= -1;
            } else if (link.direction === 'vertical' && Enemy.collidesWithVerticalWall(link)) {
            Enemy.speedX *= -1;
            }
        }
    }

    EnemyCollidesTerritoryInProgess(Enemy: Enemy) {
        if (this.territoryInProgress) {
            const lastNode = this.territoryInProgress.nodes[this.territoryInProgress.nodes.length - 1];
            const inProgressLink = new Link(lastNode, this.player);
            if (inProgressLink.includesX(Enemy.x) && inProgressLink.includesY(Enemy.y)) {
                this.gameOver();
            }
            for (const link of this.territoryInProgress.links) {
                if (
                    Enemy.collidesWithHorizontalWall(link)
                    || Enemy.collidesWithVerticalWall(link)
                    || (inProgressLink.includesX(Enemy.x) && inProgressLink.includesY(Enemy.y))
                ) {
                    this.gameOver();
                }
            }
        }
    }

    generateEnnemies() {
        const ennemies: Enemy[] = [];
        const min = (this.borderWidth * 2);
        const xMax = (CONTAINER_WIDTH - min);
        const yMax = (CONTAINER_HEIGHT - min);
        for (let i=0; i<this.gameSettings.numberOfEnnemies; i++) {
            ennemies.push(new Enemy(randomIntFromInterval(min, xMax), randomIntFromInterval(min, yMax)));
        }
        return ennemies;
    }

    generateWalls() {
        const walls = new Territory("white");
        const left = this.borderWidth;
        const top = this.borderWidth;
        const right = CONTAINER_WIDTH - this.borderWidth;
        const bottom = CONTAINER_HEIGHT - this.borderWidth;
        walls.addNode(left, top);
        walls.drawTerritory(right, top); // top wall
        walls.drawTerritory(right, bottom); // right wall
        walls.drawTerritory(left, bottom); // bottom wall
        walls.addFinalLinkToTerritory(); // left wall
        return walls;
    }

    drawEnnemies(ctx: CanvasRenderingContext2D) {
        for (const Enemy of this.ennemies) {
            Enemy.draw(ctx);
            Enemy.onAutomaticMove();
            if (this.territoryInProgress) {
                this.playerCollidesEnemy(Enemy);
                this.EnemyCollidesTerritoryInProgess(Enemy);
            }
            this.EnemyCollidesWalls(Enemy);
        }
    }

    drawWalls(ctx: CanvasRenderingContext2D) {
        this.gameArea.draw(ctx);
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
