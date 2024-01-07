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
        const x = this.player.x;
        const y = this.player.y;
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
                    // console.log("isNodeInsidePolygon: ");
                    // console.log(node);
                    this.gameArea.removeNode(node);
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
        // console.log(this.gameArea.nodes);
        // TODO modify the polygon gameArea instead of just adding new walls
        // Sélectionner les nodes qui ont 3 links liés ou plus => ça signifie qu'il faut jeter un (ou deux si 4) link(s)
        // Then jeter les nodes qui n'ont pas de links liés
        if (this.territoryInProgress) {
            // const newNodes = this.gameArea.nodes.filter(node => !this.isNodeInsidePolygon(node))
            for (let i=0; i<this.territoryInProgress.nodes.length; i++) {
                if (this.gameArea.containsNode(this.territoryInProgress.nodes[i])) {
                    // console.log("Remove " + this.territoryInProgress.nodes[i].x + ":" + this.territoryInProgress.nodes[i].y);
                    this.territoryInProgress.nodes.splice(i, 1);
                }
            }

            const newGameArea = new Territory("white");
            newGameArea.links = this.gameArea.links;
            for (const node of this.gameArea.nodes) {
                if (!this.isNodeInsidePolygon(node)) {
                    console.log("Not in polygon: " + node.x + ":" + node.y);
                    newGameArea.addNode(node.x, node.y);
                } else {
                    const sameAlignment = this.territoryInProgress.nodes.filter(n => n.y == node.y).sort((a, b) => a.x - b.x)[0];
                    console.log("In polygon: " + node.x + ":" + node.y);
                    console.log("Adding instead: " + sameAlignment.x + ":" + sameAlignment.y);
                    newGameArea.addNode(sameAlignment.x, sameAlignment.y);
                    const linkToNode = newGameArea.nodes.filter(n => n.y == node.y).sort((a, b) => a.x - b.x)[0];
                    newGameArea.addLink(linkToNode, sameAlignment);
                }
            }
            // this.gameArea.links = this.gameArea.links.filter(link => !this.isLinkInsidePolygon(link));

            // this.gameArea.nodes = newGameArea.concat(this.territoryInProgress.nodes)
                // .filter((n, index, self) => 
                //     index === self.findIndex((t) => t.x === n.x && t.y === n.y)
                // );

            this.gameArea = newGameArea;
            for (const node of this.gameArea.nodes) {
                node.color = "red";
            }
            console.log(this.gameArea);
            // for (const link of this.gameArea.links) {
            //     link.color = "green";
            // }

            // const nodes = this.gameArea.nodes.concat(this.territoryInProgress.nodes);
            // const top = nodes
            //     .filter((n, index, self) => 
            //         index === self.findIndex((t) => t.x === n.x && t.y === n.y)
            //     )
            //     .filter((n) => n.y === this.borderWidth)
            //     .sort((a, b) => a.x - b.x);
            // const right = nodes
            //     .filter((n, index, self) => 
            //         index === self.findIndex((t) => t.x === n.x && t.y === n.y)
            //     )
            //     .filter((n) => n.x === CONTAINER_WIDTH - this.borderWidth)
            //     .sort((a, b) => a.y - b.y);
            // const bottom = nodes
            //     .filter((n, index, self) => 
            //         index === self.findIndex((t) => t.x === n.x && t.y === n.y)
            //     )
            //     .filter((n) => n.y === CONTAINER_HEIGHT - this.borderWidth)
            //     .sort((a, b) => a.x - b.x);
            // const left = nodes
            //     .filter((n, index, self) => 
            //         index === self.findIndex((t) => t.x === n.x && t.y === n.y)
            //     )
            //     .filter((n) => n.x === this.borderWidth)
            //     .sort((a, b) => a.y - b.y);

            // const newNodes = [top[0], top[1], right[0], right[1], bottom[0], bottom[1], left[0], left[1]];
            // const newLinks = [];
            // newLinks.push(new Link(top[0], top[1]));
            // newLinks.push(new Link(right[0], right[1]));
            // newLinks.push(new Link(bottom[0], bottom[1]));
            // newLinks.push(new Link(left[0], left[1]));
            // this.gameArea = new Territory("white");
            // this.gameArea.links = newLinks;
            // this.gameArea.nodes = newNodes;

            // console.log(top);
            // console.log(right);
            // console.log(bottom);
            // console.log(left);
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
