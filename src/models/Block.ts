export interface Block {
  x: number
  y: number
  revealed: boolean
  mine: boolean
  flagged: boolean
  adjacentMines: number
}
