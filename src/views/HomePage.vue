<template>
  <ion-page>
    <ion-content>
      <div class="shooting-stars">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ion-grid>
        <ion-row class="row-title">
          <ion-img
              class="title"
              src="/assets/images/raqyx_title_green.png"
              alt="Homepage image of the game"
          ></ion-img>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-col size="6" class="menu">
            <div>
              <ion-button expand="block" fill="clear" size="large" router-link="/newgame">New game</ion-button>
              <ion-button expand="block" fill="clear" size="large" router-link="/continuegame">Continue</ion-button>
              <ion-button expand="block" fill="clear" @click="displayRules()">Rules</ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer>
      <ion-row class="ion-justify-content-between">
        <ion-col size="3">
          <ion-button fill="clear" @click="displaySettings()">Settings</ion-button>
        </ion-col>
        <ion-col size="3" class="ion-text-end">
          <ion-button fill="clear" @click="displayStats()">Stats</ion-button>
        </ion-col>
      </ion-row>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { IonPage, IonContent, IonButton, IonFooter, IonGrid, IonRow, IonCol, IonText, IonImg } from '@ionic/vue';

//   const stars: {
//     speedX: number,
//     speedY: number,
//     x: number,
//     y: number,
//     color: string,
//     size: number
//   }[] = [
//     { speedX: 1, speedY: 1, x: 20, y: 20, color: "red", size: 3 },
//     { speedX: 1, speedY: 1, x: 130, y: 222, color: "red", size: 3 },
//     { speedX: 1, speedY: 1, x: 66, y: 340, color: "red", size: 3 },
//   ];

//   onMounted(() => {
//     const canvas = document.querySelector("canvas");
//     if (!canvas) {
//       console.error('Canvas element not found');
//       return;
//     }
//     const width = window.innerWidth;
//     const height = window.innerHeight;

//     const DPR = window.devicePixelRatio || 1;
//     canvas.width = width * DPR;
//     canvas.height = height * DPR;
//     canvas.style.width = `${width}px`;
//     canvas.style.height = `${height}px`;
//     // canvas.style.position = "absolute";

//     const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true }) || null;
//     if (!ctx) {
//       console.error('Canvas context not available');
//       return;
//     }
//     ctx.scale(DPR, DPR);
//     ctx.lineWidth = 2;

//     animateHomepage(ctx, width, height);
//   });

//   const animateHomepage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
//     ctx.clearRect(0, 0, width, height);
//     ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
//     ctx.fillRect(0, 0, width, height);

//     for (const star of stars) {
//       ctx.beginPath();
//       ctx.fillStyle = star.color;
//       ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
//       ctx.fill();
//       moveStarts(star);
//     }

//     requestAnimationFrame(() => {
//         animateHomepage(ctx, width, height);
//     });
//   };
//   const moveStarts = (star: {
//     speedX: number;
//     speedY: number;
//     x: number;
//     y: number;
//     color: string;
//     size: number;
// }) => {
//     const left = star.x;
//     const top = star.y;

//     if (left <= star.size) {
//       star.speedX *= -1;
//     }
//     else if (left >= window.innerWidth - star.size) {
//       star.speedX *= -1;
//     }
//     if (top <= star.size) {
//       star.speedY *= -1;
//     }
//     else if (top >= window.innerHeight - star.size) {
//       star.speedY *= -1;
//     }

//     star.x = left + star.speedX;
//     star.y = top + star.speedY;
//   };

  const displayRules = () => {
    alert("Rules");
  };

  const displaySettings = () => {
    alert("Settings");
  };

  const displayStats = () => {
    alert("Stats");
  };
</script>
