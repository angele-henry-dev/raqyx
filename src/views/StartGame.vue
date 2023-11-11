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
import { onMove, automaticMovePlayer } from '@/scripts/game';

const player = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const startLine = -1;
let autoIntervalId: number | undefined = undefined;
let manualIntervalId: number | undefined = undefined;
let direction = 0; // 0=right, 1=left, 2=down, 3=up

onMounted(() => {
  if (player.value && container.value) {
    const gesture = createGesture({
      el: container.value,
      gestureName: 'move-player',
      onMove: (detail) => { manualMovePlayer(detail); }
    });
    if (autoIntervalId == undefined) {
      autoIntervalId = setInterval(autoMovePlayer, 10);
    }
    gesture.enable();
  }
});

const manualMovePlayer = (detail: GestureDetail) => {
  if (manualIntervalId == undefined) {
    manualIntervalId = setInterval(function(){
      if (player.value && container.value) {
        const containerRect = container.value.getBoundingClientRect();
        const playerRect = player.value.getBoundingClientRect();
        const containerRectWidth = containerRect.width + playerRect.width - 1;
        const containerRectHeight = containerRect.height + playerRect.height - 1;
        const offsets = onMove(detail, player.value, container.value);

        if (offsets) {
          direction = offsets[0];
          if ((direction === 0 && offsets[1] >= containerRectWidth)
          || (direction === 1 && offsets[1] <= startLine)
          || (direction === 2 && offsets[2] >= containerRectHeight)
          || (direction === 3 && offsets[2] <= startLine)) {
            return goBackAuto();
          }
          clearInterval(autoIntervalId);
          autoIntervalId = undefined;

          player.value.style.left = offsets[1] + 'px';
          player.value.style.top = offsets[2] + 'px';
          if (offsets[1] <= startLine || offsets[1] >= containerRectWidth
          || offsets[2] <= startLine || offsets[2] >= containerRectHeight) {
            return goBackAuto();
          }

        } else {
          return goBackAuto();
        }
      } else {
        return goBackAuto();
      }
    }, 10);
  }
};

const goBackAuto = () => {
  clearInterval(manualIntervalId);
  manualIntervalId = undefined;
  if (autoIntervalId == undefined) {
    autoIntervalId = setInterval(autoMovePlayer, 10);
  }
};

const autoMovePlayer = () => {
  if (player.value && container.value) {
    const offsets = automaticMovePlayer(player.value, container.value, startLine, direction);
    if (offsets) {
      player.value.style.left = offsets[0] + 'px';
      player.value.style.top = offsets[1] + 'px';
    }
  }
};

</script>
