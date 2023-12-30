<template>
  <ion-page>
    <ion-content>
      <ion-grid class="game-content">
        <ion-row class="ion-justify-content-between">
          <ion-col size="5" class="ion-text-start">
            Score: 650798
          </ion-col>
          <ion-col size="5" class="ion-text-end">
            <!-- {{ calculateTerritoryCaptured() }} -->% / 75%
          </ion-col>
        </ion-row>
        <ion-row class="game-area">
          <canvas id="gameCanvas" :width="CONTAINER_WIDTH" :height="CONTAINER_HEIGHT"></canvas>
        </ion-row>
        <ion-row class="ion-justify-content-between">
          <ion-col size="5" class="ion-text-start">
            Level 1
          </ion-col>
          <ion-col size="5" class="ion-text-end">
            Ennemies: <!-- {{ numberCurrentEnnemies }} -->
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
  <!-- <ion-button @click="clearCanvas()">Clear</ion-button> -->
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { GameManager, CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@/scripts/gameManager'
  // import { Graph } from '@/scripts/math/graph'
  // import { Node } from '@/scripts/math/node'
  // import { Link } from '@/scripts/math/link'

  let gameManager = null;

  onMounted(() => {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    gameManager = new GameManager(canvas);
    gameManager.draw();
  });
</script>
