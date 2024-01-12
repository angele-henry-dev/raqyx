<template>
    <ion-header class="settings-icon">
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
              alt="Rules"
            ></ion-img>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-header>
    <ion-content class="homepage">
      <div class="shooting-stars">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ion-row>
        <ion-img
            src="/assets/images/raqyx_title_green.png"
            alt="Game title"
        ></ion-img>
      </ion-row>
    </ion-content>
    <RulesModal />
    <SettingsModal />
    <StatsModal />
</template>

<script setup lang="ts">
  import { IonContent, IonButton, IonHeader, IonRow, IonCol, IonImg } from '@ionic/vue';
  import RulesModal from '@/views/RulesModal.vue';
  import SettingsModal from '@/views/SettingsModal.vue';
  import StatsModal from '@/views/StatsModal.vue';
</script>
