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
import { onGesture, automaticMovePlayer, isAlreadyOnDirection, isGoingBackOnBorder } from '@/scripts/player';

const player = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const speed = 10;
const startLine = -1;
let autoIntervalId: number | undefined = undefined;
let manualIntervalId: number | undefined = undefined;
let direction = 0; // 0=right, 1=left, 2=down, 3=up
let isInversed = false;

onMounted(() => {
  if (player.value && container.value) {
    const gesture = createGesture({
      el: container.value,
      gestureName: 'move-player',
      onMove: (detail) => { manualMovePlayer(detail); }
    });
    if (autoIntervalId == undefined) {
      autoIntervalId = setInterval(autoMovePlayer, speed);
    }
    gesture.enable();
  }
});

const goBackAuto = () => {
  clearInterval(manualIntervalId);
  manualIntervalId = undefined;
  if (autoIntervalId == undefined) {
    autoIntervalId = setInterval(autoMovePlayer, speed);
  }
};

const autoMovePlayer = () => {
  if (player.value && container.value) {
    const containerRect = container.value.getBoundingClientRect();
    const playerRect = player.value.getBoundingClientRect();
    const containerRectWidth = containerRect.width + playerRect.width - 1;
    const containerRectHeight = containerRect.height + playerRect.height - 1;
    const offsets = automaticMovePlayer(
      player.value.offsetLeft,
      player.value.offsetTop,
      containerRectWidth,
      containerRectHeight,
      startLine,
      direction,
      isInversed
    );
    if (offsets) {
      direction = offsets[0];
      player.value.style.left = offsets[1] + 'px';
      player.value.style.top = offsets[2] + 'px';
    }
  }
};

const manualMovePlayer = (detail: GestureDetail) => {
  if (manualIntervalId == undefined) {
    manualIntervalId = setInterval(function(){
      if (player.value && container.value) {
        const containerRect = container.value.getBoundingClientRect();
        const playerRect = player.value.getBoundingClientRect();
        const containerRectWidth = containerRect.width + playerRect.width;
        const containerRectHeight = containerRect.height + playerRect.height - 1;
        const offsets = onGesture(detail, player.value.offsetLeft, player.value.offsetTop, direction);

        if (offsets) {
          if (
            ((offsets[1] === containerRectWidth) && (direction === 2 && offsets[0] === 3))
            || ((offsets[1] === startLine) && (direction === 3 && offsets[0] === 2))
            || ((offsets[2] === startLine) && (direction === 0 && offsets[0] === 1))
            || ((offsets[2] === containerRectHeight) && (direction === 1 && offsets[0] === 0))
          ) {
            console.log("Inverse");
            isInversed = true;
          } else {
            isInversed = false;
          }
          direction = offsets[0];
          if (isAlreadyOnDirection(offsets, containerRectWidth, containerRectHeight, direction, startLine)) {
            return goBackAuto();
          }
          clearInterval(autoIntervalId);
          autoIntervalId = undefined;
          player.value.style.left = offsets[1] + 'px';
          player.value.style.top = offsets[2] + 'px';
          if (isGoingBackOnBorder(offsets, containerRectWidth, containerRectHeight, startLine)) {
            return goBackAuto();
          }
        } else {
          return goBackAuto();
        }
      } else {
        return goBackAuto();
      }
    }, speed);
  }
};

</script>
