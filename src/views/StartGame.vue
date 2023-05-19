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
import { onMounted, ref } from 'vue';
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { createAnimation, createGesture  } from '@ionic/vue';

const animation = createAnimation();
const player = ref<HTMLDivElement | null>(null);
const container = ref<HTMLDivElement | null>(null);

function launchGesture() {
  if (container.value) {
    const gesture = createGesture({
      el: container.value,
      gestureName: 'move-player',
      onMove: (detail) => { onMove(detail); }
    });
    gesture.enable();
  }
}

function onMove(detail) {
  if (player.value && container.value) {
    const deltaY = detail.deltaY; // Negatif haut - Positif bas
    const deltaX = detail.deltaX; // Negatif gauche - Positif droite

    container.value.innerHTML = `
      <div>Delta Y: ${deltaY}</div>
      <div>Delta X: ${deltaX}</div>
      <div>Player offsetHeight: ${player.value.offsetHeight}</div>
      <div>Player offsetWidth: ${player.value.offsetWidth}</div>
      <div>Player offsetTop: ${player.value.offsetTop}</div>
      <div>Player offsetLeft: ${player.value.offsetLeft}</div>
    `
  }
}

function launchPlayer() {
  if (player.value && container.value) {
    const CONTAINER_WIDTH = 315;
    const CONTAINER_HEIGHT = 549;
    const PLAYER_SIZE = 7;
    const duration = 15000; // Durée de l'animation en millisecondes

    animation
      .addElement(player.value)
      .duration(duration)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, left: '0px', top: '0px' },
        { offset: 0.25, left: (CONTAINER_WIDTH + PLAYER_SIZE) + 'px', top: '0px' },
        { offset: 0.5, left: (CONTAINER_WIDTH + PLAYER_SIZE) + 'px', top: (CONTAINER_HEIGHT + PLAYER_SIZE) + 'px' },
        { offset: 0.75, left: '0px', top: (CONTAINER_HEIGHT + PLAYER_SIZE) + 'px' },
        { offset: 1, left: '0px', top: '0px' },
      ])
      .play().then(() => {
      // Code à exécuter après l'animation
      });
  }
}

onMounted(() => {
  launchPlayer();
  launchGesture();
});
</script>

<style scoped>
ion-grid {
  width: 90%;
  height: 95%;
  margin: auto;
}

#game-area {
  height: 90%;
  max-height: 600px;
}

#container {
  width: 100%;
  height: 100%;
  border: 1px solid black;
  margin: 0;
  padding: 0;
  position: relative;
}

#player {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background-color: var(--ion-color-primary);
  position: absolute;
  top: 0;
  left: 0;
}
</style>