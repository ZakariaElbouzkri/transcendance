export interface GameState {
  player1Score: number
  player2Score: number
  winner: string | null
  isGameOver: boolean
}

export interface PlayerInfoProps {
  source: string
  playerName: string
  playerScore: number
  playerGlobalScore: number
  direction: 'left' | 'right'
  rank?: string
  isActive?: boolean
  isMuted?: boolean
}

export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface PaddlePosition {
  x: number
  y: number
  z: number
}

