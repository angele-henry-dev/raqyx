<template>
    <ion-modal class="settings" ref="modalSettings" trigger="open-modal-settings">
      <div>
        <ion-toolbar>
          <ion-title>Settings</ion-title>
          <ion-buttons slot="end">
            <ion-button color="light" @click="dismiss()">X</ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-content class="ion-padding">
          <ion-col>
            <ion-row class="ion-align-items-center">
              <ion-col size="3">
                <ion-label>Music:</ion-label>
              </ion-col>
              <ion-col>
                <ion-range v-model="musicVolume" aria-label="Music range volume" :pin="true" :pin-formatter="pinFormatter"></ion-range>
              </ion-col>
            </ion-row>
            <ion-row class="ion-align-items-center">
              <ion-col size="3">
                <ion-label>SFX:</ion-label>
              </ion-col>
              <ion-col>
                <ion-range v-model="sfxVolume" aria-label="SFX range volume" :pin="true" :pin-formatter="pinFormatter"></ion-range>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col class="ion-text-end">
                <ion-button class="btn-apply" fill="outline" @click="save()">Save</ion-button>
              </ion-col>
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
  const musicVolume = ref(Number(localStorage.getItem("music")) || 100);
  const sfxVolume = ref(Number(localStorage.getItem("sfx")) || 100);
  const pinFormatter = (value: number) => `${value}%`;

  const dismiss = () => modalSettings.value.$el.dismiss();
  const save = () => {
    localStorage.setItem("music", musicVolume.value.toString());
    localStorage.setItem("sfx", sfxVolume.value.toString());
    dismiss();
  };
</script>
