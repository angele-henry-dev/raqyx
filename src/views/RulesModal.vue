<template>
    <ion-modal ref="modalRules" trigger="open-modal-rules">
        <ion-toolbar>
          <ion-title>Rules</ion-title>
          <ion-buttons slot="end">
            <ion-button color="dark" @click="dismiss()">Close</ion-button>
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

  const modalRules = ref();

  const dismiss = () => modalRules.value.$el.dismiss();
</script>
