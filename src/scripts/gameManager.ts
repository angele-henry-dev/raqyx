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

            for (const link of this.territoryInProgress.links) {
                const linkIncludes = this.gameArea.includesLink(link);
                if (linkIncludes) {
                    const commonNode = link.n1.equals(linkIncludes.n1) || link.n1.equals(linkIncludes.n2) ? link.n1 : link.n2;
                    const nonCommonNode1 = link.n1.equals(commonNode) ? link.n2 : link.n1;
                    const nonCommonNode2 = linkIncludes.n1.equals(commonNode) ? linkIncludes.n2 : linkIncludes.n1;
                    newGameArea.addNode(nonCommonNode1.x, nonCommonNode1.y);
                    newGameArea.addNode(nonCommonNode2.x, nonCommonNode2.y);
                    newGameArea.addLink(nonCommonNode1, nonCommonNode2);
                }
            }

            // Get nodes from territoryInProgress that are not in gameArea
            // for (const node of this.territoryInProgress.nodes) {
            //     if (!this.gameArea.containsNode(node)) {
            //         newGameArea.addNode(node.x, node.y);
            //     }
            // }

            // for (const node of this.gameArea.nodes) {
            //     // Get nodes from gameArea that are not inside territoryInProgress
            //     if (!this.isNodeInsidePolygon(node)) {
            //         newGameArea.addNode(node.x, node.y);
            //     } else {
            //         const sameAlignment = newGameArea.nodes.filter(n => n.y === node.y && n.x != node.x).sort((a, b) => a.x - b.x);
            //         const closestNode = sameAlignment.reduce((closest, current) => {
            //             const closestXDiff = Math.abs(closest.x - node.x);
            //             const currentXDiff = Math.abs(current.x - node.x);
            //             return currentXDiff < closestXDiff ? current : closest;
            //         }, sameAlignment[0]);
            //         console.log(sameAlignment);
            //         console.log(closestNode);

            //         newGameArea.addNode(closestNode.x, closestNode.y);
            //         newGameArea.addLink(sameAlignment[0], closestNode);
            //     }
            // }

            // // Add in newGameArea the links from gameArea that are connected in existing nodes in newGameArea
            // for (const link of this.gameArea.links) {
            //     if (newGameArea.containsNode(link.n1) && newGameArea.containsNode(link.n2)) {
            //         newGameArea.addLink(link.n1, link.n2);
            //     }
            // }

            this.gameArea = newGameArea;
            for (const node of this.gameArea.nodes) {
                node.color = "red";
            }
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
        for (const link of this.gameArea.links) {
            if (link.direction === 'horizontal' && ennemy.collidesWithHorizontalWall(link)) {
            ennemy.speedY *= -1;
            } else if (link.direction === 'vertical' && ennemy.collidesWithVerticalWall(link)) {
            ennemy.speedX *= -1;
            }
        }
    }

    ennemyCollidesTerritoryInProgess(ennemy: Ennemy) {
        if (this.territoryInProgress) {
            const lastNode = this.territoryInProgress.nodes[this.territoryInProgress.nodes.length - 1];
            const inProgressLink = new Link(lastNode, this.player);
            if (inProgressLink.includesX(ennemy.x) && inProgressLink.includesY(ennemy.y)) {
                this.gameOver();
            }
            for (const link of this.territoryInProgress.links) {
                if (
                    ennemy.collidesWithHorizontalWall(link)
                    || ennemy.collidesWithVerticalWall(link)
                    || (inProgressLink.includesX(ennemy.x) && inProgressLink.includesY(ennemy.y))
                ) {
                    this.gameOver();
                }
            }
        }
    }

    generateEnnemies() {
        const ennemies: Ennemy[] = [];
        const min = (this.borderWidth * 2);
        const xMax = (CONTAINER_WIDTH - min);
        const yMax = (CONTAINER_HEIGHT - min);
        for (let i=0; i<this.gameSettings.numberOfEnnemies; i++) {
            ennemies.push(new Ennemy(randomIntFromInterval(min, xMax), randomIntFromInterval(min, yMax)));
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
        for (const ennemy of this.ennemies) {
            ennemy.draw(ctx);
            ennemy.onAutomaticMove();
            if (this.territoryInProgress) {
                this.playerCollidesEnnemy(ennemy);
                this.ennemyCollidesTerritoryInProgess(ennemy);
            }
            this.ennemyCollidesWalls(ennemy);
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
