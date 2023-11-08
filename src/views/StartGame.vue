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

onMounted(() => {
  if (player.value && container.value) {
    // container.value.addEventListener('mousemove', mouseMovePlayer);
    /*const gesture = createGesture({
      el: container.value,
      gestureName: 'move-player',
      onMove: (detail) => { onMove(detail); }
    });
    gesture.enable();*/
  }
});

const automaticMovePlayer = () => {
  if (player.value && container.value) {
    const containerRect = container.value.getBoundingClientRect();
    const offsetX = (player.value.offsetLeft + 1);
    const offsetY = (player.value.offsetTop + 1);

    let maxX = 0;
    let maxY = 0;
    // Go right
    if (player.value.offsetLeft === 0) {
      maxX = 0;
    } else {
      maxX = containerRect.width;
    }
    // Go down
    if (player.value.offsetTop === 0 && player.value.offsetLeft < containerRect.width) {
      maxY = 0;
    } else {
      maxY = containerRect.height;
    }

    // Apply new coordinates to the player
    player.value.style.left = Math.min(maxX, Math.max(0, offsetX)) + 'px';
    player.value.style.top = Math.min(maxY, Math.max(0, offsetY)) + 'px';
  }
}

const onMove = (detail: GestureDetail) => {
  if (player.value && container.value) {
    const containerRect = container.value.getBoundingClientRect();
    const playerRect = player.value.getBoundingClientRect();
    const offsetX = detail.deltaX - containerRect.left - playerRect.width / 2;
    const offsetY = detail.deltaY - containerRect.top - playerRect.height / 2;

    // Limiter le déplacement du joueur pour qu'il reste à l'intérieur du conteneur.
    const maxX = containerRect.width - playerRect.width;
    const maxY = containerRect.height - playerRect.height;

    // Appliquer les nouvelles coordonnées au joueur.
    player.value.style.left = Math.min(maxX, Math.max(0, offsetX)) + 'px';
    player.value.style.top = Math.min(maxY, Math.max(0, offsetY)) + 'px';
  }
}

const mouseMovePlayer = (event: MouseEvent) => {
  if (player.value && container.value) {
    const containerRect = container.value.getBoundingClientRect();
    const playerRect = player.value.getBoundingClientRect();
    const offsetX = event.clientX - containerRect.left - playerRect.width / 2;
    const offsetY = event.clientY - containerRect.top - playerRect.height / 2;

    // Limiter le déplacement du joueur pour qu'il reste à l'intérieur du conteneur.
    const maxX = containerRect.width - playerRect.width;
    const maxY = containerRect.height - playerRect.height;

    // Appliquer les nouvelles coordonnées au joueur.
    player.value.style.left = Math.min(maxX, Math.max(0, offsetX)) + 'px';
    player.value.style.top = Math.min(maxY, Math.max(0, offsetY)) + 'px';
  }
}
setInterval(automaticMovePlayer, 10);
</script>

<style scoped>
ion-grid {
  width: 90%;
  height: 95%;
  margin: auto;
}

#game-area {
  height: 90%;
  max-height: 500px;
}

#container {
  width: 100%;
  height: 100%;
  border: 1px solid black;
  margin: 0;
  padding: 0;
  /*position: relative;*/
}

#player {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background-color: var(--ion-color-primary);
  position: absolute;
  top: 0;
  left: 1;
}
</style>