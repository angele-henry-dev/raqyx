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
        <ion-row class="game-area">
          <ion-col>
            <div ref="player" class="player"></div>
            <canvas ref="container" id="container" class="container"></canvas>
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
import { onGesture, automaticMovePlayer, isAlreadyOnDirection, isGoingBackOnBorder, isUserChangingDirection } from '@/scripts/player';
import { randomIntFromInterval } from '@/scripts/utils'

const player = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const speed = 10;
const startLine = -1;
const numberOfEnnemies = 1;
let autoIntervalId: number | undefined = undefined;
let manualIntervalId: number | undefined = undefined;
let direction = 0; // 0=right, 1=left, 2=down, 3=up
let isInversed = false;
let numberCurrentEnnemies = 0;

onMounted(() => {
  if (player.value && container.value) {
    const gesture = createGesture({
      el: container.value,
      gestureName: 'move-player',
      onEnd: (detail) => { manualMovePlayer(detail); }
    });
    if (autoIntervalId == undefined) {
      autoIntervalId = setInterval(autoMovePlayer, speed);
    }
    gesture.enable();
  }
});

/* Ennemies scripts */

const createEnnemies = (containerRect: DOMRect) => {
  if (player.value && container.value) {
    numberCurrentEnnemies = document.querySelectorAll('[id^="ennemy"]').length;

    for (let i=0; i<(numberOfEnnemies-numberCurrentEnnemies); i++) {
      const ennemy = document.createElement("div");
      ennemy.setAttribute("ref", `ennemy${i}`);
      ennemy.setAttribute("id", `ennemy${i}`);
      ennemy.setAttribute("class", `ennemy`);

      const left = randomIntFromInterval(1, containerRect.width-1)
      const top = randomIntFromInterval(1, containerRect.height-1)
      ennemy.style.left = `${left}px`;
      ennemy.style.top = `${top}px`;

      document.getElementById("container")?.appendChild(ennemy);
      numberCurrentEnnemies += 1;

      setInterval(moveEnnemy, speed, containerRect, `ennemy${i}`);
    }
  }
};

function moveEnnemy(containerRect: DOMRect, ennemyId: string) {
  const ennemy = document.getElementById(ennemyId);
  const ennemyRect = ennemy?.getBoundingClientRect();

  if (ennemy && ennemyRect) {
    // const direction = Math.floor(Math.random() * 4);
    // let offsetX = 0;
    // let offsetY = 0;

    // switch (direction) {
    //   case 0: // Top
    //     offsetX = 0;
    //     offsetY = -1;
    //     break;
    //   case 1: // Down
    //     offsetX = 0;
    //     offsetY = 1;
    //     break;
    //   case 2: // Left
    //     offsetX = -1;
    //     offsetY = 0;
    //     break;
    //   case 3: // Right
    //     offsetX = 1;
    //     offsetY = 0;
    //     break;
    // }

    // const newX = Math.max(0, Math.min(containerRect.width, ennemyRect.width + offsetX));
    // const newY = Math.max(0, Math.min(containerRect.height, ennemyRect.height + offsetY));

    // ennemy.style.left = `${newX}px`;
    // ennemy.style.top = `${newY}px`;
  }
}

/* Player scripts */

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

    if (numberCurrentEnnemies < numberOfEnnemies) {
      createEnnemies(containerRect);
    }

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
      player.value.style.left = `${offsets[1]}px`;
      player.value.style.top = `${offsets[2]}px`;
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
        const containerRectHeight = containerRect.height + playerRect.height;
        const offsets = onGesture(detail, player.value.offsetLeft, player.value.offsetTop, direction);

        if (offsets) {
          isInversed = isUserChangingDirection(offsets, containerRectWidth, containerRectHeight, direction, startLine, isInversed) ? true : false;
          direction = offsets[0];
          if (isAlreadyOnDirection(offsets, containerRectWidth, containerRectHeight, direction, startLine)) {
            return goBackAuto();
          }
          clearInterval(autoIntervalId);
          autoIntervalId = undefined;
          player.value.style.left = `${offsets[1]}px`;
          player.value.style.top = `${offsets[2]}px`;
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
