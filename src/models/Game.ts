import type { Block } from './Block'

// interface GameState {
//   WIDTH: number
//   HEIGHT: number
//   allBlock: Block[][]
//   // blocks: Block[]
// }
const direations = [
  [1, 1],
  [1, 0],
  [0, 1],
  [-1, 1],
  [1, -1],
  [-1, 0],
  [-1, -1],
  [0, -1],
]

export class GamePlay {
  allBlock = ref<Block[][]>([])
  // noMinesBlocks = ref<Block[]>()
  minesGenerated = false
  // blocks: Block[]
  MODE = ref<'rest' | 'play' | 'win' | 'lost'>('rest')
  StartTime = 0
  EndTime = 0
  StopTimeStart = 0
  StopTimeEnd = 0
  // StartTime = ref()
  // EndTime = ref()

  constructor(
    public width: number,
    public height: number,
    public mines: number,
  ) {
    this.reset()
  }

  get noMinesBlocks() {
    // const blocks = this.allBlock.value.flat()
    return this.blocks.filter((block: Block) => {
      return !block.mine
    })
  }

  get blocks() {
    return this.allBlock.value.flat()
  }

  reset(
    width = this.width,
    height = this.height,
    mines = this.mines,
  ) {
    this.width = width
    this.height = height
    this.mines = mines
    this.minesGenerated = false
    this.MODE.value = 'rest'
    this.allBlock.value = Array.from({ length: this.height }, (_, y) => {
      return Array.from({ length: this.width }, (_, x): Block => {
        return { x, y, adjacentMines: 0, revealed: false, flagged: false, mine: false }
      })
    })
  }

  randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  randomInt(min: number, max: number) {
    return Math.round(this.randomRange(min, max))
  }

  generateMines(initialBlock: Block) {
    this.MODE.value = 'play'
    this.StartTime = +new Date()
    const placeRandom = () => {
      const x = this.randomInt(0, this.width - 1)
      const y = this.randomInt(0, this.height - 1)
      const block = this.allBlock.value[y][x]
      if (Math.abs(initialBlock.x - block.x) <= 1 && Math.abs(initialBlock.y - block.y) <= 1)
        return false
      if (block.mine)
        return false
      block.mine = true
      return true
    }
    Array.from({ length: this.mines }, () => null)
      .forEach(() => {
        let placed = false
        while (!placed)
          placed = placeRandom()
      })
    this.updateNumbers()
  }

  // generateMines(initialBlock: Block) {
  //   for (const row of this.allBlock.value) {
  //     for (const block of row) {
  //       if (Math.abs(initialBlock.x - block.x) <= 1 && Math.abs(initialBlock.y - block.y) <= 1)
  //         continue

  //       block.mine = Math.random() < 0.2
  //     }
  //   }
  //   this.updateNumbers()
  //   const blocks = this.allBlock.value.flat()
  //   this.noMinesBlocks.value = blocks.filter((block) => {
  //     return !block.mine
  //   })
  // }

  updateNumbers() {
    this.allBlock.value.forEach((row) => {
      row.forEach((block) => {
        if (block.mine)
          return
        this.getSiblings(block)
          .forEach((aroundBlock) => {
            if (aroundBlock.mine)
              block.adjacentMines += 1
          })
      })
    })
  }

  // 返回传入的block周围8个block数组
  getSiblings(block: Block) {
    return direations.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined

      return this.allBlock.value[y2][x2]
    })
      .filter(Boolean) as Block[]
  }

  enpandZeros(block: Block) {
    if (block.adjacentMines || block.mine)
      return

    this.getSiblings(block)
      .forEach((aroundBlock) => {
        if (!aroundBlock.revealed && !aroundBlock.flagged) {
          aroundBlock.revealed = true
          // aroundBlock.flagged = false
          this.enpandZeros(aroundBlock)
        }
      })
  }

  showResult() {
    this.allBlock.value.forEach((row) => {
      row.forEach((block) => {
        block.revealed = true
      })
    })
  }

  onClick(block: Block) {
    block.flagged = false
    if (!this.minesGenerated) {
      this.generateMines(block)
      this.minesGenerated = true
      // this.StartTime = +new Date()
    }
    block.revealed = true

    this.enpandZeros(block)
    if (this.checkGameState()) {
      this.MODE.value = 'win'
      // this.EndTime =
      this.EndTime = +new Date()
      // setTimeout(() => {
      //   // eslint-disable-next-line no-alert
      //   alert('you win')
      // }, 100)
    }
    if (block.mine) {
      this.StopTimeStart = +new Date()
      // eslint-disable-next-line no-alert
      if (window.confirm('点到了地雷，点击取消可撤回操作')) {
        this.MODE.value = 'lost'
        this.StopTimeEnd = +new Date()
        this.StartTime += (this.StopTimeEnd - this.StopTimeStart)
        this.EndTime = +new Date()
        this.showResult()
        // setTimeout(() => {
        // // eslint-disable-next-line no-alert
        //   alert('lost')
        // }, 100)
      }
      else {
        this.StopTimeEnd = +new Date()
        this.StartTime += (this.StopTimeEnd - this.StopTimeStart)
        block.revealed = false
        block.flagged = true
      }

      // this.MODE.value = 'lost'
      // this.EndTime = +new Date()
      // this.showResult()
      // setTimeout(() => {
      //   // eslint-disable-next-line no-alert
      //   alert('lost')
      // }, 100)
    }
  }

  checkGameState(): Boolean {
    return this.noMinesBlocks.every(block => block.revealed)
  }
}
