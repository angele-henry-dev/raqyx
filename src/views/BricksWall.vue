<template>
    <div class="bricks-wall">
        <div class="wall-halo"></div>
        <div class="wall-black-halo"></div>
        <div id="bricksWall"></div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';

    onMounted(() => {
        const lines = Math.ceil(screen.height / 12);
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
                if (i%3 == 0 && j%3 == 0) {
                    brick.classList.add('light');
                }
                row.appendChild(brick);
            }
            container.appendChild(row);
        }
    });
</script>
