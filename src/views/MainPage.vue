<template>
    <ion-page >
        <BricksWall />
        <component :is="tabs[currentTab as keyof typeof tabs]" :value="currentTab"></component>
        <ion-footer>
            <div class="menu">
                <ion-row>
                    <ion-col class="title-text ion-text-center" size="4">
                        <ion-button class="broken-letter" fill="clear" @click="currentTab = 'GamePage'">New</ion-button>
                    </ion-col>
                    <ion-col class="title-text ion-text-center" size="4">
                        <ion-button class="deactivated" fill="clear" @click="currentTab = 'GamePage'">Continue</ion-button>
                    </ion-col>
                    <ion-col class="title-text ion-text-center" size="4">
                        <ion-button fill="clear" id="open-modal-stats">Stats</ion-button>
                    </ion-col>
                </ion-row>
            </div>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { IonPage, IonButton, IonFooter, IonRow, IonCol } from '@ionic/vue';
    import BricksWall from '@/views/BricksWall.vue';
    import HomePage from '@/views/HomePage.vue';
    import GamePage from '@/views/GamePage.vue';

    const currentTab = ref('HomePage');
    const tabs = {
        HomePage,
        GamePage,
    }
</script>
