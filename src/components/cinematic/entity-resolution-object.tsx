"use client";

import { ContactShadows, Environment, Float, Html, Lightformer, Line, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type MotionValue, useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Line2, LineSegments2 } from "three-stdlib";

type EntityResolutionObjectProps = {
  className?: string;
  progress: MotionValue<number>;
};

type ResolutionLandscapeProps = {
  progress: MotionValue<number>;
  reducedMotion: boolean;
};

type SourceRecord = {
  key: string;
  system: string;
};

type SceneLayout = {
  compact: boolean;
  engine: THREE.Vector3;
  output: THREE.Vector3;
  sources: THREE.Vector3[];
};

const sourceRecords: SourceRecord[] = [
  { system: "CRM", key: "C-1842" },
  { system: "Billing", key: "A-7041" },
  { system: "Service", key: "S-2086" }
];

const clampProgress = (value: number) =>
  THREE.MathUtils.clamp((value - 0.4) / 0.22, 0, 1);

const CONNECTOR_SEGMENTS = 28;

function cubicBezier(
  a: THREE.Vector3,
  c1: THREE.Vector3,
  c2: THREE.Vector3,
  b: THREE.Vector3,
  t: number,
  out: THREE.Vector3
) {
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;
  out.set(
    uu * u * a.x + 3 * uu * t * c1.x + 3 * u * tt * c2.x + tt * t * b.x,
    uu * u * a.y + 3 * uu * t * c1.y + 3 * u * tt * c2.y + tt * t * b.y,
    uu * u * a.z + 3 * uu * t * c1.z + 3 * u * tt * c2.z + tt * t * b.z
  );
  return out;
}

function getSceneLayout(compact: boolean): SceneLayout {
  if (compact) {
    return {
      compact,
      sources: [
        new THREE.Vector3(-1.55, 1.95, 0),
        new THREE.Vector3(0, 1.95, 0.05),
        new THREE.Vector3(1.55, 1.95, 0)
      ],
      engine: new THREE.Vector3(0, 0.03, 0.05),
      output: new THREE.Vector3(0, -2.45, 0)
    };
  }

  return {
    compact,
    sources: [
      new THREE.Vector3(-2.62, 0.98, 0.02),
      new THREE.Vector3(-2.62, 0, 0.12),
      new THREE.Vector3(-2.62, -0.98, 0.02)
    ],
    engine: new THREE.Vector3(0, 0, 0.08),
    output: new THREE.Vector3(2.56, 0, 0)
  };
}

function SourceTile({ record }: { record: SourceRecord }) {
  return (
    <>
      <RoundedBox args={[1.5, 0.72, 0.05]} radius={0.06} smoothness={8}>
        <meshPhysicalMaterial
          color="#ece0cf"
          metalness={0}
          roughness={0.38}
          clearcoat={0.9}
          clearcoatRoughness={0.34}
          envMapIntensity={0.75}
        />
      </RoundedBox>
      <Html center position={[0, 0, 0.05]} style={{ pointerEvents: "none" }}>
        <div
          aria-hidden="true"
          className="w-[66px] select-none text-left text-[#2d2824] sm:w-[108px]"
        >
          <p className="font-mono text-[6px] font-semibold uppercase tracking-[0.18em] text-[#9a5637] sm:text-[7px]">
            {record.system}
          </p>
          <p className="mt-1 border-t border-[#8d7968]/25 pt-1 text-[8px] font-medium tracking-[-0.01em] sm:text-[11px]">
            {record.key}
          </p>
        </div>
      </Html>
    </>
  );
}

function ResolutionEngine() {
  return (
    <>
      {/* The resolve lens — a single polished bronze ring the records pass through */}
      <mesh>
        <torusGeometry args={[0.85, 0.05, 48, 128]} />
        <meshPhysicalMaterial
          color="#b06a41"
          metalness={1}
          roughness={0.16}
          clearcoat={0.9}
          clearcoatRoughness={0.14}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* Barely-there glass fill so the ring reads as a lens, not a hoop */}
      <mesh position={[0, 0, -0.015]}>
        <circleGeometry args={[0.81, 64]} />
        <meshPhysicalMaterial
          color="#fdf6ec"
          depthWrite={false}
          metalness={0}
          opacity={0.06}
          roughness={0.3}
          transparent
        />
      </mesh>

      <Html center position={[0, 0, 0.08]} style={{ pointerEvents: "none" }}>
        <div aria-hidden="true" className="w-[96px] select-none text-center text-[#4a3a2c] sm:w-[116px]">
          <p className="font-serif text-[17px] leading-none tracking-[-0.035em] text-[#3a2d22] sm:text-[21px]">
            Resolve
          </p>
          <p className="mt-2 border-t border-[#9a5637]/30 pt-2 font-mono text-[6px] uppercase tracking-[0.14em] text-[#8a6c53] sm:text-[7px]">
            Match · score · merge
          </p>
        </div>
      </Html>
    </>
  );
}

