<template>
  <ion-page class="home">
    <BricksWall />
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
              <ion-button class="menu-btn broken-letter" expand="block" fill="clear" size="large" @click="newGame()">New game</ion-button>
              <ion-button class="menu-btn deactivated" expand="block" fill="clear" size="large" @click="loadGame()">Continue</ion-button>
              <ion-button class="menu-btn" expand="block"  fill="clear" id="open-modal-stats">Stats</ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer class="settings_icon">
      <ion-row>
        <ion-col>
          <ion-button fill="clear" id="open-modal-settings">
            <ion-img
              src="/assets/images/icon-settings.png"
              alt="Settings"
            ></ion-img>
          </ion-button>
        </ion-col>
        <ion-col class="ion-text-end">
          <ion-button fill="clear" id="open-modal-rules">
            <ion-img
              src="/assets/images/icon-rules.png"
              alt="Settings"
            ></ion-img>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-footer>
    <RulesModal />
    <SettingsModal />
    <StatsModal />
  </ion-page>
</template>

<script setup lang="ts">
  import { IonPage, IonContent, IonButton, IonFooter, IonGrid, IonRow, IonCol, IonImg, useIonRouter } from '@ionic/vue';
  import RulesModal from '@/views/RulesModal.vue';
  import SettingsModal from '@/views/SettingsModal.vue';
  import StatsModal from '@/views/StatsModal.vue';
  import BricksWall from '@/views/BricksWall.vue';

  const router = useIonRouter();

  const newGame = () => {
    router.replace('/newgame');
  };
  const loadGame = () => {
    return false;
  };
</script>
