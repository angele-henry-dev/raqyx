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
            <div ref="container" id="container" class="container"></div>
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
import { onGesture, automaticMovePlayer, isAlreadyOnDirection, isUserChangingDirection, isGoingBackOnBorder } from '@/scripts/player';
import { randomIntFromInterval } from '@/scripts/utils'
import { Ennemy, collideBorder } from '@/scripts/ennemy'

const player = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const gameSpeed = 10;
const startLine = -1;
const numberOfEnnemies = 5;
let autoIntervalId: number | undefined = undefined;
let manualIntervalId: number | undefined = undefined;
let direction = 0; // 0=right, 1=left, 2=down, 3=up
let isInversed = false;
let numberCurrentEnnemies = 0;
const ennemiesTable: Record<string, Ennemy>  = {};

onMounted(() => {
  if (player.value && container.value) {
    const gesture = createGesture({
      el: container.value,
      gestureName: 'move-player',
      onEnd: (detail) => { manualMovePlayer(detail); }
    });
    if (autoIntervalId == undefined) {
      autoIntervalId = setInterval(autoMovePlayer, gameSpeed);
    }
    gesture.enable();
  }
});

const gameOver = () => {
  clearInterval(manualIntervalId);
  clearInterval(autoIntervalId);
  for (const key of Object.keys(ennemiesTable)) {
    clearInterval(ennemiesTable[key].intervalId);
  }
  console.log("Game over");
};

/* Ennemies scripts */

const createEnnemies = (containerRect: DOMRect) => {
  if (player.value && container.value) {
    const numberCurrentDivEnnemies = numberCurrentEnnemies = document.querySelectorAll('[id^="ennemy"]').length;

    for (let i=0; i<(numberOfEnnemies-numberCurrentDivEnnemies); i++) {
      const ennemy = document.createElement("div");
      ennemy.setAttribute("id", `ennemy${i}`);
      ennemy.setAttribute("class", `ennemy`);

      const left = randomIntFromInterval(10, containerRect.width-10)
      const top = randomIntFromInterval(10, containerRect.height-10)
      ennemy.style.left = `${left}px`;
      ennemy.style.top = `${top}px`;

      document.getElementById("container")?.appendChild(ennemy);
      numberCurrentEnnemies += 1;

      const ennemyIntervalId = setInterval(moveEnnemy, gameSpeed, containerRect, ennemy, `ennemy${i}`);

      const possibleSpeed = [1, -1];
      ennemiesTable[`ennemy${i}`] = {
        "x": left,
        "y": top,
        "speedX": possibleSpeed[randomIntFromInterval(0, 1)],
        "speedY": possibleSpeed[randomIntFromInterval(0, 1)],
        "intervalId": ennemyIntervalId
      };
    }
  }
};

const moveEnnemy = (containerRect: DOMRect, ennemyDiv: HTMLElement, ennemyId: string) => {
  if (ennemyDiv && container.value) {
    const containerRectWidth = containerRect.width;
    const containerRectHeight = containerRect.height;

    ennemiesTable[ennemyId].x = ennemiesTable[ennemyId].x + ennemiesTable[ennemyId].speedX;
    ennemiesTable[ennemyId].y = ennemiesTable[ennemyId].y + ennemiesTable[ennemyId].speedY;
    ennemyDiv.style.left = `${ennemiesTable[ennemyId].x}px`;
    ennemyDiv.style.top = `${ennemiesTable[ennemyId].y}px`;

    const newOffset = collideBorder(ennemiesTable[ennemyId].x, ennemiesTable[ennemyId].y, containerRectWidth-2, containerRectHeight-1, startLine+5)
    ennemiesTable[ennemyId].speedX *= newOffset[0];
    ennemiesTable[ennemyId].speedY *= newOffset[1];
  }
};

/* Player scripts */

const goBackAuto = () => {
  clearInterval(manualIntervalId);
  manualIntervalId = undefined;
  if (autoIntervalId == undefined) {
    autoIntervalId = setInterval(autoMovePlayer, gameSpeed);
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
    manualIntervalId = setInterval(function() {
      if (player.value && container.value) {
        const containerRect = container.value.getBoundingClientRect();
        const playerRect = player.value.getBoundingClientRect();
        const containerRectWidth = containerRect.width + playerRect.width;
        const containerRectHeight = containerRect.height + playerRect.height;
        const offsets = onGesture(detail, player.value.offsetLeft, player.value.offsetTop, direction);

        if (offsets) {
          isInversed = isUserChangingDirection(offsets, containerRectWidth, containerRectHeight, direction, startLine) ? true : false;
          direction = offsets[0];
          if (isAlreadyOnDirection(offsets, containerRectWidth, containerRectHeight, direction, startLine)) {
            return goBackAuto();
          }
          clearInterval(autoIntervalId);
          autoIntervalId = undefined;
          player.value.style.left = `${offsets[1]}px`;
          player.value.style.top = `${offsets[2]}px`;

          if (isGoingBackOnBorder(offsets[1], offsets[2], containerRectWidth, containerRectHeight, startLine)) {
            return goBackAuto();
          }

          for (const key of Object.keys(ennemiesTable)) {
            const ennemy = ennemiesTable[key];
            if (
              (offsets[1] <= (ennemy.x + playerRect.width - 2) && offsets[1] >= (ennemy.x - playerRect.width + 2)) &&
              (offsets[2] <= (ennemy.y + playerRect.height - 2) && offsets[2] >= (ennemy.y - playerRect.height + 2))
            ) {
              return gameOver();
            }
          }
        } else {
          return goBackAuto();
        }
      } else {
        return goBackAuto();
      }
    }, gameSpeed);
  }
};

</script>