function GoldenRecord() {
  return (
    <>
      {/* Thin bronze rim framing the golden record */}
      <RoundedBox args={[1.98, 1.18, 0.035]} position={[0, 0, -0.014]} radius={0.09} smoothness={8}>
        <meshPhysicalMaterial
          color="#a86140"
          metalness={1}
          roughness={0.2}
          clearcoat={0.85}
          clearcoatRoughness={0.16}
          envMapIntensity={1.3}
        />
      </RoundedBox>
      <RoundedBox args={[1.9, 1.1, 0.05]} radius={0.08} smoothness={8}>
        <meshPhysicalMaterial
          color="#f5ecdf"
          metalness={0}
          roughness={0.44}
          clearcoat={0.55}
          clearcoatRoughness={0.36}
          envMapIntensity={0.6}
        />
      </RoundedBox>
      <Html center position={[0, 0, 0.05]} style={{ pointerEvents: "none" }}>
        <div aria-hidden="true" className="w-[86px] select-none text-left text-[#302923] sm:w-[140px]">
          <div className="flex items-center justify-between font-mono text-[6px] font-semibold uppercase tracking-[0.16em] text-[#9a5637] sm:text-[7px]">
            <span>Golden record</span>
            <span>01</span>
          </div>
          <p className="mt-2 whitespace-nowrap border-y border-[#9a5637]/25 py-2 font-serif text-[11px] leading-none tracking-[-0.025em] sm:text-[19px]">
            Customer 01842
          </p>
          <p className="mt-2 font-mono text-[6px] uppercase tracking-[0.13em] text-[#8a604b] sm:text-[7px]">
            96% confidence
          </p>
        </div>
      </Html>
    </>
  );
}

