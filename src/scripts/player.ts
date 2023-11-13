import { GestureDetail } from '@ionic/vue';

export const isUserChangingDirection = (
  offsets: Array<number>,
  containerRectWidth: number,
  containerRectHeight: number,
  direction: number, // 0=right, 1=left, 2=down, 3=up
  startLine: number
) => {
  if (
    ((offsets[1] === containerRectWidth) && (direction === 2 && offsets[0] === 3))
    || ((offsets[1] === startLine) && (direction === 3 && offsets[0] === 2))
    || ((offsets[2] === startLine) && (direction === 0 && offsets[0] === 1))
    || ((offsets[2] === containerRectHeight-1) && (direction === 1 && offsets[0] === 0))
  ) {
    console.log("Inverse");
    return true;
  } else {
    return false;
  }
}

export const isAlreadyOnDirection = (
  offsets: Array<number>,
  containerRectWidth: number,
  containerRectHeight: number,
  direction: number, // 0=right, 1=left, 2=down, 3=up
  startLine: number
) => {
  return ((direction === 0 && offsets[1] >= containerRectWidth)
    || (direction === 1 && offsets[1] <= startLine-1)
    || (direction === 2 && offsets[2] >= containerRectHeight-1)
    || (direction === 3 && offsets[2] <= startLine-1))
};

export const isGoingBackOnBorder = (
  offsets: Array<number>,
  containerRectWidth: number,
  containerRectHeight: number,
  startLine: number
) => {
  return (offsets[1] <= startLine || offsets[1] >= containerRectWidth
          || offsets[2] <= startLine || offsets[2] >= containerRectHeight-1)
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
    return [direction, offsetX, offsetY];
  };

  export const automaticMovePlayer = (
    playerOffsetLeft: number,
    playerOffsetTop: number,
    containerRectWidth: number,
    containerRectHeight: number,
    startLine: number,
    direction: number, // 0=right, 1=left, 2=down, 3=up
    isInversed: boolean
  ) => {
    let offsetX = playerOffsetLeft;
    let offsetY = playerOffsetTop;

    if (isInversed) {
      // Up
      if (playerOffsetLeft === containerRectWidth && playerOffsetTop > startLine) {
        offsetY = (playerOffsetTop - 1);
        direction = 3;
      }
      // Down
      else if (playerOffsetLeft === startLine && playerOffsetTop < containerRectHeight) {
        offsetY = (playerOffsetTop + 1);
        direction = 2;
      }
      // Right
      else if (playerOffsetTop === containerRectHeight && playerOffsetLeft < containerRectWidth) {
        offsetX = (playerOffsetLeft + 1);
        direction = 0;
      }
      // Left
      else if (playerOffsetTop === startLine && playerOffsetLeft > startLine) {
        offsetX = (playerOffsetLeft - 1);
        direction = 1;
      }
    } else {
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
    }
    return [direction, offsetX, offsetY];
  };
