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
  import { Graph } from '@/scripts/math/graph'
  // import { Node } from '@/scripts/math/node'
  // import { Link } from '@/scripts/math/link'

  const DPR = window.devicePixelRatio || 1;
  let ctx: CanvasRenderingContext2D | null = null;
  let canvas: HTMLCanvasElement | null = null;
  const graph = new Graph();
  let gameManager: GameManager;

  onMounted(() => {
    canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    canvas.width = CONTAINER_WIDTH * DPR;
    canvas.height = CONTAINER_HEIGHT * DPR;
    canvas.style.width = `${CONTAINER_WIDTH}px`;
    canvas.style.height = `${CONTAINER_HEIGHT}px`;
    
    ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });

    if (ctx) {
      ctx.scale(DPR, DPR);
      ctx.lineWidth = 1;
    }

    gameManager = new GameManager();
    animate();
  });

  const animate = () => {
      if (ctx && gameManager.player) {
        ctx.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
        graph.draw(ctx);
        gameManager.draw(ctx);
        gameManager.player.onAutomaticMove();
        requestAnimationFrame(animate);
      }
  }
</script>
