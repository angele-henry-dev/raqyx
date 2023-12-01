import { GestureDetail } from '@ionic/vue';

export interface Player {
  x: number;
  y: number;
  startX: number;
  startY: number;
  direction: number;
}

export const isGoingBackOnBorder = (
  x: number,
  y: number,
  containerRectWidth: number,
  containerRectHeight: number,
) => {
  return (x <= 0 || x >= containerRectWidth
      || y <= 0 || y >= containerRectHeight)
};

export const onGesture = (
  detail: GestureDetail,
  playerTable: Player, // 0=right, 1=left, 2=down, 3=up
) => {
    let offsetX = playerTable.x;
    let offsetY = playerTable.y;
    let direction = playerTable.direction;

    // Right
    if (detail.startX < detail.currentX && (detail.currentX - detail.startX) > 3) {
      offsetX = (playerTable.x + 1);
      direction = 0;
    }
    // Left
    else if (detail.startX > detail.currentX && (detail.startX - detail.currentX) > 3) {
      offsetX = (playerTable.x - 1);
      direction = 1;
    }
    // Down
    else if (detail.startY < detail.currentY && (detail.currentY - detail.startY) > 3) {
      offsetY = (playerTable.y + 1);
      direction = 2;
    }
    // Up
    else if (detail.startY > detail.currentY && (detail.startY - detail.currentY) > 3) {
      offsetY = (playerTable.y - 1);
      direction = 3;
    // No direction
    } else {
      if (direction === 0) {
        offsetX = (playerTable.x + 1);
      } else if (direction === 1) {
        offsetX = (playerTable.x - 1);
      } else if (direction === 2) {
        offsetY = (playerTable.y + 1);
      } else if (direction === 3) {
        offsetY = (playerTable.y - 1);
      }
    }
    return {direction: direction, x: offsetX, y: offsetY, startX: playerTable.startX, startY: playerTable.startY};
  };

  export const automaticMovePlayer = (
    playerTable: Player,
    containerRectWidth: number,
    containerRectHeight: number,
  ) => {
    let offsetX = playerTable.x;
    let offsetY = playerTable.y;
    let direction = playerTable.direction;

    // Up
    if (playerTable.x === 0 && playerTable.y > 0) {
      offsetY = (playerTable.y - 1);
      direction = 3;
    }
    // Down
    else if (playerTable.x === containerRectWidth && playerTable.y < containerRectHeight) {
      offsetY = (playerTable.y + 1);
      direction = 2;
    }
    // Right
    else if (playerTable.y === 0 && playerTable.x < containerRectWidth) {
      offsetX = (playerTable.x + 1);
      direction = 0;
    }
    // Left
    else if (playerTable.y === containerRectHeight && playerTable.x > 0) {
      offsetX = (playerTable.x - 1);
      direction = 1;
    }
    return {direction: direction, x: offsetX, y: offsetY, startX: playerTable.startX, startY: playerTable.startY};
  };
