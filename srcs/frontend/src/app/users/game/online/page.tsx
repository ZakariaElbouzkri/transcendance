"use client"
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { TableIcon as TableTennis } from "lucide-react"
import { useGameSocket } from "@/context/GameSocketContext"
import GameComponent from "./gameComponent"
import Image from "next/image"
import styles from "../styles/Game.module.css"

interface Player {
  id: number
  name: string
  avatar: string
}

const PLAYERS: Player[] = [
  { id: 1, name: "Sam", avatar: "/animalsProfile/dankyprofile.png" },
  { id: 2, name: "Jamie", avatar: "/animalsProfile/dogprofile.png" },
  { id: 3, name: "Taylor", avatar: "/animalsProfile/lionprofile.png" },
  { id: 4, name: "Alex", avatar: "/animalsProfile/catprofile.png" },
]

const FALLBACK_AVATAR = process.env.NEXT_PUBLIC_DEFAULT_AVATAR;

export default function PingPongMatchup() {
  const { 
    stageReady, 
    setGameStarted, 
    me, 
    disconnectSocket, 
    room,  
    setStage,
    getOpponent,
  } = useGameSocket()
  
  const [player2, setPlayer2] = useState<Player>(PLAYERS[0])
  const [isMatching, setIsMatching] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const intervalRef = useRef<NodeJS.Timeout>()

  const player1 = useMemo(() => ({
    id: me.id,
    name: me.username,
    avatar: me.avatar || FALLBACK_AVATAR,
  }), [me.id, me.username, me.avatar])

  
  useEffect(() => {
    if (room && !stageReady) {
      const opp = getOpponent()
      console.log('OPP:', opp)
      setPlayer2({
        id: opp.id,
        name: opp.username,
        avatar: opp.avatar || FALLBACK_AVATAR
      })
    }
  }, [room, getOpponent])

  useEffect(() => {
    if (!stageReady && isMatching && !room) {
      intervalRef.current = setInterval(() => {
        setPlayer2(PLAYERS[Math.floor(Math.random() * PLAYERS.length)])
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isMatching, stageReady, room])

  useEffect(() => {
    if (!stageReady) return

    const countdownInterval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => {
      clearInterval(countdownInterval)
      setCountdown(5)
    }
  }, [stageReady])

  const handleCancelMatch = useCallback(() => {
    setIsMatching(false)
    setGameStarted(false)
    disconnectSocket()
  }, [setGameStarted, disconnectSocket])

  const startMatching = useCallback(() => {
    setIsMatching(true)
    setGameStarted(true)
  }, [setGameStarted])

  if (stageReady) {
    return countdown > 0 ? (
      <div className={styles.container}>
        <div className="text-4xl font-bold mb-8 text-white drop-shadow-lg">Match Found!</div>
        <div className="text-2xl font-bold mb-8 text-white drop-shadow-lg">
          Starting in {countdown} seconds...
        </div>
      </div>
    ) : <GameComponent />
  }

  return (
    <div className={styles.container}>
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none" />
      
      <TableTennis className="absolute top-10 left-10 text-white opacity-30 w-16 h-16" />
      <TableTennis className="absolute bottom-10 right-10 text-white opacity-30 w-16 h-16" />

      <h1 className="text-4xl font-bold mb-8 text-white drop-shadow-lg">Ping Pong Matchup</h1>

      {(isMatching || room) ? (
        <div className="flex justify-between items-center w-full max-w-2xl mb-8 z-10">
          <PlayerCard player={player1} color="blue" />
          <div className="text-5xl font-bold text-white drop-shadow-lg">VS</div>
          <PlayerCard player={player2} color="red" />
        </div>
      ) : (
        <div className="flex justify-center items-center w-full mb-8">
          <PlayerCard player={player1} color="blue" />
        </div>
      )}

      <div>
        {(isMatching || room) ? (
          <div className="flex flex-col justify-center items-center w-full mb-8">
            <div className="text-3xl font-bold mb-4 text-white bg-green-600 px-6 py-2 rounded-full drop-shadow-lg animate-fade-in">
              {room ? `Waiting For ${player2.name} to join...` : "Searching for Opponent..."}
            </div>
            <Button
              onClick={handleCancelMatch}
              className="px-6 py-2 text-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            onClick={startMatching}
            className="px-6 py-2 text-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Find Opponent
          </Button>
        )}
      </div>
    </div>
  )
}

function PlayerCard({ player, color }: { player: Player, color: "blue" | "red" }) {
  const [avatarKey, setAvatarKey] = useState(`${player.id}-${Date.now()}`);
  const [avatarSrc, setAvatarSrc] = useState(player.avatar);

  useEffect(() => {
    setAvatarSrc(player.avatar);
    setAvatarKey(`${player.id}-${Date.now()}`);
  }, [player.avatar, player.id]);

  return (
    <div className="text-center bg-white p-4 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-2">{player.name}</h2>
      <div className={`w-32 h-32 rounded-full border-4 ${
        color === 'blue' ? 'border-blue-500' : 'border-red-500'
      } overflow-hidden relative`}>
        <Image
          key={avatarKey}
          src={avatarSrc}
          alt={`${player.name}'s avatar`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setAvatarSrc(FALLBACK_AVATAR)}
        />
      </div>
    </div>
  );
}