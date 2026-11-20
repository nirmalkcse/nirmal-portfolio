"use client";

import { Line } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type HeroArtifactSceneProps = {
  className?: string;
};

type ProofAtmosphereProps = {
  reducedMotion: boolean;
};

const proofNodes = [
  [-1.1, -0.24, 0.04],
  [-0.16, 0.18, 0.14],
  [1.02, -0.12, -0.08]
] as const;

const traceOffsets = [
  { y: -0.34, opacity: 0.13, scale: 1.06 },
  { y: 0, opacity: 0.2, scale: 1 },
  { y: 0.32, opacity: 0.11, scale: 0.94 }
] as const;

function ProofAtmosphere({ reducedMotion }: ProofAtmosphereProps) {
  const groupRef = useRef<THREE.Group>(null);
  const points = useMemo(
    () => proofNodes.map((node) => new THREE.Vector3(...node)),
    []
  );

  useFrame((state) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    const pointerX = reducedMotion ? 0 : state.pointer.x;

    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      pointerX * 0.035 + Math.sin(elapsed * 0.22) * 0.018,
      0.04
    );
    group.position.y = reducedMotion ? 0 : Math.sin(elapsed * 0.34) * 0.018;
  });

  return (
    <group ref={groupRef} position={[0.78, -0.06, -0.2]} scale={1.1}>
      {traceOffsets.map((trace) => (
        <Line
          color="#8ea09a"
          key={trace.y}
          lineWidth={1}
          opacity={trace.opacity}
          points={points.map(
            (point) =>
              new THREE.Vector3(point.x * trace.scale, point.y + trace.y, point.z)
          )}
          transparent
        />
      ))}

      <mesh position={[0.14, -0.02, -0.04]} rotation={[0, 0, -0.16]}>
        <planeGeometry args={[2.72, 0.018]} />
        <meshBasicMaterial color="#d7b77b" opacity={0.14} transparent />
      </mesh>

      <mesh position={[0.22, 0.22, -0.08]} rotation={[0, 0, -0.16]}>
        <planeGeometry args={[2.16, 0.01]} />
        <meshBasicMaterial color="#7f958f" opacity={0.12} transparent />
      </mesh>
    </group>
  );
}

export function HeroArtifactScene({ className }: HeroArtifactSceneProps) {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <div aria-hidden="true" className={className}>
      <Canvas
        camera={{ fov: 36, position: [0, 0, 7.2] }}
        dpr={[1, 1.4]}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
      >
        <ProofAtmosphere reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
