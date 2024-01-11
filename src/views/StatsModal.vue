<template>
    <ion-modal ref="modalStats" trigger="open-modal-stats">
        <ion-toolbar>
          <ion-title>Stats</ion-title>
          <ion-buttons slot="end">
            <ion-button color="light" @click="dismiss()">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-content class="ion-padding">
          Plop
        </ion-content>
    </ion-modal>
</template>

<script lang="ts" setup>
  import {
    IonButtons,
    IonButton,
    IonModal,
    IonToolbar,
    IonTitle,
    IonContent,
  } from '@ionic/vue';
  import { ref } from 'vue';

  const modalStats = ref();

  const dismiss = () => modalStats.value.$el.dismiss();
</script>
