import { GestureDetail } from '@ionic/vue';

export const onMove = (
  detail: GestureDetail,
  player: HTMLElement | null,
  container: HTMLElement | null
) => {
    if (player && container) {
      let offsetX = player.offsetLeft;
      let offsetY = player.offsetTop;

      // Right
      if (detail.startX < detail.currentX && (detail.currentX - detail.startX) > 5) {
        offsetX = (player.offsetLeft + 1);
      }
      // Left
      else if (detail.startX > detail.currentX && (detail.startX - detail.currentX) > 5) {
        offsetX = (player.offsetLeft - 1);
      }
      // Down
      else if (detail.startY < detail.currentY && (detail.currentY - detail.startY) > 5) {
        offsetY = (player.offsetTop + 1);
      }
      // Up
      else if (detail.startY > detail.currentY && (detail.startY - detail.currentY) > 5) {
        offsetY = (player.offsetTop - 1);
      }

      return [offsetX, offsetY];
    }
  };

  export const automaticMovePlayer = (
    player: HTMLElement | null,
    container: HTMLElement | null,
    startLine: number
  ) => {
    if (player && container) {
      const containerRect = container.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();
      const containerRectWidth = containerRect.width + playerRect.width - 1;
      const containerRectHeight = containerRect.height + playerRect.height - 1;
      const goRight = true;
      let offsetX = player.offsetLeft;
      let offsetY = player.offsetTop;
  
      if (goRight) {
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
      } else {
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
      }
  
      return [offsetX, offsetY];
    }
  };
