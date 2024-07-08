import { GestureDetail } from '@ionic/vue';
import { Node } from '@/scripts/math/node';
import { Link } from '@/scripts/math/link';
import { Territory } from "@/scripts/math/territory";
import { Player, DIRECTIONS } from "@/scripts/player";
import { Enemy } from "@/scripts/enemy";
import { randomIntFromInterval } from "./utils";

export const CONTAINER_WIDTH = 300;
export const CONTAINER_HEIGHT = 492;

/**
 * Manages the game logic, including player movements, territory creation, collisions, and victory/defeat conditions.
 */
export class GameManager {
    borderWidth = 10;
    wallWidth = 2;
    fullArea: number;
    gameSettings: {
        percentage: number;
        score: number;
        totalScore: number;
        level: number;
        numberOfEnemies: number;
    };
    gameArea: Territory;
    territoryInProgress: Territory | null = null;
    player: Player;
    enemies: Enemy[];
    isGameOver = false;

    /**
     * Creates an instance of the GameManager class.
     * @param numberOfEnemies The number of enemies in the game. Default is 1.
     * @param level The level of the game. Default is 1.
     */
    constructor(numberOfEnemies = 1, level = 1, score = 0) {
        this.gameSettings = {
            percentage: 0,
            score: 0,
            totalScore: score,
            level: level,
            numberOfEnemies: numberOfEnemies
        };
        this.gameArea = this.generateWalls();
        this.player = new Player(this.borderWidth, this.borderWidth);
        this.fullArea = this.getPolygonArea(this.gameArea.nodes);
        this.enemies = this.generateEnemies();
    }

