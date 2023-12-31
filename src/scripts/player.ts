import { GestureDetail } from '@ionic/vue';
import { Graph } from "@/scripts/math/graph";
import { Node } from '@/scripts/math/node';
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@/scripts/gameManager';

export class Player extends Node {
  direction;
  size;
  midSize;
  speed;
  color;
  territory;
  isInArea;

  constructor({direction = 0, size = 8, speed = 1.5, color = "green"} = {}) {
    super(0, 0);
    this.territory = new Graph();
    this.size = size;
    this.midSize = Math.ceil(this.size/2) + 1;
    this.speed = speed;
    this.color = color;
    this.x = this.midSize;
    this.y = this.midSize;
    this.direction = direction;
    this.isInArea = false;
  }

  onManualMove(detail: GestureDetail) {
    this.isInArea = true;
    this.territory.addNode(new Node(this.x, this.y));
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
    this.direction = this.onCollideBorder();
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

  onCollideBorder() {
    // Border right go down
    if (this.x >= (CONTAINER_WIDTH - this.midSize) && this.y < (CONTAINER_HEIGHT - this.midSize)) {
      this.isInArea = false;
      return 2;
    }
    // Border left go up
    if (this.x <= this.midSize && this.y > this.midSize) {
      this.isInArea = false;
      return 3;
    }
    // Border top go right
    if (this.y <= this.midSize && this.x < (CONTAINER_WIDTH - this.midSize)) {
      this.isInArea = false;
      return 0;
    }
    // Border bottom go left
    if (this.y >= (CONTAINER_HEIGHT - this.midSize) && this.x > this.midSize) {
      this.isInArea = false;
      return 1;
    }
    return this.direction;
  }
}
