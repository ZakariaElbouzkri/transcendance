'use client'

import { useState, useEffect } from 'react'
import { PlayerCard } from './components/player-card'
import { ScoreDisplay } from './components/score-display'
import ThreeScene from './components/threeScene' // Import the ThreeScene component
import { useUserContext } from '@/context/UserContext'

export default function Game() {
  const [gameState, setGameState] = useState({
    player1Score: 0,
    player2Score: 0,
    winner: null,
    isGameOver: false
  })
  const [playerInfo, setPlayerInfo] = useState({
    player1: { name: 'Player 1', image: '/placeholder.svg?height=56&width=56' },
    player2: { name: 'Player 2', image: '/placeholder.svg?height=56&width=56' }
  })
  const { localOneVsOneNames } = useUserContext();

  useEffect(() => {
    if (localOneVsOneNames && localOneVsOneNames.length === 2) {
      const [player1Data, player2Data] = localOneVsOneNames.map(playerString => {
        const [name, image] = playerString.split('|')
        return { name, image }
      })

      setPlayerInfo({
        player1: {
          name: player1Data.name || 'Player 1',
          image: player1Data.image || '/placeholder.svg?height=56&width=56'
        },
        player2: {
          name: player2Data.name || 'Player 2',
          image: player2Data.image || '/placeholder.svg?height=56&width=56'
        }
      })
    }
  }, [localOneVsOneNames])

  const handleScoreUpdate = (newScore) => {
    setGameState(prevState => ({
      ...prevState,
      player1Score: newScore.player1,
      player2Score: newScore.player2,
      winner:newScore.winner
    }))
  }

  return (
    <div className=" bg-background p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-10">
          <PlayerCard
            source={playerInfo.player1.image}
            playerName={playerInfo.player1.name}
            playerScore={gameState.player1Score}
            direction="left"
            rank="Pro"
            isActive={!gameState.winner || gameState.winner === playerInfo.player1.name}
          />

          <ScoreDisplay
            player1Score={gameState.player1Score}
            player2Score={gameState.player2Score}
            winner={gameState.winner}
            isGameOver={gameState.isGameOver}
          />

          <PlayerCard
            source={playerInfo.player2.image}
            playerName={playerInfo.player2.name}
            playerScore={gameState.player2Score}
            direction="right"
            rank="Rookie"
            isActive={!gameState.winner || gameState.winner === playerInfo.player2.name}
          />
        </div>

        <div className="h-screen rounded-lg h-full border bg-muted overflow-hidden">
          <ThreeScene onScoreUpdate={handleScoreUpdate} />
        </div>
      </div>
    </div>
  )
}
