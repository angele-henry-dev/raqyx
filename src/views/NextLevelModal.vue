<template>
    <div class="change-level-animation">
        <div>
            <span>L</span><span>e</span><span>v</span><span>e</span><span>l</span>&nbsp;<span>{{ level || 0 }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { defineProps, ref } from 'vue';
    
    const props = defineProps(['level'])
    const level = ref(props.level)
</script>
