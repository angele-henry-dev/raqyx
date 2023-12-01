<template>
  <ion-page>
    <ion-content>
      <ion-grid>
        <ion-row class="ion-justify-content-between">
          <ion-col size="5" class="ion-text-start">
            650798
          </ion-col>
          <ion-col size="5" class="ion-text-end">
            {{ calculateTerritoryCaptured() }}% / 75%
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
            Number of ennemies: {{ numberCurrentEnnemies }}
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
import { Player, onGesture, automaticMovePlayer, isAlreadyOnDirection, isGoingBackOnBorder } from '@/scripts/player';
import { randomIntFromInterval } from '@/scripts/utils'
import { Ennemy, collideBorder } from '@/scripts/ennemy'
import { Territory } from '@/scripts/territory'

const GAME_SPEED = 10;
const NUMBER_OF_ENNEMIES = 1;
const PLAYERS_SIZE = 6;
const CONTAINER_WIDTH = 301;
const CONTAINER_HEIGHT = 493;
const player = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const numberCurrentEnnemies = ref<number>(0);
let autoIntervalId: number | undefined = undefined;
let manualIntervalId: number | undefined = undefined;
let playerTable: Player = {
  x: 0,
  y: 0,
  direction: 0
};
const freeTerritory = ref<Territory> ({
  left: 0,
  top: 0,
  width: CONTAINER_WIDTH,
  height: CONTAINER_HEIGHT
});
const ennemiesTable: Record<string, Ennemy>  = {};

onMounted(() => {
  if (container.value) {
    createGameTable();
    if (autoIntervalId == undefined) {
      autoIntervalId = setInterval(autoMovePlayer, GAME_SPEED);
    }
    const gesture = createGesture({
      el: container.value,
      gestureName: 'move-player',
      onEnd: (detail) => { manualMovePlayer(detail); }
    });
    gesture.enable();
  }
});

const calculateTerritoryCaptured = () => {
  const ag = CONTAINER_WIDTH * CONTAINER_HEIGHT;
  const af = freeTerritory.value.width * freeTerritory.value.height;
  const remainedArea = ag - af;
  return remainedArea * 100 / ag;
};

const createGameTable = () => {
  const containerDiv = document.getElementById("container");
  if (containerDiv) {
    containerDiv.style.width = `${CONTAINER_WIDTH}px`;
    containerDiv.style.height = `${CONTAINER_HEIGHT}px`;

    const freeTerritoryDiv = document.createElement("div");
    freeTerritoryDiv.setAttribute("id", "freeTerritory");
    freeTerritoryDiv.setAttribute("class", "freeTerritory");
    freeTerritoryDiv.style.left = `${freeTerritory.value.left}px`;
    freeTerritoryDiv.style.top = `${freeTerritory.value.top}px`;
    freeTerritoryDiv.style.width = `${freeTerritory.value.width}px`;
    freeTerritoryDiv.style.height = `${freeTerritory.value.height}px`;
    containerDiv?.appendChild(freeTerritoryDiv);
  }
};

const gameOver = () => {
  clearInterval(manualIntervalId);
  clearInterval(autoIntervalId);
  for (const key of Object.keys(ennemiesTable)) {
    clearInterval(ennemiesTable[key].intervalId);
  }
  console.log("Game over");
};

/* Ennemies scripts */

