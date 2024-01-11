<template>
    <ion-modal ref="modalSettings" trigger="open-modal-settings">
      <div class="modal-content">
        <ion-toolbar>
          <ion-title>Settings</ion-title>
          <ion-buttons slot="end">
            <ion-button color="light" @click="dismiss()">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-content class="ion-padding">
          <ion-col>
            <ion-row class="ion-align-items-center">
              <ion-col size="3">
                <ion-label>Music:</ion-label>
              </ion-col>
              <ion-col>
                <ion-range aria-label="Music range volume" :pin="true" :pin-formatter="pinFormatter"></ion-range>
              </ion-col>
            </ion-row>
            <ion-row class="ion-align-items-center">
              <ion-col size="3">
                <ion-label>SFX:</ion-label>
              </ion-col>
              <ion-col>
                <ion-range aria-label="SFX range volume" :pin="true" :pin-formatter="pinFormatter"></ion-range>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-input label="Username:" placeholder="Enter text" counter="true" maxlength="20"></ion-input>
            </ion-row>
          </ion-col>
        </ion-content>
      </div>
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
    IonCol,
    IonRow,
    IonRange,
    IonLabel,
  } from '@ionic/vue';
  import { ref } from 'vue';

  const modalSettings = ref();
  const pinFormatter = (value: number) => `${value}%`;

  const dismiss = () => modalSettings.value.$el.dismiss();
</script>
