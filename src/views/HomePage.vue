<template>
  <div class="shooting-stars">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
    <ion-content class="homepage">
      <ion-row>
        <ion-img
            src="/assets/images/raqyx_title.webp"
            alt="Game title"
        ></ion-img>
      </ion-row>
      <ion-row class="events ion-text-center">
        <ion-col>
          No events today
        </ion-col>
      </ion-row>
    </ion-content>
</template>

<script setup lang="ts">
  import { IonContent, IonRow, IonCol, IonImg } from '@ionic/vue';
</script>
