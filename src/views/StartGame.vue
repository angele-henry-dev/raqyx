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

    // Limiter les mouvements à autour du rectangle
    let maxX = 0;
    let maxY = 0;
    // En haut
    if (player.value.offsetTop === 0 && player.value.offsetLeft < containerRect.width) {
      maxY = 0;
    } else {
      maxY = containerRect.height;
    }
    // A gauche
    if (player.value.offsetLeft === 0) {
      maxX = 0;
    } else {
      maxX = containerRect.width;
    }
    /*// En bas
    if (player.value.offsetTop === containerRect.height) {
      maxY = containerRect.height;
    } else {
      maxY = 0;
    }
    // A droite
    if (player.value.offsetLeft === containerRect.width) {
      maxX = containerRect.width;
    } else {
      maxX = 0;
    }*/

    // Appliquer les nouvelles coordonnées au joueur.
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


/*import { onMounted, ref } from 'vue';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, GestureDetail } from '@ionic/vue';
import { createGesture } from '@ionic/vue';

const player = ref<HTMLDivElement | null>(null);
const container = ref<HTMLDivElement | null>(null);

const initialize = () => {
  if (player.value && container.value) {
    player.value.style.position = 'absolute';
    player.value.style.top = "0px";
    player.value.style.left = "0px";
  }
};

onMounted(() => {
  initialize();
  if (player.value && container.value) {
    const gesture = createGesture({
      el: container.value,
      gestureName: 'move-player',
      onMove: (detail) => { onMove(detail); }
    });
    gesture.enable();
  }
});

const movePlayer = () => {
  if (player.value && container.value) {
    const playerTop = player.value.offsetTop;
    const playerLeft = player.value.offsetLeft;
    const containerTop = container.value.offsetTop;
    const containerLeft = container.value.offsetLeft;
    const containerWidth = container.value.offsetWidth;
    const containerHeight = container.value.offsetHeight;

    // Déplacement du joueur vers le haut
    if (playerTop < containerTop) {
      player.value.style.top = (playerTop + 1).toString() + "px";
    }
    // Déplacement du joueur vers le bas
    else if (playerTop > containerTop + containerHeight) {
      player.value.style.top = (playerTop - 1).toString() + "px";
    }

    // Déplacement du joueur vers la gauche
    if (playerLeft < containerLeft) {
      player.value.style.left = (playerLeft + 1).toString() + "px";
    }
    // Déplacement du joueur vers la droite
    else if (playerLeft > containerLeft + containerWidth) {
      player.value.style.left = (playerLeft - 1).toString() + "px";
    }
  }
};

const onMove = (detail: GestureDetail) => {
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
      <div>Player left: ${player.value.style.left}</div>
      <div>Player top: ${player.value.style.top}</div>
    `
  }
}

setInterval(movePlayer, 10);*/

/*import { onMounted, ref } from 'vue';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, GestureDetail } from '@ionic/vue';
import { createAnimation, createGesture  } from '@ionic/vue';

const animationPlayer = createAnimation();
const player = ref<HTMLDivElement | null>(null);
const container = ref<HTMLDivElement | null>(null);
const CONTAINER_WIDTH = 315;
const CONTAINER_HEIGHT = 549;
const PLAYER_SIZE = 7;
const duration = 15000; // Durée de l'animation en millisecondes

const initialize = () => {
  if (player.value && container.value) {
    animationPlayer
      .addElement(player.value)
      .duration(duration)
      .iterations(Infinity);
    const gesture = createGesture({
      el: container.value,
      gestureName: 'move-player',
      onMove: (detail) => { onMove(detail); }
    });
    gesture.enable();
  }
}

const onMove = (detail: GestureDetail) => {
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

const launchPlayer = () => {
  if (player.value && container.value) {
    animationPlayer
      .keyframes([
        { offset: 0, left: '0px', top: '0px' },
        { offset: 0.25, left: (CONTAINER_WIDTH + PLAYER_SIZE) + 'px', top: '0px' },
        { offset: 0.5, left: (CONTAINER_WIDTH + PLAYER_SIZE) + 'px', top: (CONTAINER_HEIGHT + PLAYER_SIZE) + 'px' },
        { offset: 0.75, left: '0px', top: (CONTAINER_HEIGHT + PLAYER_SIZE) + 'px' },
        { offset: 1, left: '0px', top: '0px' },
      ])
      .play();
  }
}

onMounted(() => {
  initialize();
  launchPlayer();
});*/
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