<template>
    <ion-page >
        <BricksWall />
        <SettingsModal />
        <StatsModal />
        <component :is="tabs[currentTab as keyof typeof tabs]" :value="currentTab" @goHome="currentTab = 'HomePage'"></component>
        <ion-footer>
            <div class="menu">
                <ion-row class="title-text ion-justify-content-between">
                    <audio id="music">
                        <source src="/assets/music/theme 1.10.wav" autoplay :loop="true" />
                    </audio>
                    <ion-button v-if="currentTab == 'HomePage'" class="broken-letter" fill="clear" @click="currentTab = 'GamePage'">
                        G
                    </ion-button>
                    <ion-button v-if="currentTab == 'GamePage'" fill="clear" @click="currentTab = 'HomePage'">
                        H
                    </ion-button>
                    <ion-button fill="clear" id="open-modal-settings">
                        <ion-img
                            src="/assets/images/icon-settings.png"
                            alt="Stats"
                        ></ion-img>
                    </ion-button>
                    <ion-button fill="clear" id="open-modal-stats">
                        S
                    </ion-button>
                    <ion-button fill="clear" id="open-modal-rules">
                        <ion-img
                        src="/assets/images/icon-rules.png"
                        alt="Rules"
                        ></ion-img>
                    </ion-button>
                    <!-- <ion-button fill="clear" @click="play()">Plop</ion-button> -->
                </ion-row>
            </div>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { IonPage, IonButton, IonFooter, IonRow, IonImg } from '@ionic/vue';
    import BricksWall from '@/views/BricksWall.vue';
    import HomePage from '@/views/HomePage.vue';
    import GamePage from '@/views/GamePage.vue';
    import SettingsModal from '@/views/SettingsModal.vue';
    import StatsModal from '@/views/StatsModal.vue';

    const currentTab = ref('HomePage');
    const tabs = {
        HomePage,
        GamePage,
    };

    // const play = () => {
    //     const player = document.getElementById("music");
    //     player?.play();
    // };
</script>