function ResolutionLandscape({ progress, reducedMotion }: ResolutionLandscapeProps) {
  const rootRef = useRef<THREE.Group>(null);
  const sourceRefs = useRef<Array<THREE.Group | null>>([]);
  const engineRef = useRef<THREE.Group>(null);
  const outputRef = useRef<THREE.Group>(null);
  const { size, viewport } = useThree();
  const compact = size.width < 640;
  const layout = useMemo(() => getSceneLayout(compact), [compact]);
  const temporaryPositionRef = useRef(new THREE.Vector3());

  // Live connectors: anchored to the animated objects every frame, so the
  // curves stay physically attached — tile edge → engine port → golden record.
  const sourceInnerRefs = useRef<Array<THREE.Group | null>>([]);
  const engineInnerRef = useRef<THREE.Group>(null);
  const outputInnerRef = useRef<THREE.Group>(null);
  const connectorLineRefs = useRef<Array<Line2 | LineSegments2 | null>>([]);
  const connectorPositions = useRef(
    Array.from({ length: 4 }, () => new Float32Array((CONNECTOR_SEGMENTS + 1) * 3))
  );
  const connectorCurves = useRef(
    Array.from({ length: 4 }, () => ({
      a: new THREE.Vector3(),
      c1: new THREE.Vector3(),
      c2: new THREE.Vector3(),
      b: new THREE.Vector3()
    }))
  );
  const scratchRef = useRef({
    a: new THREE.Vector3(),
    b: new THREE.Vector3(),
    p: new THREE.Vector3()
  });

  useFrame((state, delta) => {
    const temporaryPosition = temporaryPositionRef.current;
    const assemblyProgress = reducedMotion ? 1 : clampProgress(progress.get());
    const resolved = THREE.MathUtils.smoothstep(assemblyProgress, 0, 1);
    const frameEase = 1 - Math.exp(-delta * 8);
    const root = rootRef.current;
    const engine = engineRef.current;
    const output = outputRef.current;

    // Rebuilds one connector as a cubic S-curve between two live anchor points
    // (in root-local space), leaving and arriving horizontally/vertically.
    const updateConnector = (
      idx: number,
      from: THREE.Object3D,
      fromLocal: [number, number, number],
      to: THREE.Object3D,
      toLocal: [number, number, number],
      vertical: boolean,
      opacity: number
    ) => {
      if (!root) {
        return;
      }
      const { a, b, p } = scratchRef.current;
      const curve = connectorCurves.current[idx];
      a.set(...fromLocal);
      from.localToWorld(a);
      root.worldToLocal(a);
      b.set(...toLocal);
      to.localToWorld(b);
      root.worldToLocal(b);
      curve.a.copy(a);
      curve.b.copy(b);
      if (vertical) {
        const dy = b.y - a.y;
        curve.c1.set(a.x, a.y + dy * 0.45, a.z);
        curve.c2.set(b.x, b.y - dy * 0.45, b.z);
      } else {
        const dx = b.x - a.x;
        curve.c1.set(a.x + dx * 0.45, a.y, a.z);
        curve.c2.set(b.x - dx * 0.45, b.y, b.z);
      }
      const arr = connectorPositions.current[idx];
      for (let s = 0; s <= CONNECTOR_SEGMENTS; s++) {
        cubicBezier(curve.a, curve.c1, curve.c2, curve.b, s / CONNECTOR_SEGMENTS, p);
        arr[s * 3] = p.x;
        arr[s * 3 + 1] = p.y;
        arr[s * 3 + 2] = p.z;
      }
      const line = connectorLineRefs.current[idx];
      if (line) {
        line.geometry.setPositions(arr);
        line.material.opacity = opacity;
      }
    };
    // The canvas now stays inside its own grid column (it used to bleed 15vw
    // over the headline), so allow the scene to scale further down and fit
    // the narrower viewport instead of colliding with the text.
    const fitScale = layout.compact
      ? 0.62
      : THREE.MathUtils.clamp(viewport.width / 9.6, 0.7, 0.92);

    if (root) {
      root.scale.setScalar(THREE.MathUtils.lerp(root.scale.x, fitScale, frameEase));
      root.position.x = THREE.MathUtils.lerp(
        root.position.x,
        layout.compact ? 0 : 0.1,
        frameEase
      );
      root.rotation.y = THREE.MathUtils.lerp(
        root.rotation.y,
        reducedMotion ? 0 : state.pointer.x * 0.025,
        frameEase * 0.45
      );
      root.rotation.x = THREE.MathUtils.lerp(
        root.rotation.x,
        reducedMotion ? 0 : -state.pointer.y * 0.014,
        frameEase * 0.45
      );
    }

    sourceRefs.current.forEach((source, index) => {
      if (!source) {
        return;
      }

      const staggered = THREE.MathUtils.smoothstep(
        THREE.MathUtils.clamp((assemblyProgress - index * 0.055) / 0.88, 0, 1),
        0,
        1
      );
      const target = layout.sources[index];
      temporaryPosition.copy(target);

      if (layout.compact) {
        temporaryPosition.y += THREE.MathUtils.lerp(0.22, 0, staggered);
      } else {
        temporaryPosition.x += THREE.MathUtils.lerp(-0.42, 0, staggered);
      }

      source.position.lerp(temporaryPosition, frameEase);
      source.rotation.y = THREE.MathUtils.lerp(
        source.rotation.y,
        layout.compact ? 0 : 0.09 - resolved * 0.045,
        frameEase
      );
      source.rotation.z = THREE.MathUtils.lerp(
        source.rotation.z,
        (index - 1) * 0.018 * (1 - resolved),
        frameEase
      );

      const sourceInner = sourceInnerRefs.current[index];
      const engineInner = engineInnerRef.current;
      if (sourceInner && engineInner) {
        // Each source lands on its own point of the ring's rim — a clean fan,
        // nothing crosses, nothing enters the ring.
        const rimTargets: Array<[number, number, number]> = layout.compact
          ? [
              [-0.36, 0.77, 0],
              [0, 0.85, 0],
              [0.36, 0.77, 0]
            ]
          : [
              [-0.77, 0.36, 0],
              [-0.85, 0, 0],
              [-0.77, -0.36, 0]
            ];
        updateConnector(
          index,
          sourceInner,
          layout.compact ? [0, -0.37, 0] : [0.77, 0, 0],
          engineInner,
          rimTargets[index],
          layout.compact,
          0.38 * staggered
        );
      }
    });

    if (engine) {
      engine.position.lerp(layout.engine, frameEase);
      engine.rotation.x = THREE.MathUtils.lerp(engine.rotation.x, -0.07, frameEase);
      engine.rotation.y = THREE.MathUtils.lerp(
        engine.rotation.y,
        THREE.MathUtils.lerp(-0.3, -0.1, resolved),
        frameEase
      );
      const engineScale = THREE.MathUtils.lerp(0.92, 1.02, resolved);
      engine.scale.setScalar(THREE.MathUtils.lerp(engine.scale.x, engineScale, frameEase));
    }

    if (output) {
      temporaryPosition.copy(layout.output);
      if (layout.compact) {
        temporaryPosition.y += THREE.MathUtils.lerp(-0.22, 0, resolved);
      } else {
        temporaryPosition.x += THREE.MathUtils.lerp(0.42, 0, resolved);
      }
      output.position.lerp(temporaryPosition, frameEase);
      output.rotation.x = THREE.MathUtils.lerp(output.rotation.x, -0.06, frameEase);
      output.rotation.y = THREE.MathUtils.lerp(
        output.rotation.y,
        THREE.MathUtils.lerp(0.26, -0.12, resolved),
        frameEase
      );
      const outputScale = THREE.MathUtils.lerp(0.88, 1.04, resolved);
      output.scale.setScalar(THREE.MathUtils.lerp(output.scale.x, outputScale, frameEase));
    }

    const engineInner = engineInnerRef.current;
    const outputInner = outputInnerRef.current;
    if (engineInner && outputInner) {
      updateConnector(
        3,
        engineInner,
        layout.compact ? [0, -0.85, 0] : [0.85, 0, 0],
        outputInner,
        layout.compact ? [0, 0.58, 0] : [-1.0, 0, 0],
        layout.compact,
        0.55 * resolved
      );
    }

  });

  return (
    <group ref={rootRef}>
      {sourceRecords.map((record, index) => (
        <Line
          color="#a9785d"
          key={`connector-${record.system}`}
          lineWidth={1.1}
          opacity={0}
          points={[[0, 0, 0], [0, 0.001, 0]]}
          ref={(node) => {
            connectorLineRefs.current[index] = node;
          }}
          transparent
        />
      ))}
      <Line
        color="#a65f3f"
        lineWidth={1.6}
        opacity={0}
        points={[[0, 0, 0], [0, 0.001, 0]]}
        ref={(node) => {
          connectorLineRefs.current[3] = node;
        }}
        transparent
      />

      {sourceRecords.map((record, index) => (
        <group
          key={record.system}
          ref={(node) => {
            sourceRefs.current[index] = node;
          }}
        >
          <Float
            floatIntensity={0.16}
            floatingRange={[-0.035, 0.035]}
            rotationIntensity={0.08}
            speed={reducedMotion ? 0 : 1 + index * 0.14}
          >
            <group
              ref={(node) => {
                sourceInnerRefs.current[index] = node;
              }}
            >
              <SourceTile record={record} />
            </group>
          </Float>
        </group>
      ))}

      <group ref={engineRef}>
        <Float
          floatIntensity={0.12}
          floatingRange={[-0.03, 0.03]}
          rotationIntensity={0.05}
          speed={reducedMotion ? 0 : 0.85}
        >
          <group ref={engineInnerRef}>
            <ResolutionEngine />
          </group>
        </Float>
      </group>

      <group ref={outputRef}>
        <Float
          floatIntensity={0.14}
          floatingRange={[-0.03, 0.03]}
          rotationIntensity={0.06}
          speed={reducedMotion ? 0 : 0.95}
        >
          <group ref={outputInnerRef}>
            <GoldenRecord />
          </group>
        </Float>
      </group>

      <ContactShadows
        blur={4.6}
        color="#6f5a4a"
        far={6}
        opacity={0.17}
        position={[0, layout.compact ? -3.42 : -1.55, 0]}
        scale={layout.compact ? 6.8 : 10.8}
      />
    </group>
  );
}

