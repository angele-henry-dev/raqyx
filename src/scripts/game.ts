import { GestureDetail } from '@ionic/vue';

export const onMove = (
  detail: GestureDetail,
  player: HTMLElement | null,
  container: HTMLElement | null
) => {
    if (player && container) {
      let direction = "";
      if (detail.startX < detail.currentX && (detail.currentX - detail.startX) > 5) {
        direction = "right";
        console.log("right");
      }
      else if (detail.startX > detail.currentX && (detail.startX - detail.currentX) > 5) {
        direction = "left";
        console.log("left");
      }
      else if (detail.startY < detail.currentY && (detail.currentY - detail.startY) > 5) {
        direction = "down";
        console.log("down");
      }
      else if (detail.startY > detail.currentY && (detail.startY - detail.currentY) > 5) {
        direction = "up";
        console.log("up");
      }
  
      //const containerRect = container.getBoundingClientRect();
      //const playerRect = player.getBoundingClientRect();
  
      //const offsetX = detail.deltaX - containerRect.left - playerRect.width / 2;
      //const offsetY = detail.deltaY - containerRect.top - playerRect.height / 2;
  
      //const maxX = containerRect.width - playerRect.width;
      //const maxY = containerRect.height - playerRect.height;
  
      //player.style.left = Math.min(maxX, Math.max(0, offsetX)) + 'px';
      //player.style.top = Math.min(maxY, Math.max(0, offsetY)) + 'px';
    }
  };

  export const automaticMovePlayer = (
    player: HTMLElement | null,
    container: HTMLElement | null
  ) => {
    if (player && container) {
      const startLine = -1;
      const containerRect = container.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();
      const containerRectWidth = containerRect.width + playerRect.width - 1;
      const containerRectHeight = containerRect.height + playerRect.height - 1;
      const goRight = true;
      let offsetX = player.offsetLeft;
      let offsetY = player.offsetTop;
  
      if (goRight) {
        if (player.offsetLeft === startLine && player.offsetTop > startLine) {
          offsetY = (player.offsetTop - 1);
        }
        else if (player.offsetLeft === containerRectWidth && player.offsetTop < containerRectHeight) {
          offsetY = (player.offsetTop + 1);
        }
        else if (player.offsetTop === startLine && player.offsetLeft < containerRectWidth) {
          offsetX = (player.offsetLeft + 1);
        }
        else if (player.offsetTop === containerRectHeight && player.offsetLeft > startLine) {
          offsetX = (player.offsetLeft - 1);
        }
      } else {
        if (player.offsetLeft === containerRectWidth && player.offsetTop > startLine) {
          offsetY = (player.offsetTop - 1);
        }
        else if (player.offsetLeft === startLine && player.offsetTop < containerRectHeight) {
          offsetY = (player.offsetTop + 1);
        }
        else if (player.offsetTop === containerRectHeight && player.offsetLeft < containerRectWidth) {
          offsetX = (player.offsetLeft + 1);
        }
        else if (player.offsetTop === startLine && player.offsetLeft > startLine) {
          offsetX = (player.offsetLeft - 1);
        }
      }
  
      return [offsetX, offsetY];
    }
  };
