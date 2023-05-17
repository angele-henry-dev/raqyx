<template>
  <div id="container">
  </div>
</template>

<script setup lang="ts">
defineProps({
  name: String,
});
</script>

<style scoped>
  #container {
    width: 100%;
    height: 100%;
    background-color: #135d54;
    border: solid 1px #fff;
    color: #fff;
    margin: 0;
    padding: 0;
  }
</style>
