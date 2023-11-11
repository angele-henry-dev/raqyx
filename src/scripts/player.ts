import { GestureDetail } from '@ionic/vue';

export const isAlreadyOnDirection = (
  offsets: Array<number>,
  containerRectWidth: number,
  containerRectHeight: number,
  direction: number,
  startLine: number
) => {
  return ((direction === 0 && offsets[1] >= containerRectWidth)
    || (direction === 1 && offsets[1] <= startLine-1)
    || (direction === 2 && offsets[2] >= containerRectHeight)
    || (direction === 3 && offsets[2] <= startLine-1))
};

export const isGoingBackOnBorder = (
  offsets: Array<number>,
  containerRectWidth: number,
  containerRectHeight: number,
  startLine: number
) => {
  return (offsets[1] <= startLine || offsets[1] >= containerRectWidth
          || offsets[2] <= startLine || offsets[2] >= containerRectHeight)
};

export const onGesture = (
  detail: GestureDetail,
  player: HTMLElement | null,
  container: HTMLElement | null,
  direction: number
) => {
    if (player && container) {
      let offsetX = player.offsetLeft;
      let offsetY = player.offsetTop;

      // Right
      if (detail.startX < detail.currentX && (detail.currentX - detail.startX) > 5) {
        offsetX = (player.offsetLeft + 1);
        direction = 0;
      }
      // Left
      else if (detail.startX > detail.currentX && (detail.startX - detail.currentX) > 5) {
        offsetX = (player.offsetLeft - 1);
        direction = 1;
      }
      // Down
      else if (detail.startY < detail.currentY && (detail.currentY - detail.startY) > 5) {
        offsetY = (player.offsetTop + 1);
        direction = 2;
      }
      // Up
      else if (detail.startY > detail.currentY && (detail.startY - detail.currentY) > 5) {
        offsetY = (player.offsetTop - 1);
        direction = 3;
      // No direction
      } else {
        if (direction === 0) {
          offsetX = (player.offsetLeft + 1);
        } else if (direction === 1) {
          offsetX = (player.offsetLeft - 1);
        } else if (direction === 2) {
          offsetY = (player.offsetTop + 1);
        } else if (direction === 3) {
          offsetY = (player.offsetTop - 1);
        }
      }

      return [direction, offsetX, offsetY];
    }
  };

  export const automaticMovePlayer = (
    player: HTMLElement | null,
    container: HTMLElement | null,
    startLine: number,
    direction: number // 0=right, 1=left, 2=down, 3=up
  ) => {
    if (player && container) {
      const containerRect = container.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();
      const containerRectWidth = containerRect.width + playerRect.width - 1;
      const containerRectHeight = containerRect.height + playerRect.height - 1;
      let offsetX = player.offsetLeft;
      let offsetY = player.offsetTop;

      if (direction === 1) {
        // Up
        if (player.offsetLeft === containerRectWidth && player.offsetTop > startLine) {
          offsetY = (player.offsetTop - 1);
        }
        // Down
        else if (player.offsetLeft === startLine && player.offsetTop < containerRectHeight) {
          offsetY = (player.offsetTop + 1);
        }
        // Right
        else if (player.offsetTop === containerRectHeight && player.offsetLeft < containerRectWidth) {
          offsetX = (player.offsetLeft + 1);
        }
        // Left
        else if (player.offsetTop === startLine && player.offsetLeft > startLine) {
          offsetX = (player.offsetLeft - 1);
        }
      } else {
        // Up
        if (player.offsetLeft === startLine && player.offsetTop > startLine) {
          offsetY = (player.offsetTop - 1);
        }
        // Down
        else if (player.offsetLeft === containerRectWidth && player.offsetTop < containerRectHeight) {
          offsetY = (player.offsetTop + 1);
        }
        // Right
        else if (player.offsetTop === startLine && player.offsetLeft < containerRectWidth) {
          offsetX = (player.offsetLeft + 1);
        }
        // Left
        else if (player.offsetTop === containerRectHeight && player.offsetLeft > startLine) {
          offsetX = (player.offsetLeft - 1);
        }
      }
  
      return [offsetX, offsetY];
    }
  };