export function EntityResolutionObject({ className = "", progress }: EntityResolutionObjectProps) {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <div
      className={`relative ${className}`}
      style={{
        WebkitMaskImage: "radial-gradient(ellipse 96% 92% at 54% 50%, #000 69%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 96% 92% at 54% 50%, #000 69%, transparent 100%)"
      }}
    >
      <Canvas
        camera={{ fov: 32, position: [0, 0.05, 7.8] }}
        dpr={[1, 2]}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
      >
        {/* Studio softbox environment — this is what the clearcoat and metals reflect */}
        <Environment resolution={256}>
          <Lightformer color="#fff8ee" intensity={2.2} position={[0, 3.4, 5]} rotation-x={-Math.PI / 6} scale={[10, 4, 1]} />
          <Lightformer color="#f3e3cd" intensity={1.1} position={[-6, 0.8, 2]} rotation-y={Math.PI / 2.6} scale={[6, 3, 1]} />
          <Lightformer color="#dca57c" intensity={0.85} position={[6, -0.6, 2.6]} rotation-y={-Math.PI / 2.6} scale={[5, 2.6, 1]} />
          <Lightformer color="#b87b57" form="ring" intensity={0.5} position={[0, -4, 4]} rotation-x={Math.PI / 3} scale={[8, 3, 1]} />
        </Environment>

        <hemisphereLight color="#fffaf3" groundColor="#ad8067" intensity={0.75} />
        <directionalLight color="#fff6ea" intensity={1.5} position={[-3.5, 5, 6]} />
        <directionalLight color="#b56d49" intensity={0.55} position={[4, -1, 3]} />
        <ResolutionLandscape progress={progress} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

