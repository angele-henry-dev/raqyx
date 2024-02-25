<template>
    <ion-page >
        <BricksWall />
        <SettingsModal />
        <StatsModal />
        <RulesModal />
        <component :is="tabs[currentTab as keyof typeof tabs]" :value="currentTab" @goHome="currentTab = 'HomePage'"></component>
        <ion-footer class="menu">
            <ion-row class="title-text ion-justify-content-between">
                <ul>
                    <li :class="currentTab == 'GamePage' ? 'ingame' : ''">
                        <ion-button v-if="currentTab == 'HomePage'" class="broken-letter" fill="clear" @click="currentTab = 'GamePage'">
                            <ion-img
                                src="/assets/images/icon-game.png"
                                alt="Play"
                            ></ion-img>
                            <span v-if="currentTab == 'HomePage'">Start</span>
                        </ion-button>
                        <ion-button v-if="currentTab == 'GamePage'" fill="clear" @click="currentTab = 'HomePage'">
                            <ion-img
                                src="/assets/images/icon-home.png"
                                alt="Home"
                            ></ion-img>
                        </ion-button>
                    </li>
                    <li :class="currentTab == 'GamePage' ? 'ingame' : ''">
                        <ion-button fill="clear" id="open-modal-settings">
                            <ion-img
                                src="/assets/images/icon-settings.png"
                                alt="Settings"
                            ></ion-img>
                            <span v-if="currentTab == 'HomePage'">Settings</span>
                        </ion-button>
                    </li>
                    <li :class="currentTab == 'GamePage' ? 'ingame' : ''">
                        <ion-button fill="clear" id="open-modal-stats">
                            <ion-img
                            src="/assets/images/icon-stats.png"
                            alt="Stats"
                            ></ion-img>
                            <span v-if="currentTab == 'HomePage'">Stats</span>
                        </ion-button>
                    </li>
                    <li :class="currentTab == 'GamePage' ? 'ingame' : ''">
                        <ion-button fill="clear" id="open-modal-rules">
                            <ion-img
                            src="/assets/images/icon-rules.png"
                            alt="Rules"
                            ></ion-img>
                            <span v-if="currentTab == 'HomePage'">Rules</span>
                        </ion-button>
                    </li>
                </ul>
            </ion-row>
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
    import RulesModal from '@/views/RulesModal.vue';

    const currentTab = ref('HomePage');
    const tabs = {
        HomePage,
        GamePage,
    };
</script>