const createEnnemies = () => {
  if (freeTerritory.value) {
    const numberCurrentDivEnnemies = numberCurrentEnnemies.value = document.querySelectorAll('[id^="ennemy"]').length;

    for (let i=0; i<(NUMBER_OF_ENNEMIES-numberCurrentDivEnnemies); i++) {
      const ennemy = document.createElement("div");
      ennemy.setAttribute("id", `ennemy${i}`);
      ennemy.setAttribute("class", `ennemy`);

      const left = randomIntFromInterval(10, freeTerritory.value.width-10)
      const top = randomIntFromInterval(10, freeTerritory.value.height-10)
      ennemy.style.left = `${left}px`;
      ennemy.style.top = `${top}px`;

      document.getElementById("freeTerritory")?.appendChild(ennemy);
      numberCurrentEnnemies.value += 1;

      const ennemyIntervalId = setInterval(moveEnnemy, GAME_SPEED, ennemy, `ennemy${i}`);

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

const moveEnnemy = (ennemyDiv: HTMLElement, ennemyId: string) => {
  if (ennemyDiv && freeTerritory.value) {
    ennemiesTable[ennemyId].x = ennemiesTable[ennemyId].x + ennemiesTable[ennemyId].speedX;
    ennemiesTable[ennemyId].y = ennemiesTable[ennemyId].y + ennemiesTable[ennemyId].speedY;
    ennemyDiv.style.left = `${ennemiesTable[ennemyId].x}px`;
    ennemyDiv.style.top = `${ennemiesTable[ennemyId].y}px`;

    const newOffset = collideBorder(
      ennemiesTable[ennemyId].x,
      ennemiesTable[ennemyId].y,
      freeTerritory.value.width,
      freeTerritory.value.height,
      PLAYERS_SIZE
    )
    ennemiesTable[ennemyId].speedX *= newOffset[0];
    ennemiesTable[ennemyId].speedY *= newOffset[1];
  }
};

/* Territory scripts */

const drawTerritories = (left: number, top: number) => {
  if (freeTerritory.value) {
    let width = 0;
    let height = 0;
    if (playerTable.direction === 0) { // 0=right, 1=left, 2=down, 3=up
      width = left - PLAYERS_SIZE;
      left = PLAYERS_SIZE;
    } else if (playerTable.direction === 1) {
      left = left + PLAYERS_SIZE;
      width = (freeTerritory.value.width - left) + PLAYERS_SIZE;
    } else if (playerTable.direction === 2) {
      height = top - PLAYERS_SIZE;
      top = PLAYERS_SIZE + 1;
    } else {
      top = top + PLAYERS_SIZE;
      height = (freeTerritory.value.height - top) + PLAYERS_SIZE;
    }

    let newTerritory = document.getElementById("territory");
    if (newTerritory == null) {
      newTerritory = document.createElement("div");
      newTerritory.setAttribute("id", `territory`);
      newTerritory.style.border = "1px solid green";
      newTerritory.style.backgroundColor = "yellow";
      newTerritory.style.position = "absolute";
    }
    newTerritory.style.left = `${left}px`;
    newTerritory.style.top = `${top}px`;
    newTerritory.style.width = `${width}px`;
    newTerritory.style.height = `${height}px`;
    document.getElementById("freeTerritory")?.appendChild(newTerritory);
  }
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
  if (player.value && freeTerritory.value) {
    if (numberCurrentEnnemies.value < NUMBER_OF_ENNEMIES) {
      createEnnemies();
    }

    playerTable = automaticMovePlayer(
      playerTable.x,
      playerTable.y,
      freeTerritory.value.width + PLAYERS_SIZE,
      freeTerritory.value.height + PLAYERS_SIZE,
      playerTable.direction,
    );
    player.value.style.left = `${playerTable.x}px`;
    player.value.style.top = `${playerTable.y}px`;
  }
};

const manualMovePlayer = (detail: GestureDetail) => {
  if (manualIntervalId == undefined) {
    manualIntervalId = setInterval(function() {
      if (player.value && freeTerritory.value) {
        const containerRectWidth = freeTerritory.value.width + PLAYERS_SIZE;
        const containerRectHeight = freeTerritory.value.height + PLAYERS_SIZE;
        playerTable = onGesture(detail, playerTable);

        if (isAlreadyOnDirection(playerTable, containerRectWidth, containerRectHeight)) {
          return goBackAuto();
        }
        clearInterval(autoIntervalId);
        autoIntervalId = undefined;

        if (isGoingBackOnBorder(playerTable.x, playerTable.y, containerRectWidth, containerRectHeight)) {
          return goBackAuto();
        }
        player.value.style.left = `${playerTable.x}px`;
        player.value.style.top = `${playerTable.y}px`;

        drawTerritories(playerTable.x, playerTable.y);

        for (const key of Object.keys(ennemiesTable)) {
          const ennemy = ennemiesTable[key];
          if (
            (playerTable.x <= (ennemy.x + PLAYERS_SIZE - 2) && playerTable.x >= (ennemy.x - PLAYERS_SIZE + 2)) &&
            (playerTable.y <= (ennemy.y + PLAYERS_SIZE - 2) && playerTable.y >= (ennemy.y - PLAYERS_SIZE + 2))
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