    /**
     * Calculates the area of a polygon defined by its nodes.
     * @param nodes The nodes of the polygon.
     * @returns The absolute area of the polygon.
     */
    getPolygonArea(nodes: Node[]): number {
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

    /**
     * Checks if the given gesture is authorized based on the player's current direction and the proposed move.
     * @param isHorizontalMove Indicates if the move is horizontal (true) or vertical (false).
     * @param directionX The proposed horizontal direction.
     * @param directionY The proposed vertical direction.
     * @returns True if the gesture is authorized, otherwise false.
     */
    isGestureAuthorized(isHorizontalMove: boolean, directionX: number, directionY: number): boolean {
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

    /**
     * Handles the player's manual move based on the provided gesture detail.
     * @param detail The gesture detail.
     */
    onManualMove(detail: GestureDetail): void {
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

    /**
     * Initiates the creation of a territory when the player starts drawing.
     */
    createTerritory(): void {
        this.territoryInProgress = new Territory();
        this.territoryInProgress.addNode(this.player.x, this.player.y);
    }

    /**
     * Ends the current territory, completes it, and updates the game state.
     */
    endTerritory(): Link | undefined {
        if (this.territoryInProgress) {
            const lastWall = this.territoryInProgress.drawTerritory(this.player.x, this.player.y);
            this.territoryInProgress.completeTerritory(CONTAINER_HEIGHT, CONTAINER_WIDTH, this.borderWidth);

            for (const node of this.territoryInProgress.nodes) {
                this.gameArea.addNode(node.x, node.y);
            }
            for (const link of this.territoryInProgress.links) {
                this.gameArea.addLink(link.n1, link.n2);
            }

            this.gameSettings.percentage += Math.ceil(100 * this.getPolygonArea(this.territoryInProgress.nodes) / this.fullArea);
            if (this.gameSettings.percentage >= 75) {
                this.victory();
            }
            this.territoryInProgress = null;
            return lastWall;
        }
        return undefined;
    }

    /**
     * Checks if a node is inside the current territory.
     * @param node The node to check.
     * @returns True if the node is inside the territory, otherwise false.
     */
    isNodeInsidePolygon(node: Node): boolean {
        if (this.territoryInProgress) {
            for (const link of this.territoryInProgress.links) {
                if (link.includesX(node.x) && link.includesY(node.y)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Handles the victory condition.
     */
    victory(): void {
        this.gameSettings.level++;
        this.gameSettings.numberOfEnemies++;
        this.gameSettings.percentage = 0;
        this.reset();
    }

    /**
     * Handles the game over condition.
     */
    gameOver(): void {
        this.isGameOver = true;
    }

    /**
     * Checks if a wall is on the player's trajectory.
     * @param player The player.
     * @param wall The wall to check.
     * @returns True if the wall is on the player's trajectory, otherwise false.
     */
    isWallOnTrajectory(player: Player, wall: Link): boolean {
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

    /**
     * Gets the next wall on the player's trajectory.
     * @returns The next wall on the player's trajectory.
     */
    getNextWall(): Link | null {
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

    /**
     * Handles player collision with walls.
     */
    playerCollidesWall(): void {
        const nextWall = this.getNextWall();
        const didCollide = nextWall ? this.player.detectWallCollision(nextWall) : false;
        if (didCollide && this.territoryInProgress) {
            // For the case the user may go on the last wall he created
            const lastWall = this.endTerritory();
            if (lastWall) {
                const { x, y, speed, direction } = this.player;
                const futureX = (direction === DIRECTIONS.RIGHT || direction === DIRECTIONS.UP) ? x + speed : x - speed;
                const futureY = (direction === DIRECTIONS.DOWN || direction === DIRECTIONS.RIGHT) ? y + speed : y - speed;
                this.player.handleCollision(lastWall, futureX, futureY);
            }
        }
    }

    /**
     * Handles player collision with enemies.
     * @param enemy The enemy to check for collision.
     */
    playerCollidesEnemy(enemy: Enemy): void {
        const playerCollidesX = this.player.x + this.player.midSize >= enemy.x &&
                                this.player.x - this.player.midSize <= enemy.x;
    
        const playerCollidesY = this.player.y + this.player.midSize >= enemy.y &&
                                this.player.y - this.player.midSize <= enemy.y;
        if (playerCollidesX && playerCollidesY) {
            this.gameOver();
        }
    }

    /**
     * Handles enemy collisions with walls.
     * @param enemy The enemy to check for collisions.
     */
    EnemyCollidesWalls(enemy: Enemy): void {
        for (const link of this.gameArea.links) {
            if (link.direction === 'horizontal' && enemy.collidesWithHorizontalWall(link)) {
                enemy.speedY *= -1;
            } else if (link.direction === 'vertical' && enemy.collidesWithVerticalWall(link)) {
                enemy.speedX *= -1;
            }
        }
    }

    /**
     * Handles enemy collisions with the territory in progress.
     * @param enemy The enemy to check for collisions.
     */
    EnemyCollidesTerritoryInProgess(enemy: Enemy): void {
        if (this.territoryInProgress) {
            const lastNode = this.territoryInProgress.nodes[this.territoryInProgress.nodes.length - 1];
            const inProgressLink = new Link(lastNode, this.player);
            if (
                ((enemy.x >= inProgressLink.n1.x && enemy.x <= (inProgressLink.n2.x + this.player.midSize))
                || (enemy.x >= (inProgressLink.n2.x + this.player.midSize) && enemy.x <= inProgressLink.n1.x))
                && (
                    (enemy.y >= inProgressLink.n1.y && enemy.y <= (inProgressLink.n2.y + this.player.midSize))
                    || (enemy.y >= (inProgressLink.n2.y + this.player.midSize) && enemy.y <= inProgressLink.n1.y)
                )
            ) {
                this.gameOver();
            }
            for (const link of this.territoryInProgress.links) {
                if (
                    enemy.collidesWithHorizontalWall(link)
                    || enemy.collidesWithVerticalWall(link)
                ) {
                    this.gameOver();
                }
            }
        }
    }

    /**
     * Generates an array of enemies with random positions.
     * @returns The array of generated enemies.
     */
    generateEnemies(): Enemy[] {
        const enemies: Enemy[] = [];
        const min = (this.borderWidth * 2);
        const xMax = (CONTAINER_WIDTH - min);
        const yMax = (CONTAINER_HEIGHT - min);
        for (let i=0; i<this.gameSettings.numberOfEnemies; i++) {
            enemies.push(new Enemy(randomIntFromInterval(min, xMax), randomIntFromInterval(min, yMax)));
        }
        return enemies;
    }

    /**
     * Generates the initial walls of the game area.
     * @returns The generated walls.
     */
    generateWalls(): Territory {
        const walls = new Territory();
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

    /**
     * Draws the enemies on the canvas, handles their movements, and checks for collisions.
     * @param ctx The canvas rendering context.
     */
    drawEnemies(ctx: CanvasRenderingContext2D): void {
        for (const Enemy of this.enemies) {
            Enemy.draw(ctx);
            Enemy.onAutomaticMove();
            if (this.territoryInProgress) {
                this.EnemyCollidesTerritoryInProgess(Enemy);
                this.playerCollidesEnemy(Enemy);
            }
            this.EnemyCollidesWalls(Enemy);
        }
    }

    /**
     * Draws the walls on the canvas.
     * @param ctx The canvas rendering context.
     */
    drawWalls(ctx: CanvasRenderingContext2D): void {
        this.gameArea.drawLines(ctx);
    }

    /**
     * Draws the player on the canvas, handles their movement, and checks for collisions.
     * @param ctx The canvas rendering context.
     */
    drawPlayer(ctx: CanvasRenderingContext2D): void {
        this.player.draw(ctx);
        this.player.onAutomaticMove();
        this.playerCollidesWall();
        if (this.territoryInProgress) {
            const lastNode = this.territoryInProgress.nodes[this.territoryInProgress.nodes.length - 1];
            const inProgressLink = new Link(lastNode, this.player);
            inProgressLink.drawRect(ctx);
        }
    }

    reset(): void {
        this.isGameOver = false;
        this.territoryInProgress = null;
        this.gameSettings.percentage = 0;
        this.gameSettings.score = 0;
        this.gameArea = this.generateWalls();
        this.player = new Player(this.borderWidth, this.borderWidth);
        this.fullArea = this.getPolygonArea(this.gameArea.nodes);
        this.enemies = this.generateEnemies();
    }

    /**
     * Draws all elements (walls, territory in progress, player, enemies) on the canvas.
     * @param ctx The canvas rendering context.
     */
    draw(ctx: CanvasRenderingContext2D): void {
        this.drawWalls(ctx);
        if (this.territoryInProgress) {
            this.territoryInProgress.drawLines(ctx);
        }
        this.drawPlayer(ctx);
        this.drawEnemies(ctx);
    }
}
