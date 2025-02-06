import { useState, useEffect, useCallback } from 'react'
import { PlayerCard } from './components/player-card'
import { ScoreDisplay } from './components/score-display'
import ThreeScene from './components/threeScene'
import { useGameSocket } from '@/context/GameSocketContext'
import WinnerCared from './components/WinnerCared'

export default function GameComponent() {
  const [gameState, setGameState] = useState({
    player1Score: 0,
    player2Score: 0,
    winner: null,
  })

  const handleScoreUpdate = useCallback((newScore) => {
    setGameState(prevState => {
      if (prevState.player1Score === newScore.player1 && 
          prevState.player2Score === newScore.player2) {
        return prevState
      }
      return {
        ...prevState,
        player1Score: newScore.player1,
        player2Score: newScore.player2,
        winner: newScore.winner
      }
    })
  }, []) 

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-10">
        <PlayerCard direction="left" />
        <ScoreDisplay
          player1Score={gameState.player1Score}
          player2Score={gameState.player2Score}
        />
        <PlayerCard direction="right" />
      </div>
      <div className="h-full w-full rounded-lg border bg-muted overflow-hidden">
        <ThreeScene onScoreUpdate={handleScoreUpdate} />
      </div>
    </div>
  )
}