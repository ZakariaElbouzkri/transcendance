'use client'

import * as THREE from 'three'

const planeH = 15
const planeW = 11.25

export default function Plane() {

  const materials = [
    new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.BackSide }), // right
    new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.BackSide }), // left
    new THREE.MeshStandardMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide }), // top
    new THREE.MeshStandardMaterial({ color: 0x25c64c,opacity: 0, side: THREE.DoubleSide }), // bottom
    new THREE.MeshStandardMaterial({ color: 0x25c64c, side: THREE.BackSide }), // front
    new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.BackSide })  // back
  ]

  return (
    <group>
      <ambientLight intensity={5} />
      <mesh material={materials}>
        <boxGeometry args={[planeW, 0.4, planeH]} />
      </mesh>
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(planeW, 0.4, planeH)]} />
        <lineBasicMaterial attach="material"/>
      </lineSegments>
    </group>
  )
}