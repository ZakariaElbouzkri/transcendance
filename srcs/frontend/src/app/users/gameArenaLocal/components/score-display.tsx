"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { GameState } from "../types/game"

export function ScoreDisplay({ player1Score, player2Score, winner, isGameOver }: GameState) {
  return (
    <Card className="relative flex flex-col items-center justify-center gap-4 p-6 text-center">
      {isGameOver ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-bold">{winner} wins!</h2>
          <p className="text-xl font-mono">
            score: {player1Score} : {player2Score}
          </p>
        </motion.div>
      ) : (
        <div className="font-mono text-3xl font-bold tabular-nums">
          <p className="font-mono text-2xl flex">Score:</p>
          {player1Score} : {player2Score}
        </div>
      )}
    </Card>
  )
}

