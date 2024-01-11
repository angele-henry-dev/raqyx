<template>
    <ion-modal class="rules" ref="modalRules" trigger="open-modal-rules">
      <div class="modal-content">
        <ion-toolbar>
          <ion-title>Rules</ion-title>
          <ion-buttons slot="end">
            <ion-button color="light" @click="dismiss()">X</ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-content class="ion-padding">
          <ion-list lines="none">
            <ion-item>
              <p>Objective of the Game:
              <br>Cover as much space as possible by creating territories with your character.</p>
            </ion-item>
            <ion-item>
              <p>Controls:
              <br>Use gestures to move your character.
              <br>Swipe right, left, up, or down to move your character in the desired direction.</p>
            </ion-item>
            <ion-item>
              <p>Territory Creation:
              <br>Move your character into the game area to create a territory by drawing a line.
              <br>Go back to the border to complete the territory.</p>
            </ion-item>
            <ion-item>
              <p>Victory:
              <br>Win by covering more than 75% of the total space.</p>
            </ion-item>
            <ion-item>
              <p>Defeat:
              <br>Lose if your character collides with an enemy.</p>
            </ion-item>
            <ion-item>
              <p>Levels:
              <br>Advance to higher levels by achieving percentage goals.</p>
            </ion-item>
          </ion-list>
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
    IonList,
    IonItem,
  } from '@ionic/vue';
  import { ref } from 'vue';

  const modalRules = ref();
  const dismiss = () => modalRules.value.$el.dismiss();
</script>
