import { GestureDetail } from '@ionic/vue';
import { Territory } from "@/scripts/math/territory";
import { Node } from '@/scripts/math/node';
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@/scripts/gameManager';

const DIRECTIONS = {
  RIGHT: 0,
  LEFT: 1,
  DOWN: 2,
  UP: 3,
};

export class Player extends Node {
  direction;
  midSize;
  speed;
  territories: Territory[];
  isInArea;
  territoryInProgress;

  constructor({direction = DIRECTIONS.RIGHT, size = 8, speed = 1.5, color = "green"} = {}) {
    super(0, 0, {size: size, color: color});
    this.territories = [];
    this.midSize = Math.ceil(this.size/2) + 1;
    this.speed = speed;
    this.x = this.midSize;
    this.y = this.midSize;
    this.direction = direction;
    this.isInArea = false;
    this.territoryInProgress = false;
  }

  createTerritory(borderSide: number) {
    this.territoryInProgress = true;
    const territoryID = this.territories.push(new Territory()) - 1;
    this.territories[territoryID].addNode(this.x, this.y);
    return territoryID;
  }

  drawTerritory() {
    const territoryID = this.territories.length - 1;
    this.territories[territoryID].addNode(this.x, this.y);
    for (let i=1; i<this.territories[territoryID].nodes.length; i++) {
      this.territories[territoryID].addLink(
        this.territories[territoryID].nodes[i-1],
        this.territories[territoryID].nodes[i]
      );
    }
    return territoryID;
  }

  endTerritory(borderSide: number) {
    const territoryID = this.drawTerritory();
    this.territories[territoryID].addNode(this.x, this.y);

    this.territoryInProgress = false;
    console.log(this.territories);
  }

  isOnBorder() {
    const { x, y, midSize } = this;
    if (y <= midSize && x < CONTAINER_WIDTH - midSize) {
      return 0; // Border top
    }
    if (y >= CONTAINER_HEIGHT - midSize && x > midSize) {
      return 1; // Border bottom
    }
    if (x <= midSize && y > midSize) {
      return 2; // Border left
    }
    if (x >= CONTAINER_WIDTH - midSize && y < CONTAINER_HEIGHT - midSize) {
      return 3; // Border right
    }
    return -1;
  }

  onCollideBorder(borderSide: number) {
    switch (borderSide) {
      case 3: // Border right go down
        this.isInArea = false;
        return DIRECTIONS.DOWN;
      case 1: // Border bottom go left
        this.isInArea = false;
        return DIRECTIONS.LEFT;
      case 2: // Border left go up
        this.isInArea = false;
        return DIRECTIONS.UP;
      case 0: // Border top go right
        this.isInArea = false;
        return DIRECTIONS.RIGHT;
      default:
        return this.direction;
    }
  }  

  onManualMove(detail: GestureDetail) {
    this.isInArea = true;
    const borderSide = this.isOnBorder();
  
    if (!this.territoryInProgress && borderSide >= 0) {
      this.createTerritory(borderSide);
    } else if (this.territoryInProgress) {
      this.drawTerritory();
    }
  
    const isHorizontalMove = Math.abs(detail.deltaX) > Math.abs(detail.deltaY);
  
    if (isHorizontalMove) {
      this.x += detail.deltaX > 0 ? this.speed : -this.speed;
      this.direction = detail.deltaX > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
    } else {
      this.y += detail.deltaY > 0 ? this.speed : -this.speed;
      this.direction = detail.deltaY > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
    }
  }

  onAutomaticMove() {
    const borderSide = this.isOnBorder();
  
    if (borderSide >= 0) {
      if (this.territoryInProgress) {
        this.endTerritory(borderSide);
      }
      
      this.direction = this.onCollideBorder(borderSide);
    }
  
    switch (this.direction) {
      case DIRECTIONS.RIGHT:
        this.x += this.speed;
        break;
      case DIRECTIONS.LEFT:
        this.x -= this.speed;
        break;
      case DIRECTIONS.DOWN:
        this.y += this.speed;
        break;
      case DIRECTIONS.UP:
        this.y -= this.speed;
        break;
    }
  }
  
}
