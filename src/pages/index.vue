<script setup lang="ts">
// import type { Block } from '~/models/Block'
// import confetti from 'canvas-confetti'
import BlockComp from '~/components/BlockComp.vue'
import { GamePlay } from '~/models/Game'

window.oncontextmenu = (e: MouseEvent) => {
  e.preventDefault()
}

const play = new GamePlay(9, 9, 10)
const allBlock = play.allBlock
const now = useNow()
const useTime = computed(() => {
  if (play.MODE.value === 'rest')
    return 0
  if (play.MODE.value === 'play')
    // return 0
    return Math.round((+now.value - play.StartTime) / 1000)
  return Math.round((play.EndTime - play.StartTime) / 1000)
})

// const now = $(useNow())
// const useTime = $computed(() => Math.round(((play.EndTime.value ?? +now) - (play.StartTime.value ?? +now)) / 1000))

function newGame(level: 'easy' | 'medium' | 'hard') {
  switch (level) {
    case 'easy':
      play.reset(9, 9, 10)
      break
    case 'medium':
      play.reset(16, 16, 40)
      break
    case 'hard':
      play.reset(30, 16, 99)
      break

    default:
      break
  }
}

const mineRest = computed(() => {
  // if (!play.minesGenerated)
  //   return play.mines
  let mineBlock = 0
  play.blocks.forEach((block) => {
    if (block.flagged)
      mineBlock += 1
  })
  return (play.mines - mineBlock)
})

// const myCanvas = document.createElement('canvas')
// document.body.appendChild(myCanvas)

// const myConfetti = confetti.create(myCanvas, {
//   resize: true,
//   useWorker: true,
// })
// myConfetti({
//   particleCount: 100,
//   spread: 160,
//   // any other options from the global
//   // confetti function
// })
</script>

<template>
  <div>
    Minesweeper
    <div
      flex
      gap-4
      items-center justify-center
      p-4
    >
      <button border p1 rounded @click="play.reset()">
        New Game
      </button>
      <button border p1 rounded @click="newGame('easy')">
        Easy
      </button>
      <button border p1 rounded @click="newGame('medium')">
        Medium
      </button>
      <button border p1 rounded @click="newGame('hard')">
        Hrad
      </button>
    </div>
    <div flex="~ gap-10" justify-center>
      <div font-mono text-xl flex="~ gap-1" items-center>
        <div i-carbon-timer />
        {{ useTime }}
      </div>
      <div font-mono text-xl flex="~ gap-1" items-center>
        <div i-mdi-mine />
        {{ mineRest }}
      </div>
    </div>
    <div p4>
      <div
        v-for="(row, y) in allBlock" :key="y"
        flex
        items-center justify-center
      >
        <BlockComp
          v-for="(block, x) in row" :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="block.flagged = !block.flagged"
        />
      </div>
    </div>
    <!-- <button @click="play.reset()">
      reset
    </button> -->
    <Confetti :passed="play.MODE.value === 'win'" />
  </div>
</template>
