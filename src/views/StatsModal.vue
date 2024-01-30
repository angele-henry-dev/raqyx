<template>
    <ion-modal class="stats" ref="modalStats" trigger="open-modal-stats">
      <div>
        <ion-toolbar>
          <ion-title>Stats</ion-title>
          <ion-buttons slot="end">
            <ion-button color="light" @click="dismiss()">X</ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-content class="ion-padding">
            <ion-item-group>
            <ion-item-divider>
                <ion-label class="title-text">Friends</ion-label>
            </ion-item-divider>
            <ion-item v-for="(friend, index) in friends" :key="index" lines="none">
                <ion-row class="ion-justify-content-between">
                <ion-col class="ion-text-start">{{ friend.placement }}</ion-col>
                <ion-col class="ion-text-start">{{ friend.username }}</ion-col>
                <ion-col class="ion-text-end">{{ friend.score }}</ion-col>
                </ion-row>
            </ion-item>
            </ion-item-group>

            <ion-item-group>
            <ion-item-divider>
                <ion-label class="title-text">World</ion-label>
            </ion-item-divider>
            <ion-item v-for="(people, index) in world" :key="index" lines="none">
                <ion-row class="ion-justify-content-between">
                <ion-col class="ion-text-start">{{ people.placement }}</ion-col>
                <ion-col class="ion-text-start">{{ people.username }}</ion-col>
                <ion-col class="ion-text-end">{{ people.score }}</ion-col>
                </ion-row>
            </ion-item>
            </ion-item-group>
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
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonItem,
    IonRow,
    IonCol,
  } from '@ionic/vue';
  import { ref } from 'vue';

  const modalStats = ref();
  const dismiss = () => modalStats.value.$el.dismiss();

  const friends = [
    {
      username: "Aziza",
      score: 42788,
      placement: 1,
    },
    {
      username: "Romain",
      score: 6524,
      placement: 2,
    },
    {
      username: "Andrea",
      score: 1245,
      placement: 3,
    },
    {
      username: "You",
      score: 0,
      placement: 17357,
    },
  ];
  const world = [
    {
      username: "Paul",
      score: 5325554,
      placement: 1,
    },
    {
      username: "Nirine",
      score: 5315438,
      placement: 2,
    },
    {
      username: "Thang",
      score: 5315412,
      placement: 3,
    },
    {
      username: "You",
      score: 0,
      placement: 10,
    },
  ];
</script>
