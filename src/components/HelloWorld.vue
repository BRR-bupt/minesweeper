<template>
  <h2>HelloWorld--{{ store.count }}</h2>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../store/counter'
const store = useStore()
</script>

<style scoped></style>
