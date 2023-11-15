<template>
  <ion-page>
    <ion-content>
      <ion-button router-link="/newgame">New game</ion-button>
      <ion-button router-link="/continuegame">Continue</ion-button>
      <!-- <ion-img
          src="/assets/images/titlescreen.jpg"
          alt="Homepage image of the game"
      ></ion-img> -->
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { IonPage, IonContent, IonButton } from '@ionic/vue';
</script>
