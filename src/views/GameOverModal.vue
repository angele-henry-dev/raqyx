<template>
    <div id="gameover">
        <ion-toolbar>
            <ion-title>Game Over</ion-title>
        </ion-toolbar>
        <ion-content class="ion-padding">
            <ion-row class="ion-align-items-center">
            <ion-col class="ion-text-center">
                <ion-button color="light" fill="outline" @click="goHome()">Go home</ion-button>
            </ion-col>
            <ion-col class="ion-text-center">
                <ion-button color="light" fill="outline" @click="relaunch()">Try again</ion-button>
            </ion-col>
            </ion-row>
        </ion-content>
    </div>
</template>

<script setup lang="ts">
  import {
    IonModal,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonCol,
    IonButton,
    modalController,
  } from '@ionic/vue';

  const goHome = () => modalController.dismiss(null, 'goHome');
  const relaunch = () => modalController.dismiss(null, 'relaunch');
</script>
