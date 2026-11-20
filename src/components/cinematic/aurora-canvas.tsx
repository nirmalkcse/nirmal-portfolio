"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const PARTICLE_COUNT = 4000;

function seededRandom(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function createParticlePositions(count: number) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const seed = i * 3;
    const r = 10 + seededRandom(seed + 1) * 30;
    const theta = 2 * Math.PI * seededRandom(seed + 2);
    const phi = Math.acos(2 * seededRandom(seed + 3) - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  return positions;
}

const particlePositions = createParticlePositions(PARTICLE_COUNT);

function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.05;
      ref.current.rotation.y -= delta * 0.075;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={particlePositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8c5b36"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

function FloatingMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 1.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <icosahedronGeometry args={[5, 1]} />
      <meshStandardMaterial 
        color="#b98a50" 
        wireframe 
        transparent 
        opacity={0.45} 
      />
    </mesh>
  );
}

type AuroraCanvasProps = {
  className?: string;
};

export function AuroraCanvas({ className = "" }: AuroraCanvasProps) {
  return (
    <div className={className} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <fog attach="fog" args={["#fbf4e8", 10, 40]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#b98a50" />
        <ParticleField />
        <FloatingMesh />
      </Canvas>
    </div>
  );
}
