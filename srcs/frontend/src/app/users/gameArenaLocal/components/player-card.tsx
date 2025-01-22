"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MicOff, Trophy } from 'lucide-react'
import type { PlayerInfoProps } from "../types/game.ts"

export function PlayerCard({
  source,
  playerName,
  playerScore,
  playerGlobalScore,
  direction,
  rank = "Rookie",
  isActive = false,
}: PlayerInfoProps) {
  return (
    <Card className={cn(
      "relative flex items-center gap-4 p-4 transition-all duration-300",
      "bg-gradient-to-br from-background to-muted",
      direction === 'right' ? "flex-row" : "flex-row-reverse",
      isActive && "ring-2 ring-primary ring-offset-2"
    )}>
      <div className="relative">
        <Image
          src={source}
          width={56}
          height={56}
          alt={playerName}
          className="rounded-full object-cover"
          priority
        />

      </div>

      <div className={cn(
        "flex flex-col gap-4 px8",
        direction === 'right' ? "items-start" : "items-end"
      )}>
        <span className="text-lg font-semibold">{playerName}</span>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {playerGlobalScore}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {rank}
          </Badge>
        </div>
      </div>

      {playerScore > 0 && (
        <div className="absolute -top-2 -right-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
        </div>
      )}
    </Card>
  )
}

