<script setup lang='ts'>
import type { Block } from '~/models/Block'

const props = defineProps<{
  block: Block
}>()

const numberColors = [
  'text-transparent',
  'text-green',
  'text-blue',
  'text-pink',
  'text-yellow',
  'text-red',
  'text-purple',
  'text-teal',
  'text-amber',
]

const getBlcokClass = computed(() => {
  if (!props.block.revealed)
    return 'bg-gray-500/10 hover:bg-gray/10'

  return props.block.mine ? 'text-red' : numberColors[props.block.adjacentMines]
})
</script>

<template>
  <button
    flex
    items-center justify-center
    w-8 h-8 m="0.5"
    border="1 gray/10"
    :class="getBlcokClass"
    :disabled="block.revealed"
  >
    <template v-if="block.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-else-if="block.revealed">
      <div v-if="block.mine" i-mdi-mine />
      <div v-else>
        {{ block.adjacentMines }}
      </div>
    </template>
  </button>
</template>

