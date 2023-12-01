import { GestureDetail } from '@ionic/vue';

export interface Player {
  x: number;
  y: number;
  direction: number;
}

export const isAlreadyOnDirection = (
  playerTable: Player,
  containerRectWidth: number,
  containerRectHeight: number,
  direction: number, // 0=right, 1=left, 2=down, 3=up
  startLine: number
) => {
  return ((direction === 0 && playerTable.x >= containerRectWidth)
    || (direction === 1 && playerTable.x <= startLine-1)
    || (direction === 2 && playerTable.y >= containerRectHeight)
    || (direction === 3 && playerTable.y <= startLine-1))
};

export const isGoingBackOnBorder = (
  x: number,
  y: number,
  containerRectWidth: number,
  containerRectHeight: number,
  startLine: number
) => {
  return (x <= startLine || x >= containerRectWidth-1
      || y <= startLine || y >= containerRectHeight-1)
};

export const onGesture = (
  detail: GestureDetail,
  playerOffsetLeft: number,
  playerOffsetTop: number,
  direction: number // 0=right, 1=left, 2=down, 3=up
) => {
    let offsetX = playerOffsetLeft;
    let offsetY = playerOffsetTop;

    // Right
    if (detail.startX < detail.currentX && (detail.currentX - detail.startX) > 3) {
      offsetX = (playerOffsetLeft + 1);
      direction = 0;
    }
    // Left
    else if (detail.startX > detail.currentX && (detail.startX - detail.currentX) > 3) {
      offsetX = (playerOffsetLeft - 1);
      direction = 1;
    }
    // Down
    else if (detail.startY < detail.currentY && (detail.currentY - detail.startY) > 3) {
      offsetY = (playerOffsetTop + 1);
      direction = 2;
    }
    // Up
    else if (detail.startY > detail.currentY && (detail.startY - detail.currentY) > 3) {
      offsetY = (playerOffsetTop - 1);
      direction = 3;
    // No direction
    } else {
      if (direction === 0) {
        offsetX = (playerOffsetLeft + 1);
      } else if (direction === 1) {
        offsetX = (playerOffsetLeft - 1);
      } else if (direction === 2) {
        offsetY = (playerOffsetTop + 1);
      } else if (direction === 3) {
        offsetY = (playerOffsetTop - 1);
      }
    }
    return {direction: direction, x: offsetX, y: offsetY};
  };

  export const automaticMovePlayer = (
    playerOffsetLeft: number,
    playerOffsetTop: number,
    containerRectWidth: number,
    containerRectHeight: number,
    startLine: number,
    direction: number, // 0=right, 1=left, 2=down, 3=up
  ) => {
    let offsetX = playerOffsetLeft;
    let offsetY = playerOffsetTop;

    // Up
    if (playerOffsetLeft === startLine && playerOffsetTop > startLine) {
      offsetY = (playerOffsetTop - 1);
      direction = 3;
    }
    // Down
    else if (playerOffsetLeft === containerRectWidth && playerOffsetTop < containerRectHeight) {
      offsetY = (playerOffsetTop + 1);
      direction = 2;
    }
    // Right
    else if (playerOffsetTop === startLine && playerOffsetLeft < containerRectWidth) {
      offsetX = (playerOffsetLeft + 1);
      direction = 0;
    }
    // Left
    else if (playerOffsetTop === containerRectHeight && playerOffsetLeft > startLine) {
      offsetX = (playerOffsetLeft - 1);
      direction = 1;
    }
    return {direction: direction, x: offsetX, y: offsetY};
  };
