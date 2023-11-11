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

onMounted(() => {
  if (player.value && container.value) {
    const gesture = createGesture({
      el: container.value,
      gestureName: 'move-player',
      onMove: (detail) => { manualMovePlayer(detail); }
    });
    autoIntervalId = setInterval(autoMovePlayer, 10);
    gesture.enable();
  }
});

const manualMovePlayer = (detail: GestureDetail) => {
  if (manualIntervalId == undefined) {
    clearInterval(autoIntervalId);
    autoIntervalId = undefined;

    manualIntervalId = setInterval(function(){
      if (player.value && container.value) {
        const containerRect = container.value.getBoundingClientRect();
        const playerRect = player.value.getBoundingClientRect();
        const containerRectWidth = containerRect.width + playerRect.width - 1;
        const containerRectHeight = containerRect.height + playerRect.height - 1;
        const offsets = onMove(detail, player.value, container.value);

        if (offsets) {
          player.value.style.left = offsets[0] + 'px';
          player.value.style.top = offsets[1] + 'px';
          if (offsets[0] <= startLine || offsets[0] >= containerRectWidth
          || offsets[1] <= startLine || offsets[1] >= containerRectHeight) {
              clearInterval(manualIntervalId);
              manualIntervalId = undefined;
              return;
          }

        } else {
          clearInterval(manualIntervalId);
          manualIntervalId = undefined;
          return;
        }
      } else {
        clearInterval(manualIntervalId);
        manualIntervalId = undefined;
        return;
      }
    }, 10);
  }
};

const autoMovePlayer = () => {
  if (player.value && container.value) {
    const offsets = automaticMovePlayer(player.value, container.value, startLine);
    if (offsets) {
      player.value.style.left = offsets[0] + 'px';
      player.value.style.top = offsets[1] + 'px';
    }
  }
};

</script>
