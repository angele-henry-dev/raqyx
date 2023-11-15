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
import { Player, onGesture, automaticMovePlayer, isAlreadyOnDirection, isUserChangingDirection, isGoingBackOnBorder } from '@/scripts/player';
import { randomIntFromInterval } from '@/scripts/utils'
import { Ennemy, collideBorder } from '@/scripts/ennemy'
import { Territory } from '@/scripts/territory'

const GAME_SPEED = 10;
const START_LINE = -1;
const NUMBER_OF_ENNEMIES = 1;
const PLAYER_SIZE = 6;
const player = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
let autoIntervalId: number | undefined = undefined;
let manualIntervalId: number | undefined = undefined;
let direction = 0; // 0=right, 1=left, 2=down, 3=up
let isInversed = false;
let numberCurrentEnnemies = 0;
let playerTable: Player = {
  x: 0,
  y: 0,
  direction: 0
};
const ennemiesTable: Record<string, Ennemy>  = {};
const territoriesTable: Record<string, Territory>  = {};

onMounted(() => {
  if (player.value && container.value) {
    const gesture = createGesture({
      el: container.value,
      gestureName: 'move-player',
      onEnd: (detail) => { manualMovePlayer(detail); }
    });
    if (autoIntervalId == undefined) {
      autoIntervalId = setInterval(autoMovePlayer, GAME_SPEED);
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
  if (container.value) {
    const numberCurrentDivEnnemies = numberCurrentEnnemies = document.querySelectorAll('[id^="ennemy"]').length;

    for (let i=0; i<(NUMBER_OF_ENNEMIES-numberCurrentDivEnnemies); i++) {
      const ennemy = document.createElement("div");
      ennemy.setAttribute("id", `ennemy${i}`);
      ennemy.setAttribute("class", `ennemy`);

      const left = randomIntFromInterval(10, containerRect.width-10)
      const top = randomIntFromInterval(10, containerRect.height-10)
      ennemy.style.left = `${left}px`;
      ennemy.style.top = `${top}px`;

      document.getElementById("container")?.appendChild(ennemy);
      numberCurrentEnnemies += 1;

      const ennemyIntervalId = setInterval(moveEnnemy, GAME_SPEED, containerRect, ennemy, `ennemy${i}`);

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

    const newOffset = collideBorder(ennemiesTable[ennemyId].x, ennemiesTable[ennemyId].y, containerRectWidth-2, containerRectHeight-1, START_LINE+PLAYER_SIZE-1)
    ennemiesTable[ennemyId].speedX *= newOffset[0];
    ennemiesTable[ennemyId].speedY *= newOffset[1];
  }
};

/* Territory scripts */

const drawTerritories = (left: number, top: number, containerRect: DOMRect) => {
  let width = 0;
  let height = 0;
  if (direction === 0) { // 0=right, 1=left, 2=down, 3=up
    width = left - PLAYER_SIZE;
    left = START_LINE + PLAYER_SIZE;
  } else if (direction === 1) {
    left = left + PLAYER_SIZE;
    width = (containerRect.width - left) + (PLAYER_SIZE / 2) + 1;
  } else if (direction === 2) {
    height = top - PLAYER_SIZE;
    top = START_LINE + PLAYER_SIZE + 1;
  } else {
    top = top + PLAYER_SIZE;
    height = (containerRect.height - top) + (PLAYER_SIZE / 2) + 1;
  }

  let territory = document.getElementById("territory");
  if (territory == null) {
    territory = document.createElement("div");
    territory.setAttribute("id", `territory`);
    territory.style.border = "1px solid green";
    territory.style.backgroundColor = "yellow";
    territory.style.position = "absolute";
  }
  territory.style.left = `${left}px`;
  territory.style.top = `${top}px`;
  territory.style.width = `${width}px`;
  territory.style.height = `${height}px`;
  document.getElementById("container")?.appendChild(territory);
};

/* Player scripts */

const goBackAuto = () => {
  clearInterval(manualIntervalId);
  manualIntervalId = undefined;
  if (autoIntervalId == undefined) {
    autoIntervalId = setInterval(autoMovePlayer, GAME_SPEED);
  }
};

const autoMovePlayer = () => {
  if (player.value && container.value) {
    const containerRect = container.value.getBoundingClientRect();
    const containerRectWidth = containerRect.width + PLAYER_SIZE - 1;
    const containerRectHeight = containerRect.height + PLAYER_SIZE - 1;

    if (numberCurrentEnnemies < NUMBER_OF_ENNEMIES) {
      createEnnemies(containerRect);
    }

    playerTable = automaticMovePlayer(
      player.value.offsetLeft,
      player.value.offsetTop,
      containerRectWidth,
      containerRectHeight,
      START_LINE,
      direction,
      isInversed
    );
    direction = playerTable.direction;
    player.value.style.left = `${playerTable.x}px`;
    player.value.style.top = `${playerTable.y}px`;
  }
};

const manualMovePlayer = (detail: GestureDetail) => {
  if (manualIntervalId == undefined) {
    manualIntervalId = setInterval(function() {
      if (player.value && container.value) {
        const containerRect = container.value.getBoundingClientRect();
        //const playerRect = player.value.getBoundingClientRect();
        const containerRectWidth = containerRect.width + PLAYER_SIZE;
        const containerRectHeight = containerRect.height + PLAYER_SIZE;
        playerTable = onGesture(detail, player.value.offsetLeft, player.value.offsetTop, direction);

        isInversed = isUserChangingDirection(playerTable, containerRectWidth, containerRectHeight, direction, START_LINE) ? true : false;
        direction = playerTable.direction;
        if (isAlreadyOnDirection(playerTable, containerRectWidth, containerRectHeight, direction, START_LINE)) {
          return goBackAuto();
        }
        clearInterval(autoIntervalId);
        autoIntervalId = undefined;
        player.value.style.left = `${playerTable.x}px`;
        player.value.style.top = `${playerTable.y}px`;

        if (isGoingBackOnBorder(playerTable.x, playerTable.y, containerRectWidth, containerRectHeight, START_LINE)) {
          return goBackAuto();
        }

        drawTerritories(playerTable.x, playerTable.y, containerRect);

        for (const key of Object.keys(ennemiesTable)) {
          const ennemy = ennemiesTable[key];
          if (
            (playerTable.x <= (ennemy.x + PLAYER_SIZE - 2) && playerTable.x >= (ennemy.x - PLAYER_SIZE + 2)) &&
            (playerTable.y <= (ennemy.y + PLAYER_SIZE - 2) && playerTable.y >= (ennemy.y - PLAYER_SIZE + 2))
          ) {
            return gameOver();
          }
        }
      } else {
        return goBackAuto();
      }
    }, GAME_SPEED);
  }
};

</script>
