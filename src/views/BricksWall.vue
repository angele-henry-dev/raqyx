<template>
    <div class="wall-halo"></div>
    <div class="wall-black-halo"></div>
    <div id="bricksWall" class="bricks-wall"></div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    onMounted(() => {
        const height = screen.height;
        const lines = Math.ceil(height / 12);
        const container = document.getElementById("bricksWall");
        if (!container) {
            console.error('Container element not found');
            return;
        }

        for (let i=0; i<lines; i++) {
            const row = document.createElement("div");
            row.classList.add('row');
            for (let j=0; j<9; j++) {
                const brick = document.createElement("div");
                brick.classList.add('brick');
                // brick.classList.add('light');
                row.appendChild(brick);
            }
            container.appendChild(row);
        }
    });
</script>
