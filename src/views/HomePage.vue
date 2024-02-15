<template>
    <ion-header class="events">
      <ion-row class="ion-text-center">
        <ion-col>
          Here the events
        </ion-col>
      </ion-row>
    </ion-header>
    <ion-content class="homepage">
      <div class="shooting-stars">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ion-row>
        <ion-img
            src="/assets/images/raqyx_title_green.png"
            alt="Game title"
        ></ion-img>
      </ion-row>
    </ion-content>
    <RulesModal />
</template>

<script setup lang="ts">
  import { IonContent, IonHeader, IonRow, IonCol, IonImg } from '@ionic/vue';
  import RulesModal from '@/views/RulesModal.vue';
</script>
