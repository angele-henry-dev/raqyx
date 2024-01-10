<template>
  <ion-page>
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
              alt="Homepage image of the game"
          ></ion-img>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-col size="6" class="menu">
            <div>
              <ion-button expand="block" fill="clear" size="large" router-link="/newgame">New game</ion-button>
              <ion-button expand="block" fill="clear" size="large" router-link="/continuegame">Continue</ion-button>
              <ion-button expand="block" fill="clear" @click="displayRules()">Rules</ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer>
      <ion-row class="ion-justify-content-between">
        <ion-col size="3">
          <ion-button fill="clear" @click="displaySettings()">Settings</ion-button>
        </ion-col>
        <ion-col size="3" class="ion-text-end">
          <ion-button fill="clear" @click="displayStats()">Stats</ion-button>
        </ion-col>
      </ion-row>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
  import { IonPage, IonContent, IonButton, IonFooter, IonGrid, IonRow, IonCol, IonText, IonImg } from '@ionic/vue';

  const displayRules = () => {
    alert("Rules");
  };
  const displaySettings = () => {
    alert("Settings");
  };
  const displayStats = () => {
    alert("Stats");
  };
</script>
