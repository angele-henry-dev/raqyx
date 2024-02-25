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
  import { ref, onMounted } from 'vue';
  import { Preferences } from '@capacitor/preferences';

  const modalSettings = ref();
  const musicVolume = ref(100);
  const sfxVolume = ref(100);
  const pinFormatter = (value: number) => `${value}%`;

  onMounted(async () => {
    musicVolume.value = Number((await Preferences.get({ key: 'music' })).value);
    sfxVolume.value = Number((await Preferences.get({ key: 'sfx' })).value);
  });

  const dismiss = () => modalSettings.value.$el.dismiss();
  const save = async () => {
    await Preferences.set({
      key: 'music',
      value: musicVolume.value.toString(),
    });
    await Preferences.set({
      key: 'sfx',
      value: sfxVolume.value.toString(),
    });
    dismiss();
  };
</script>
