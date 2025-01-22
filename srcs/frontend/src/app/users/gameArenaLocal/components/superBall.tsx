'use client'

import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import type { PaddlePosition } from '../types/game'

interface SuperBallProps {
  paddlePositions: PaddlePosition[]
  onScoreUpdate: (score: { player1: number; player2: number }) => void
}

const planeH = 15
const planeW = 10

export default function SuperBall({ paddlePositions, onScoreUpdate }: SuperBallProps) {
  const ballRef = useRef<THREE.Mesh>(null)
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const radius = 0.2
  const maxX = 5 - radius
  const maxZ = (planeH / 2) - radius
  const winScore = 3
  const [countdown, setCountdown] = useState(3)
  const [gameStarted, setGameStarted] = useState(false)
  const lastCollisionTime = useRef(0)
  const COLLISION_COOLDOWN = 0.1
  const [score, setScore] = useState({ player1: 0, player2: 0 })
  const [winner, setWinner] = useState<string | null>(null)

  const getRandomStartAngle = () => {
    const randomQuadrant = Math.random() < 0.5 ? 0 : Math.PI
    return randomQuadrant + Math.PI / 4 + Math.random() * Math.PI / 2
  }

  const resetBall = () => {
    const angle = getRandomStartAngle()
    const speed = 10
    velocity.current.set(
      Math.cos(angle) * speed,
      0,
      Math.sin(angle) * speed
    )
    if (ballRef.current) {
      ballRef.current.position.set(0, 0.2, 0)
    }
  }

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true)
      resetBall()
    }
  }, [countdown, gameStarted])

  useFrame((state, delta) => {
    if (ballRef.current && gameStarted && !winner) {
      const PADDLE_DEPTH = 0.1
      const PADDLE_HALF_WIDTH = 1
      const ANGLE_SENSITIVITY = 3
      const MIN_VELOCITY = 8
      const MAX_VELOCITY = 15

      let newX = ballRef.current.position.x + velocity.current.x * delta
      let newZ = ballRef.current.position.z + velocity.current.z * delta

      if (Math.abs(newX) > maxX) {
        newX = Math.sign(newX) * maxX
        velocity.current.x = -velocity.current.x
      }

      const currentTime = state.clock.getElapsedTime()

      paddlePositions.forEach(paddlePos => {
        const movingTowardsPaddle = Math.sign(velocity.current.z) === Math.sign(paddlePos.z)
        if (
          movingTowardsPaddle &&
          Math.abs(newZ - paddlePos.z) < (PADDLE_DEPTH + radius) &&
          Math.abs(newX - paddlePos.x) < PADDLE_HALF_WIDTH &&
          currentTime - lastCollisionTime.current > COLLISION_COOLDOWN
        ) {
          newZ = paddlePos.z - Math.sign(paddlePos.z) * (PADDLE_DEPTH + radius)
          velocity.current.z = -velocity.current.z

          const paddleCenter = paddlePos.x
          const ballOffset = newX - paddleCenter
          const angleFactor = ballOffset / ANGLE_SENSITIVITY
          velocity.current.x = angleFactor * Math.abs(velocity.current.z)

          const speed = new THREE.Vector3().copy(velocity.current).length()
          if (speed < MIN_VELOCITY) {
            velocity.current.normalize().multiplyScalar(MIN_VELOCITY)
          }
          if (speed > MAX_VELOCITY) {
            velocity.current.normalize().multiplyScalar(MAX_VELOCITY)
          }

          lastCollisionTime.current = currentTime
        }
      })

      if (Math.abs(newZ) > maxZ) {
        let newScore
        if (newZ > maxZ) {
          newScore = { ...score, player1: score.player1 + 1 }
        } else {
          newScore = { ...score, player2: score.player2 + 1 }
        }
        setScore(newScore)
        onScoreUpdate(newScore) // Call the callback to update the scores in the Game component

        if (newScore.player1 >= winScore) {
          setWinner('Player 1')
          newX = 0
          newZ = 0
        } else if (newScore.player2 >= winScore) {
          setWinner('Player 2')
          newX = 0
          newZ = 0
        } else {
          resetBall()
          newX = 0
          newZ = 0
        }
      }

      ballRef.current.position.set(newX, 0.2, newZ)
    }
  })

  useEffect(() => {
    onScoreUpdate(score)
  }, [score, onScoreUpdate])

  return (
    <>
      <Sphere ref={ballRef} args={[radius, 32, 32]} position={[0, 0.2, 0]}>
        <meshPhysicalMaterial
          color="white"
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>

      {countdown > 0 && (
        <Html center>
          <div className="text-5xl font-bold text-white drop-shadow-lg">
            {countdown}
          </div>
        </Html>
      )}
    </>
  )
}
