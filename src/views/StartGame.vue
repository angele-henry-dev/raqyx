<template>
  <ion-page>
    <ion-content>
      <ion-grid>
        <ion-row class="ion-justify-content-between">
          <ion-col size="5" class="ion-text-start">
            650798
          </ion-col>
          <ion-col size="5" class="ion-text-end">
            0% / 75%
          </ion-col>
        </ion-row>
        <ion-row id="game-area">
          <ion-col>
            <div ref="player" id="player"></div>
            <div ref="container" id="container">
              <div id="enemies"></div>
            </div>
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-between">
          <ion-col size="5" class="ion-text-start">
            Level 1
          </ion-col>
          <ion-col size="5" class="ion-text-end">
            o x1
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, GestureDetail } from '@ionic/vue';
import { createGesture } from '@ionic/vue';

const player = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const startLine = -1;

onMounted(() => {
  if (player.value && container.value) {
    const gesture = createGesture({
      el: container.value,
      gestureName: 'move-player',
      onMove: (detail) => { onMove(detail); }
    });
    gesture.enable();
  }
});

const automaticMovePlayer = () => {
  if (player.value && container.value) {
    const containerRect = container.value.getBoundingClientRect();
    const playerRect = player.value.getBoundingClientRect();
    const containerRectWidth = containerRect.width + playerRect.width - 1;
    const containerRectHeight = containerRect.height + playerRect.height - 1;
    const goRight = true;
    let offsetX = player.value.offsetLeft;
    let offsetY = player.value.offsetTop;

    if (goRight) {
      if (player.value.offsetLeft === startLine && player.value.offsetTop > startLine) {
        offsetY = (player.value.offsetTop - 1);
      }
      else if (player.value.offsetLeft === containerRectWidth && player.value.offsetTop < containerRectHeight) {
        offsetY = (player.value.offsetTop + 1);
      }
      else if (player.value.offsetTop === startLine && player.value.offsetLeft < containerRectWidth) {
        offsetX = (player.value.offsetLeft + 1);
      }
      else if (player.value.offsetTop === containerRectHeight && player.value.offsetLeft > startLine) {
        offsetX = (player.value.offsetLeft - 1);
      }
    } else {
      if (player.value.offsetLeft === containerRectWidth && player.value.offsetTop > startLine) {
        offsetY = (player.value.offsetTop - 1);
      }
      else if (player.value.offsetLeft === startLine && player.value.offsetTop < containerRectHeight) {
        offsetY = (player.value.offsetTop + 1);
      }
      else if (player.value.offsetTop === containerRectHeight && player.value.offsetLeft < containerRectWidth) {
        offsetX = (player.value.offsetLeft + 1);
      }
      else if (player.value.offsetTop === startLine && player.value.offsetLeft > startLine) {
        offsetX = (player.value.offsetLeft - 1);
      }
    }

    player.value.style.left = offsetX + 'px';
    player.value.style.top = offsetY + 'px';
  }
}

const onMove = (detail: GestureDetail) => {
  if (player.value && container.value) {
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

    //const containerRect = container.value.getBoundingClientRect();
    //const playerRect = player.value.getBoundingClientRect();

    //const offsetX = detail.deltaX - containerRect.left - playerRect.width / 2;
    //const offsetY = detail.deltaY - containerRect.top - playerRect.height / 2;

    //const maxX = containerRect.width - playerRect.width;
    //const maxY = containerRect.height - playerRect.height;

    //player.value.style.left = Math.min(maxX, Math.max(0, offsetX)) + 'px';
    //player.value.style.top = Math.min(maxY, Math.max(0, offsetY)) + 'px';
  }
}
setInterval(automaticMovePlayer, 10);
</script>

<style scoped>
ion-grid {
  width: 100%;
  height: 100%;
  margin: auto;
}

#game-area {
  width: 100%;
  height: calc(100% - 120px);
  border: 1px solid red;
}

#container {
  width: 100%;
  height: 100%;
  border: 1px solid black;
  margin: 0;
  padding: 0;
}

#player {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background-color: var(--ion-color-primary);
  position: absolute;
  top: -1px;
  left: 1px;
}
</style>