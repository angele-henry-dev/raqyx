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
            <div ref="container" id="container" class="container">
              <div ref="player" class="player"></div>
              <canvas ref="canvas" id="freeTerritory" class="freeTerritory" width="301" height="493"></canvas>
            </div>
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
import { Player, onGesture, automaticMovePlayer, isGoingBackOnBorder } from '@/scripts/player';
import { randomIntFromInterval } from '@/scripts/utils'
import { Ennemy, collideBorder, collidePlayer, collideTerritories } from '@/scripts/ennemy'
import { Territory, TerritoryTemp } from '@/scripts/territory'

const GAME_SPEED = 10;
const NUMBER_OF_ENNEMIES = 1;
const PLAYERS_SIZE = 6;
const CONTAINER_WIDTH = 301;
const CONTAINER_HEIGHT = 493;
const TERRITORIES_COLORS = ["blue", "green", "orange", "red", "pink", "purple"];

const player = ref<HTMLElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

const numberCurrentEnnemies = ref<number>(0);
let autoIntervalId: number | undefined = undefined;
let manualIntervalId: number | undefined = undefined;
let playerTable: Player = {
  x: 0,
  y: 0,
  direction: 0,
  startX: 0,
  startY: 0
};
const freeTerritory = ref<Territory> ({
  left: 0,
  top: 0,
  width: CONTAINER_WIDTH,
  height: CONTAINER_HEIGHT
});
const ennemiesTable: Record<string, Ennemy>  = {};

onMounted(() => {
  setupContainer();
  if (autoIntervalId == undefined) {
    autoIntervalId = setInterval(autoMovePlayer, GAME_SPEED);
  }
  setupGesture();
});

const calculateTerritoryCaptured = () => {
  const ag = CONTAINER_WIDTH * CONTAINER_HEIGHT;
  const af = freeTerritory.value.width * freeTerritory.value.height;
  const remainedArea = ag - af;
  return remainedArea * 100 / ag;
};

const setupGesture = () => {
  const containerDiv = document.getElementById("container");
  if (containerDiv) {
    const gesture = createGesture({
      el: containerDiv,
      gestureName: 'move-player',
      disableScroll: true,
      canStart: manualMoveCanStart,
      onEnd: manualMovePlayer
    });
    gesture.enable();
  }
};

const setupContainer = () => {
  const containerDiv = document.getElementById("container");
  if (containerDiv) {
    containerDiv.style.width = `${CONTAINER_WIDTH}px`;
    containerDiv.style.height = `${CONTAINER_HEIGHT}px`;
  }
  ctx.value = setupCanvas();
};

const setupCanvas = () => {
  const canvas = document.getElementById("freeTerritory") as HTMLCanvasElement;
  const dpr = window.devicePixelRatio || 1;
  if (canvas) {
    canvas.width = CONTAINER_WIDTH * dpr;
    canvas.height = CONTAINER_HEIGHT * dpr;
    canvas.style.width = `${CONTAINER_WIDTH}px`;
    canvas.style.height = `${CONTAINER_HEIGHT}px`;

    const ctxTemp = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
    if (ctxTemp) {
      ctxTemp.scale(dpr, dpr);
      ctxTemp.lineWidth = 1;
      return ctxTemp;
    }
  }
  return null;
};

const gameOver = () => {
  clearInterval(manualIntervalId);
  clearInterval(autoIntervalId);
  for (const key of Object.keys(ennemiesTable)) {
    clearInterval(ennemiesTable[key].intervalId);
  }
  // if (ctx.value) {
  //   ctx.value.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
  // }
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

      document.getElementById("container")?.appendChild(ennemy);
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

const startTerritory = () => {
  if (ctx.value) {
    const newTerritory = new Path2D();
    newTerritory.moveTo(playerTable.x, playerTable.y - (PLAYERS_SIZE / 2));
    const randomColorIndex = randomIntFromInterval(0, TERRITORIES_COLORS.length);
    ctx.value.strokeStyle = TERRITORIES_COLORS[randomColorIndex];
    ctx.value.fillStyle = TERRITORIES_COLORS[randomColorIndex];
    return newTerritory;
  }
  return null;
};
const drawTerritory = (newTerritory: Path2D, territoryPoints: TerritoryTemp[]) => {
  if (ctx.value) {
    const x = playerTable.x - (PLAYERS_SIZE / 2);
    const y = playerTable.y - (PLAYERS_SIZE / 2);
    if (territoryPoints.length == 0 || territoryPoints[territoryPoints.length - 1].direction != playerTable.direction) {
      territoryPoints.push({
        left: x,
        top: y,
        direction: playerTable.direction
      });
    }
    newTerritory.lineTo(x, y);
    ctx.value.stroke(newTerritory);
  }
  return territoryPoints;
};
const endTerritory = (newTerritory: Path2D, territoryPoints: TerritoryTemp[]) => {
  if (ctx.value) {
    const x = playerTable.x - (PLAYERS_SIZE / 2);
    const y = playerTable.y - (PLAYERS_SIZE / 2);
    // TODO Manually complete the new territory to fill it correctly
    newTerritory.closePath();
    ctx.value.fill(newTerritory);
    territoryPoints.push({
      left: x,
      top: y,
      direction: playerTable.direction
    });
  }
  return territoryPoints;
};

/* Player scripts */

const manualMoveCanStart = (detail: GestureDetail) => {
  return true;
};

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
      playerTable,
      freeTerritory.value.width + PLAYERS_SIZE,
      freeTerritory.value.height + PLAYERS_SIZE,
    );
    player.value.style.left = `${playerTable.x}px`;
    player.value.style.top = `${playerTable.y}px`;
  }
};

const manualMovePlayer = (detail: GestureDetail) => {
  if (manualIntervalId == undefined && ctx.value) {
    const newTerritory = startTerritory();
    let territoryPoints: TerritoryTemp[] = [];

    manualIntervalId = setInterval(function() {
      if (player.value && freeTerritory.value && ctx.value) {
        playerTable = onGesture(detail, playerTable);

        clearInterval(autoIntervalId);
        autoIntervalId = undefined;

        if (isGoingBackOnBorder(
          playerTable.x, playerTable.y,
          (freeTerritory.value.width + PLAYERS_SIZE),
          (freeTerritory.value.height + PLAYERS_SIZE)
        ) && newTerritory) {
          territoryPoints = endTerritory(newTerritory, territoryPoints);
          console.log(territoryPoints);
          return goBackAuto();
        }
        player.value.style.left = `${playerTable.x}px`;
        player.value.style.top = `${playerTable.y}px`;

        if (newTerritory) {
          territoryPoints = drawTerritory(newTerritory, territoryPoints);
        }

        for (const key of Object.keys(ennemiesTable)) {
          const ennemy = ennemiesTable[key];
          if (collidePlayer(ennemy, playerTable, PLAYERS_SIZE) || collideTerritories(territoryPoints, ennemy)) {
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
