<template>
    <ion-page >
        <BricksWall />
        <component :is="tabs[currentTab as keyof typeof tabs]" :value="currentTab"></component>
        <ion-footer>
            <div class="menu">
                <ion-row class="title-text ion-justify-content-between">
                    <audio id="music">
                        <source src="/assets/music/theme 1.10.wav" autoplay :loop="true" />
                    </audio>
                    <ion-button class="broken-letter" fill="clear" @click="currentTab = 'GamePage'">New</ion-button>
                    <ion-button class="deactivated" fill="clear" @click="currentTab = 'GamePage'">Continue</ion-button>
                    <ion-button fill="clear" id="open-modal-stats">Stats</ion-button>
                    <!-- <ion-button fill="clear" @click="play()">Plop</ion-button> -->
                </ion-row>
            </div>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { IonPage, IonButton, IonFooter, IonRow } from '@ionic/vue';
    import BricksWall from '@/views/BricksWall.vue';
    import HomePage from '@/views/HomePage.vue';
    import GamePage from '@/views/GamePage.vue';

    const currentTab = ref('HomePage');
    const tabs = {
        HomePage,
        GamePage,
    }

    // const play = () => {
    //     const player = document.getElementById("music");
    //     player?.play();
    // };
</script>
