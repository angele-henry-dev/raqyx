<template>
    <ion-modal ref="modalSettings" trigger="open-modal-settings">
        <ion-toolbar>
          <ion-title>Settings</ion-title>
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

  const modalSettings = ref();

  const dismiss = () => modalSettings.value.$el.dismiss();
</script>
