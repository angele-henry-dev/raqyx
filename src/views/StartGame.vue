<template>
  <ion-page>
    <ion-content>
      <ion-grid>
        <ion-row class="ion-justify-content-between">
          <ion-col size="5" class="ion-text-start">
            650798
          </ion-col>
          <ion-col size="5" class="ion-text-end">
            0% / 75%
          </ion-col>
        </ion-row>
        <ion-row id="game-area">
          <div ref="player" id="player"></div>
          <div id="container">
            <div id="ennemies"></div>
          </div>
        </ion-row>
        <ion-row class="ion-justify-content-between">
          <ion-col size="5" class="ion-text-start">
            Level 1
          </ion-col>
          <ion-col size="5" class="ion-text-end">
            o x1
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { 
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    onIonViewWillEnter,
    onIonViewDidEnter,
    onIonViewWillLeave,
    onIonViewDidLeave,
    createAnimation,
  } from '@ionic/vue'

  // Variables
  const animation = createAnimation()
  const player = ref<HTMLDivElement | null>(null)

  // Methods
  function launch() {
    //
  }
  
  // Setup
  onMounted(() => {
    if (player.value) {
      console.log(player.value)
      animation
        .addElement(player.value)
        .duration(1500)
        .iterations(Infinity)
        .fromTo('transform', 'translateX(0px)', 'translateX(100px)')
      animation.play()
    }
  })

  onIonViewDidEnter(() => {
    console.log('Page did enter')
  })

  onIonViewDidLeave(() => {
    console.log('Page did leave')
  })

  onIonViewWillEnter(() => {
    console.log('Page will enter');
  })

  onIonViewWillLeave(() => {
    console.log('Page will leave');
  })
</script>

<style scoped>
  ion-grid {
    width: 90%;
    height: 95%;
    margin: auto;
  }
  #game-area {
    height: 90%;
    max-height: 600px;
  }
  #container {
    width: 100%;
    height: 100%;
    background-color: var(--ion-color-primary);
    margin: 2px;
    padding: 0;
  }
  #player {
    width: 5px;
    height: 5px;
    border-radius: 100%;
    background-color: var(--ion-color-secondary);
    position: absolute;
  }
</style>
