import { GestureDetail } from '@ionic/vue';
import { Node } from '@/scripts/math/node';
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@/scripts/gameManager';

export class Player extends Node {
  direction: number;
  size: number;
  midSize: number;
  speed: number;
  color: string;

  constructor(direction = 0, size = 8, speed = 1.5, color = "green") {
    super(0, 0);
    this.size = size;
    this.midSize = Math.ceil(this.size/2) + 1;
    this.speed = speed;
    this.color = "green";
    this.x = this.midSize;
    this.y = this.midSize;
    this.direction = direction;
  }

  onAutomaticMove() {
    let offsetX = this.x;
    let offsetY = this.y;
    let offsetDirection = this.direction;

    // Up
    if (this.x <= this.midSize && this.y > this.midSize) {
      offsetY = (this.y - this.speed);
      offsetDirection = 3;
    }
    // Down
    else if (this.x >= (CONTAINER_WIDTH - this.midSize) && this.y < (CONTAINER_HEIGHT - this.midSize)) {
      offsetY = (this.y + this.speed);
      offsetDirection = 2;
    }
    // Right
    else if (this.y <= this.midSize && this.x < (CONTAINER_WIDTH - this.midSize)) {
      offsetX = (this.x + this.speed);
      offsetDirection = 0;
    }
    // Left
    else if (this.y >= (CONTAINER_HEIGHT - this.midSize) && this.x > this.midSize) {
      offsetX = (this.x - this.speed);
      offsetDirection = 1;
    }

    this.x = offsetX;
    this.y = offsetY;
    this.direction = offsetDirection;
  }
}

// export interface Player {
//   x: number;
//   y: number;
//   startX: number;
//   startY: number;
//   direction: number;
// }

// export const isGoingBackOnBorder = (
//   x: number,
//   y: number,
//   containerRectWidth: number,
//   containerRectHeight: number,
//   START_LINE: number
// ) => {
//   return (x <= START_LINE || x >= containerRectWidth
//       || y <= START_LINE || y >= containerRectHeight)
// };

// export const onGesture = (
//   detail: GestureDetail,
//   playerTable: Player, // 0=right, 1=left, 2=down, 3=up
// ) => {
//     let offsetX = playerTable.x;
//     let offsetY = playerTable.y;
//     let direction = playerTable.direction;

//     // Right
//     if (detail.startX < detail.currentX && (detail.currentX - detail.startX) > 3) {
//       offsetX = (playerTable.x + 1);
//       direction = 0;
//     }
//     // Left
//     else if (detail.startX > detail.currentX && (detail.startX - detail.currentX) > 3) {
//       offsetX = (playerTable.x - 1);
//       direction = 1;
//     }
//     // Down
//     else if (detail.startY < detail.currentY && (detail.currentY - detail.startY) > 3) {
//       offsetY = (playerTable.y + 1);
//       direction = 2;
//     }
//     // Up
//     else if (detail.startY > detail.currentY && (detail.startY - detail.currentY) > 3) {
//       offsetY = (playerTable.y - 1);
//       direction = 3;
//     // No direction
//     } else {
//       if (direction === 0) {
//         offsetX = (playerTable.x + 1);
//       } else if (direction === 1) {
//         offsetX = (playerTable.x - 1);
//       } else if (direction === 2) {
//         offsetY = (playerTable.y + 1);
//       } else if (direction === 3) {
//         offsetY = (playerTable.y - 1);
//       }
//     }
//     return {direction: direction, x: offsetX, y: offsetY, startX: playerTable.startX, startY: playerTable.startY};
//   };

//   export const automaticMovePlayer = (
//     playerTable: Player,
//     containerRectWidth: number,
//     containerRectHeight: number,
//     START_LINE: number
//   ) => {
//     let offsetX = playerTable.x;
//     let offsetY = playerTable.y;
//     let direction = playerTable.direction;

//     // Up
//     if (playerTable.x === START_LINE && playerTable.y > START_LINE) {
//       offsetY = (playerTable.y - 1);
//       direction = 3;
//     }
//     // Down
//     else if (playerTable.x === containerRectWidth && playerTable.y < containerRectHeight) {
//       offsetY = (playerTable.y + 1);
//       direction = 2;
//     }
//     // Right
//     else if (playerTable.y === START_LINE && playerTable.x < containerRectWidth) {
//       offsetX = (playerTable.x + 1);
//       direction = 0;
//     }
//     // Left
//     else if (playerTable.y === containerRectHeight && playerTable.x > START_LINE) {
//       offsetX = (playerTable.x - 1);
//       direction = 1;
//     }
//     return {direction: direction, x: offsetX, y: offsetY, startX: playerTable.startX, startY: playerTable.startY};
//   };
