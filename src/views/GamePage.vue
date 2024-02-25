<template>
    <ion-header class="game-header">
      <audio id="music1" src="/assets/music/theme 1.wav" :loop="true">
      </audio>
      <ion-row class="ion-align-items-center">
        <ion-col size="3">
          <ion-text class="title-icon">{{ gameManager?.gameSettings.level || 0 }}</ion-text>
        </ion-col>
        <ion-col>
          <div class="progress-bar-track">
              <div class="progress-bar-progress" :style="'width: ' + (gameManager?.gameSettings.percentage * 100 / 75) + '%;'"></div>
          </div>
        </ion-col>
      </ion-row>
      <ion-row class="ion-justify-content-center">
        <ion-text class="title-text">Score {{ gameManager?.gameSettings.score || 0 }}</ion-text>
      </ion-row>
    </ion-header>
    <ion-content class="ion-padding background">
      <ion-row class="ion-justify-content-center">
        <canvas id="gameCanvas" :width="CONTAINER_WIDTH" :height="CONTAINER_HEIGHT"></canvas>
      </ion-row>
    </ion-content>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive, defineEmits, watch } from 'vue';
  import {
    IonHeader,
    IonContent,
    IonRow,
    IonCol,
    IonText,
    createGesture,
    GestureDetail,
    modalController,
  } from '@ionic/vue';
  import { Preferences } from '@capacitor/preferences';
  import { GameManager, CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@/scripts/gameManager';
  import GameOverModal from '@/views/GameOverModal.vue';
  import NextLevelModal from '@/views/NextLevelModal.vue';

  const DPR = window.devicePixelRatio || 1;
  let ctx: CanvasRenderingContext2D | null = null;
  let canvas: HTMLCanvasElement | null = null;
  const gameManager = reactive(new GameManager(1, 1, 0));
  let animationId: number;
  let musicPlayer: HTMLMediaElement | null = null;
  const musicVolume = ref(100);

  const emit = defineEmits(['goHome']);

  watch(
    () => gameManager?.isGameOver,
    async (isOver) => {
      if (isOver) {
        const modal = await modalController.create({
          component: GameOverModal,
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'goHome') {
          goHome();
        } else if (role === 'relaunch') {
          relaunch();
        }
      }
    }
  );

  watch(
    () => gameManager?.gameSettings?.level,
    async (newLevel) => {
      displayLevel(newLevel);
    }
  );

  onMounted(async () => {
    canvas = document.getElementById("gameCanvas") as HTMLCanvasElement | null;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    canvas.width = CONTAINER_WIDTH * DPR;
    canvas.height = CONTAINER_HEIGHT * DPR;
    canvas.style.width = `${CONTAINER_WIDTH}px`;
    canvas.style.height = `${CONTAINER_HEIGHT}px`;
    
    ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true }) || null;

    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    ctx.scale(DPR, DPR);
    ctx.lineWidth = 1;
    ctx.fillStyle = "yellow";
    ctx.shadowBlur = 10;

    displayLevel(gameManager?.gameSettings?.level);
    animate();
    setupGesture();

    musicVolume.value = Number((await Preferences.get({ key: 'music' })).value);
    musicPlayer = document.getElementById("music1") as HTMLMediaElement;
    play();
  });

  const displayLevel = async (level: number) => {
    const modal = await modalController.create({
      component: NextLevelModal,
      componentProps:{
        level: level
      },
    });
    modal.present();
    setTimeout(() => { modal.dismiss(); }, 1500);
  };

  const goHome = async () => {
    emit("goHome");
  };

  const relaunch = async () => {
    cancelAnimationFrame(animationId);
    gameManager.reset();
    animate();
  };

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
    if (ctx && gameManager.player && !gameManager?.isGameOver) {
      ctx.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
      gameManager.draw(ctx);
      animationId = requestAnimationFrame(animate);
    }
  }

  const play = () => {
      if (musicPlayer) {
        musicPlayer.volume = musicVolume.value / 100;
        musicPlayer.play();
      }
  };
</script>
