<template>
  <ion-page class="gamepage">
    <ion-header>
      <ion-toolbar>
        <ion-row class="ion-justify-content-between">
          <ion-col class="ion-text-start">
            <ion-text>Level {{ gameManager?.gameSettings.level || 0 }}</ion-text>
          </ion-col>
          <ion-col class="ion-text-end">
            <ion-text>{{ gameManager?.gameSettings.percentage || 0 }}% / 75%</ion-text>
          </ion-col>
        </ion-row>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding background">
      <ion-row class="ion-justify-content-center">
        <canvas id="gameCanvas" :width="CONTAINER_WIDTH" :height="CONTAINER_HEIGHT"></canvas>
      </ion-row>
    </ion-content>
    <ion-footer>
      <ion-row class="ion-justify-content-center">
        <ion-text>Score: {{ gameManager?.gameSettings.score || 0 }}</ion-text>
      </ion-row>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue';
  import {
    IonPage, IonHeader, IonFooter, IonToolbar, IonContent, IonRow, IonCol, IonText, createGesture, GestureDetail
  } from '@ionic/vue';
  import { GameManager, CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@/scripts/gameManager'

  const DPR = window.devicePixelRatio || 1;
  let ctx: CanvasRenderingContext2D | null = null;
  let canvas: HTMLCanvasElement | null = null;
  const gameManager = reactive(new GameManager(1, 1));

  onMounted(() => {
    canvas = document.getElementById("gameCanvas") as HTMLCanvasElement | null;

    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    canvas.width = CONTAINER_WIDTH * DPR;
    canvas.height = CONTAINER_HEIGHT * DPR;
    canvas.style.width = `${CONTAINER_WIDTH}px`;
    canvas.style.height = `${CONTAINER_HEIGHT}px`;
    
    ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true }) || null;

    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    ctx.scale(DPR, DPR);
    ctx.lineWidth = 1;
    ctx.shadowBlur = 10;
    animate();
    setupGesture();
  });

  const setupGesture = () => {
    if (canvas) {
      createGesture({
        el: canvas,
        gestureName: 'move-player',
        disableScroll: true,
        direction: undefined,
        onEnd: onGesture
      }).enable();
    }
  };

  const onGesture = (detail: GestureDetail) => {
    gameManager.onManualMove(detail);
  };

  const animate = () => {
    if (ctx && gameManager.player) {
      ctx.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
      gameManager.draw(ctx);
      requestAnimationFrame(animate);
    }
  }
</script>
