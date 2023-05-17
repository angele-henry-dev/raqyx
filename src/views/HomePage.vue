<template>
  <ion-page>
    <ion-content>
      <ion-button router-link="/newgame">New game</ion-button>
      <ion-button router-link="/continuegame">Continue</ion-button>
      <ion-img
          src="/assets/images/wp5289804.jpg"
          alt="Homepage image of the game"
      ></ion-img>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { IonImg, IonButton } from '@ionic/vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: { IonImg, IonButton },
  });
</script>
