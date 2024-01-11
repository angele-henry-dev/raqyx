<template>
  <ion-page class="home">
    <ion-content>
      <div class="shooting-stars">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ion-grid>
        <ion-row class="row-title">
          <ion-img
              class="title"
              src="/assets/images/raqyx_title_green.png"
              alt="Game title"
          ></ion-img>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-col size="6" class="menu">
            <div>
              <ion-button class="broken" expand="block" fill="clear" size="large" @click="newGame()">New game</ion-button>
              <ion-button class="deactivated" expand="block" fill="clear" size="large" @click="loadGame()">Continue</ion-button>
              <ion-button expand="block" fill="clear" id="open-modal-rules">Rules</ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer>
      <ion-row class="ion-justify-content-between">
        <ion-col size="3">
          <ion-button fill="clear" id="open-modal-settings">Settings</ion-button>
        </ion-col>
        <ion-col size="3" class="ion-text-end">
          <ion-button fill="clear" id="open-modal-stats">Stats</ion-button>
        </ion-col>
      </ion-row>
    </ion-footer>
    <RulesModal />
    <SettingsModal />
    <StatsModal />
  </ion-page>
</template>

<script setup lang="ts">
  import { useIonRouter, IonPage, IonContent, IonButton, IonFooter, IonGrid, IonRow, IonCol, IonImg } from '@ionic/vue';
  import RulesModal from './RulesModal.vue';
  import SettingsModal from './SettingsModal.vue';
  import StatsModal from './StatsModal.vue';

  const ionRouter = useIonRouter();

  const newGame = () => {
    ionRouter.push('/newgame');
  };
  const loadGame = () => {
    return false;
  };
</script>
