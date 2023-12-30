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
          <canvas id="gameCanvas" width="301" height="493"></canvas>
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
  import { ref, onMounted } from 'vue';
  import { Graph } from '@/scripts/math/graph'
  import { Node } from '@/scripts/math/node'
  import { Link } from '@/scripts/math/link'

  const CONTAINER_WIDTH = 301;
  const CONTAINER_HEIGHT = 493;
  let ctx: CanvasRenderingContext2D | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let graph = new Graph();

  onMounted(() => {
    canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    const dpr = window.devicePixelRatio || 1;
    if (canvas) {
      canvas.width = CONTAINER_WIDTH * dpr;
      canvas.height = CONTAINER_HEIGHT * dpr;
      canvas.style.width = `${CONTAINER_WIDTH}px`;
      canvas.style.height = `${CONTAINER_HEIGHT}px`;

      ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
      if (ctx) {
        ctx.scale(dpr, dpr);
        // const p1 = new Node(100, 100);
        // const p2 = new Node(150, 100);
        // const p3 = new Node(150, 200);
        // const p4 = new Node(10, 35);

        // const s1 = new Link(p1, p2);
        // const s2 = new Link(p1, p3);
        // const s3 = new Link(p1, p4);
        // const s4 = new Link(p2, p3);

        // graph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4]);
        graph = new Graph();
        graph.draw(ctx);
      }
    }
  });

  const animate = () => {
    if (ctx) {
      ctx.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
      graph.draw(ctx);
      requestAnimationFrame(animate);
    }
  }
</script>
