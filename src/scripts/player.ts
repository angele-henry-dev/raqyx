import { GestureDetail } from '@ionic/vue';
import { Graph } from "@/scripts/math/graph";
import { Link } from '@/scripts/math/link';
import { Node } from '@/scripts/math/node';
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@/scripts/gameManager';
import { randomIntFromInterval } from '@/scripts/utils'

export class Player extends Node {
  TERRITORIES_COLORS = ["blue", "green", "orange", "red", "pink", "purple"];
  direction;
  size;
  midSize;
  speed;
  color;
  territories: Graph[];
  isInArea;
  territoryInProgress;

  constructor({direction = 0, size = 8, speed = 1.5, color = "green"} = {}) {
    super(0, 0);
    this.territories = [];
    this.size = size;
    this.midSize = Math.ceil(this.size/2) + 1;
    this.speed = speed;
    this.color = color;
    this.x = this.midSize;
    this.y = this.midSize;
    this.direction = direction;
    this.isInArea = false;
    this.territoryInProgress = false;
  }

  createTerritory(borderSide: number) {
    this.territoryInProgress = true;
    borderSide
    // const randomColor = this.TERRITORIES_COLORS[randomIntFromInterval(0, this.TERRITORIES_COLORS.length)];
    const territoryID = this.territories.push(new Graph()) - 1;
    this.territories[territoryID].addNode(new Node(this.x, this.y, {size: 2}));
  }

  drawTerritory() {
    const territoryID = this.territories.length - 1;
    this.territories[territoryID].addNode(new Node(this.x, this.y, {size: 2}));
    for (let i=1; i<this.territories[territoryID].nodes.length; i++) {
      this.territories[territoryID].addLink(
        new Link(this.territories[territoryID].nodes[i-1], this.territories[territoryID].nodes[i])
      );
    }
  }

  endTerritory(borderSide: number) {
    this.territoryInProgress = false;
  }

  isOnBorder() {
    // [topWall, bottomWall, leftWall, rightWall]
    // Border top
    if (this.y <= this.midSize && this.x < (CONTAINER_WIDTH - this.midSize)) {
      this.isInArea = false;
      return 0;
    }
    // Border bottom
    if (this.y >= (CONTAINER_HEIGHT - this.midSize) && this.x > this.midSize) {
      this.isInArea = false;
      return 1;
    }
    // Border left
    if (this.x <= this.midSize && this.y > this.midSize) {
      this.isInArea = false;
      return 2;
    }
    // Border right
    if (this.x >= (CONTAINER_WIDTH - this.midSize) && this.y < (CONTAINER_HEIGHT - this.midSize)) {
      this.isInArea = false;
      return 3;
    }
    return -1;
  }

  onCollideBorder(borderSide: number) {
    // [topWall, bottomWall, leftWall, rightWall]
    // Border right go down
    if (borderSide == 3) {
      this.isInArea = false;
      return 2;
    }
    // Border bottom go left
    if (borderSide == 1) {
      this.isInArea = false;
      return 1;
    }
    // Border left go up
    if (borderSide == 2) {
      this.isInArea = false;
      return 3;
    }
    // Border top go right
    if (borderSide == 0) {
      this.isInArea = false;
      return 0;
    }
    return this.direction;
  }

  onManualMove(detail: GestureDetail) {
    this.isInArea = true;
    const borderSide = this.isOnBorder();

    if (borderSide >= 0) {
      if (!this.territoryInProgress) {
        this.createTerritory(borderSide);
      } else {
        this.endTerritory(borderSide);
      }
    } else if (this.territoryInProgress) {
      this.drawTerritory();
    }
    
    if (Math.abs(detail.deltaX) > Math.abs(detail.deltaY)) {
      if (detail.deltaX > 0) {
        // Move right
        this.direction = 0;
        this.x = (this.x + this.speed);
      } else {
        // Move left
        this.direction = 1;
        this.x = (this.x - this.speed);
      }
    }
    else {
      if (detail.deltaY > 0) {
        // Move down
        this.direction = 2;
        this.y = (this.y + this.speed);
      } else {
        // Move up
        this.direction = 3;
        this.y = (this.y - this.speed);
      }
    }
  }

  onAutomaticMove() {
    const borderSide = this.isOnBorder();
    if (borderSide >= 0) {
      this.direction = this.onCollideBorder(borderSide);
    }
    // Right
    if (this.direction == 0) {
      this.x = (this.x + this.speed);
    }
    // Left
    else if (this.direction == 1) {
      this.x = (this.x - this.speed);
    }
    // Down
    else if (this.direction == 2) {
      this.y = (this.y + this.speed);
    }
    // Up
    else if (this.direction == 3) {
      this.y = (this.y - this.speed);
    }
  }
}
