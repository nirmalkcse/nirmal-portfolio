"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import type { MotionValue } from "framer-motion";
import { ToneMappingMode } from "postprocessing";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import {
  mistFragment,
  mistVertex,
  particleFragment,
  particleVertex,
  skyFragment,
  skyVertex,
  terrainFragment,
  terrainVertex,
  waterFragment,
  waterVertex
} from "./world-shaders";

/* ─── Per-element lighting and staging ───────────────────────────────── */

type Vec3 = readonly [number, number, number];

type ElementStage = {
  camera: Vec3;
  target: Vec3;
  sunDir: Vec3;
  sunColor: Vec3;
  zenith: Vec3;
  horizon: Vec3;
  fog: Vec3;
  fogDensity: number;
  ground: Vec3;
  waterLevel: number;
  waveScale: number;
  lava: number;
  stars: number;
  clouds: number;
  sunGlow: number;
  snowLine: number;
  nebula: Vec3;
  mist: Vec3;
  mistOpacity: number;
};

const stages: readonly ElementStage[] = [
  {
    /* Earth, at dawn */
    camera: [0, 9, 26],
    target: [0, 4, -40],
    sunDir: [0.6, 0.18, -0.75],
    sunColor: [1.0, 0.78, 0.55],
    zenith: [0.72, 0.78, 0.86],
    horizon: [0.98, 0.86, 0.70],
    fog: [0.95, 0.88, 0.76],
    fogDensity: 0.012,
    ground: [0.45, 0.35, 0.25],
    waterLevel: -6,
    waveScale: 0.1,
    lava: 0,
    stars: 0,
    clouds: 0.2,
    sunGlow: 1.2,
    snowLine: 60,
    nebula: [0, 0, 0],
    mist: [1.0, 0.92, 0.8],
    mistOpacity: 0.32
  },
  {
    /* Water, mid-morning, low over the sea with the coast to the west */
    camera: [-8, 4.6, 24],
    target: [10, 0.4, -44],
    sunDir: [0.42, 0.46, -0.78],
    sunColor: [1.0, 0.96, 0.88],
    zenith: [0.40, 0.60, 0.84],
    horizon: [0.84, 0.90, 0.94],
    fog: [0.80, 0.87, 0.92],
    fogDensity: 0.0075,
    ground: [0.30, 0.40, 0.42],
    waterLevel: 1.0,
    waveScale: 1.0,
    lava: 0,
    stars: 0,
    clouds: 0.45,
    sunGlow: 1.0,
    snowLine: 60,
    nebula: [0, 0, 0],
    mist: [0.92, 0.97, 0.98],
    mistOpacity: 0.22
  },
  {
    /* Fire, after sundown: high enough to see over the rim into the lava */
    camera: [0, 26, 16],
    target: [0, -2, -74],
    sunDir: [-0.5, 0.06, -0.86],
    sunColor: [1.0, 0.45, 0.2],
    zenith: [0.05, 0.03, 0.06],
    horizon: [0.55, 0.14, 0.06],
    fog: [0.25, 0.08, 0.05],
    fogDensity: 0.016,
    ground: [0.25, 0.08, 0.04],
    waterLevel: -2.5,
    waveScale: 0.3,
    lava: 1,
    stars: 0.25,
    clouds: 0,
    sunGlow: 1.6,
    snowLine: 60,
    nebula: [0.3, 0.12, 0.1],
    mist: [0.5, 0.2, 0.12],
    mistOpacity: 0.55
  },
  {
    /* Air, high noon */
    camera: [0, 24, 20],
    target: [0, 14, -60],
    sunDir: [0.3, 0.85, -0.45],
    sunColor: [1.0, 0.98, 0.94],
    zenith: [0.35, 0.56, 0.86],
    horizon: [0.85, 0.91, 0.97],
    fog: [0.80, 0.87, 0.95],
    fogDensity: 0.009,
    ground: [0.45, 0.48, 0.52],
    waterLevel: -3,
    waveScale: 0.15,
    lava: 0,
    stars: 0,
    clouds: 1,
    sunGlow: 0.9,
    snowLine: 14,
    nebula: [0, 0, 0],
    mist: [1.0, 1.0, 1.0],
    mistOpacity: 0.7
  },
  {
    /* Ether, deep night */
    camera: [0, 26, 20],
    target: [0, 40, -60],
    sunDir: [0.2, -0.2, -0.95],
    sunColor: [0.3, 0.35, 0.5],
    zenith: [0.01, 0.015, 0.04],
    horizon: [0.06, 0.08, 0.16],
    fog: [0.03, 0.04, 0.08],
    fogDensity: 0.010,
    ground: [0.04, 0.05, 0.09],
    waterLevel: -3,
    waveScale: 0.1,
    lava: 0,
    stars: 1,
    clouds: 0,
    sunGlow: 0,
    snowLine: 14,
    nebula: [0.35, 0.28, 0.55],
    mist: [0.2, 0.22, 0.35],
    mistOpacity: 0.1
  }
];

const INTRO_CAMERA: Vec3 = [0, 34, 70];
const INTRO_DURATION = 4.4;

function weightsFor(element: number) {
  const w = [0, 0, 0, 0, 0];
  for (let i = 0; i < 5; i++) w[i] = Math.max(0, 1 - Math.abs(element - i));
  return w;
}

function blendScalar(pick: (stage: ElementStage) => number, w: number[]) {
  let total = 0;
  for (let i = 0; i < 5; i++) total += w[i] * pick(stages[i]);
  return total;
}

function blendVec(pick: (stage: ElementStage) => Vec3, w: number[], out: THREE.Vector3) {
  out.set(0, 0, 0);
  for (let i = 0; i < 5; i++) {
    const v = pick(stages[i]);
    out.x += w[i] * v[0];
    out.y += w[i] * v[1];
    out.z += w[i] * v[2];
  }
  return out;
}

const PARTICLE_COUNT = 5000;

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function createSeeds(count: number) {
  const seeds = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    seeds[i * 4] = seededRandom(i * 4 + 1);
    seeds[i * 4 + 1] = seededRandom(i * 4 + 2);
    seeds[i * 4 + 2] = seededRandom(i * 4 + 3);
    seeds[i * 4 + 3] = seededRandom(i * 4 + 4);
  }
  return seeds;
}

const particleSeeds = createSeeds(PARTICLE_COUNT);
const particlePositions = new Float32Array(PARTICLE_COUNT * 3);

const mistPlacements = [
  { position: [-28, 2.5, -24] as Vec3, scale: 1.0, seed: 0.1 },
  { position: [22, 1.5, -34] as Vec3, scale: 1.3, seed: 0.7 },
  { position: [-6, 3.5, -60] as Vec3, scale: 1.8, seed: 1.9 },
  { position: [40, 5, -80] as Vec3, scale: 2.2, seed: 2.6 },
  { position: [-44, 6, -96] as Vec3, scale: 2.4, seed: 3.4 },
  { position: [8, 10, -120] as Vec3, scale: 3.2, seed: 4.1 }
];

type FrameState = {
  pointer: { x: number; y: number };
  pointerTarget: { x: number; y: number };
  startedAt: number;
};

type Scratch = {
  camera: THREE.Vector3;
  target: THREE.Vector3;
  sun: THREE.Vector3;
  sunColor: THREE.Vector3;
  zenith: THREE.Vector3;
  horizon: THREE.Vector3;
  fog: THREE.Vector3;
  ground: THREE.Vector3;
  nebula: THREE.Vector3;
  mist: THREE.Vector3;
  look: THREE.Vector3;
};

function createScratch(): Scratch {
  return {
    camera: new THREE.Vector3(),
    target: new THREE.Vector3(),
    sun: new THREE.Vector3(),
    sunColor: new THREE.Vector3(),
    zenith: new THREE.Vector3(),
    horizon: new THREE.Vector3(),
    fog: new THREE.Vector3(),
    ground: new THREE.Vector3(),
    nebula: new THREE.Vector3(),
    mist: new THREE.Vector3(),
    look: new THREE.Vector3()
  };
}

/* ─── The scene ──────────────────────────────────────────────────────── */

function World({
  stateRef,
  element,
  reduced
}: {
  stateRef: RefObject<FrameState>;
  element: MotionValue<number>;
  reduced: boolean;
}) {
  const { camera, viewport, setDpr } = useThree();
  const terrainRef = useRef<THREE.ShaderMaterial>(null);
  const skyRef = useRef<THREE.ShaderMaterial>(null);
  const skyMeshRef = useRef<THREE.Mesh>(null);
  const waterRef = useRef<THREE.ShaderMaterial>(null);
  const waterMeshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.ShaderMaterial>(null);
  const mistRefs = useRef<(THREE.Mesh | null)[]>([]);
  const budgetRef = useRef({ frames: 0, total: 0, settled: false });
  const scratchRef = useRef<Scratch | null>(null);

  const terrainUniforms = useMemo(
    () => ({
      uW: { value: [1, 0, 0, 0, 0] },
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(0.6, 0.18, -0.75) },
      uSunColor: { value: new THREE.Vector3(1, 0.78, 0.55) },
      uSkyColor: { value: new THREE.Vector3(0.72, 0.78, 0.86) },
      uGroundColor: { value: new THREE.Vector3(0.45, 0.35, 0.25) },
      uFogColor: { value: new THREE.Vector3(0.95, 0.88, 0.76) },
      uFogDensity: { value: 0.012 },
      uSnowLine: { value: 60 },
      uWaterLevel: { value: -6 },
      uExposure: { value: 1 }
    }),
    []
  );

  const skyUniforms = useMemo(
    () => ({
      uZenith: { value: new THREE.Vector3(0.72, 0.78, 0.86) },
      uHorizon: { value: new THREE.Vector3(0.98, 0.86, 0.7) },
      uSunColor: { value: new THREE.Vector3(1, 0.78, 0.55) },
      uSunDir: { value: new THREE.Vector3(0.6, 0.18, -0.75) },
      uNebula: { value: new THREE.Vector3(0, 0, 0) },
      uStars: { value: 0 },
      uClouds: { value: 0.2 },
      uSunGlow: { value: 1.2 },
      uTime: { value: 0 },
      uExposure: { value: 1 }
    }),
    []
  );

  const waterUniforms = useMemo(
    () => ({
      uW: { value: [1, 0, 0, 0, 0] },
      uTime: { value: 0 },
      uLava: { value: 0 },
      uWaveScale: { value: 0.1 },
      uExposure: { value: 1 },
      uSunDir: { value: new THREE.Vector3(0.6, 0.18, -0.75) },
      uSunColor: { value: new THREE.Vector3(1, 0.78, 0.55) },
      uZenith: { value: new THREE.Vector3(0.72, 0.78, 0.86) },
      uHorizon: { value: new THREE.Vector3(0.98, 0.86, 0.7) },
      uFogColor: { value: new THREE.Vector3(0.95, 0.88, 0.76) },
      uFogDensity: { value: 0.012 }
    }),
    []
  );

  const particleUniforms = useMemo(
    () => ({
      uW: { value: [1, 0, 0, 0, 0] },
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uWaterLevel: { value: 0 }
    }),
    []
  );

  const mistUniforms = useMemo(
    () =>
      mistPlacements.map((placement) => ({
        uColor: { value: new THREE.Vector3(1, 0.92, 0.8) },
        uOpacity: { value: 0 },
        uTime: { value: 0 },
        uSeed: { value: placement.seed }
      })),
    []
  );

  useFrame((frame, delta) => {
    const terrain = terrainRef.current;
    const sky = skyRef.current;
    const water = waterRef.current;
    const particles = particlesRef.current;
    if (!terrain || !sky || !water || !particles) return;

    const state = stateRef.current;
    const scratch = scratchRef.current ?? (scratchRef.current = createScratch());
    const budget = budgetRef.current;
    if (!budget.settled) {
      budget.frames += 1;
      if (budget.frames > 30) budget.total += delta;
      if (budget.frames >= 150) {
        budget.settled = true;
        if (budget.total / 120 > 0.022 && viewport.dpr > 1) setDpr(1);
      }
    }

    const time = reduced ? 40 : frame.clock.elapsedTime;
    const t = Math.min(4, Math.max(0, element.get()));
    const w = weightsFor(t);

    /* the camera: a slow glide in on arrival, then the journey's own path */
    const since = (performance.now() - state.startedAt) / 1000;
    const introRaw = reduced ? 1 : Math.min(1, since / INTRO_DURATION);
    const intro = 1 - Math.pow(1 - introRaw, 3);
    blendVec((stage) => stage.camera, w, scratch.camera);
    blendVec((stage) => stage.target, w, scratch.target);
    scratch.camera.x = THREE.MathUtils.lerp(INTRO_CAMERA[0], scratch.camera.x, intro);
    scratch.camera.y = THREE.MathUtils.lerp(INTRO_CAMERA[1], scratch.camera.y, intro);
    scratch.camera.z = THREE.MathUtils.lerp(INTRO_CAMERA[2], scratch.camera.z, intro);

    const ease = 1 - Math.exp(-delta * 3.5);
    state.pointer.x += (state.pointerTarget.x - state.pointer.x) * ease;
    state.pointer.y += (state.pointerTarget.y - state.pointer.y) * ease;
    const px = (state.pointer.x - 0.5) * 2;
    const py = (state.pointer.y - 0.5) * 2;
    scratch.look.copy(scratch.target);
    scratch.look.x += px * 6;
    scratch.look.y += py * 3;
    scratch.camera.x += px * 1.2;
    scratch.camera.y += py * 0.6;

    camera.position.lerp(scratch.camera, 1 - Math.exp(-delta * 5));
    camera.lookAt(scratch.look);

    /* lighting */
    blendVec((stage) => stage.sunDir, w, scratch.sun).normalize();
    blendVec((stage) => stage.sunColor, w, scratch.sunColor);
    blendVec((stage) => stage.zenith, w, scratch.zenith);
    blendVec((stage) => stage.horizon, w, scratch.horizon);
    blendVec((stage) => stage.fog, w, scratch.fog);
    blendVec((stage) => stage.ground, w, scratch.ground);
    blendVec((stage) => stage.nebula, w, scratch.nebula);
    blendVec((stage) => stage.mist, w, scratch.mist);
    /* Through the middle of every segue the air thickens and the light
       swells, so one world passes into the next instead of sliding there. */
    const passage = Math.pow(Math.sin(Math.PI * (t - Math.floor(t))), 2);
    const fogDensity = blendScalar((stage) => stage.fogDensity, w) * (1 + 0.55 * passage);
    const exposure = 1 + 0.16 * passage;
    const waterLevel = blendScalar((stage) => stage.waterLevel, w);

    terrain.uniforms.uW.value = w;
    terrain.uniforms.uTime.value = time;
    terrain.uniforms.uSunDir.value.copy(scratch.sun);
    terrain.uniforms.uSunColor.value.copy(scratch.sunColor);
    terrain.uniforms.uSkyColor.value.copy(scratch.zenith);
    terrain.uniforms.uGroundColor.value.copy(scratch.ground);
    terrain.uniforms.uFogColor.value.copy(scratch.fog);
    terrain.uniforms.uFogDensity.value = fogDensity;
    terrain.uniforms.uSnowLine.value = blendScalar((stage) => stage.snowLine, w);
    terrain.uniforms.uWaterLevel.value = waterLevel;
    terrain.uniforms.uExposure.value = exposure;

    sky.uniforms.uExposure.value = exposure;
    sky.uniforms.uZenith.value.copy(scratch.zenith);
    sky.uniforms.uHorizon.value.copy(scratch.horizon);
    sky.uniforms.uSunColor.value.copy(scratch.sunColor);
    sky.uniforms.uSunDir.value.copy(scratch.sun);
    sky.uniforms.uNebula.value.copy(scratch.nebula);
    sky.uniforms.uStars.value = blendScalar((stage) => stage.stars, w);
    sky.uniforms.uClouds.value = blendScalar((stage) => stage.clouds, w);
    sky.uniforms.uSunGlow.value = blendScalar((stage) => stage.sunGlow, w);
    sky.uniforms.uTime.value = time;
    skyMeshRef.current?.position.copy(camera.position);

    water.uniforms.uW.value = w;
    water.uniforms.uTime.value = time;
    water.uniforms.uLava.value = blendScalar((stage) => stage.lava, w);
    water.uniforms.uWaveScale.value = blendScalar((stage) => stage.waveScale, w);
    water.uniforms.uExposure.value = exposure;
    water.uniforms.uSunDir.value.copy(scratch.sun);
    water.uniforms.uSunColor.value.copy(scratch.sunColor);
    water.uniforms.uZenith.value.copy(scratch.zenith);
    water.uniforms.uHorizon.value.copy(scratch.horizon);
    water.uniforms.uFogColor.value.copy(scratch.fog);
    water.uniforms.uFogDensity.value = fogDensity;
    if (waterMeshRef.current) waterMeshRef.current.position.y = waterLevel;

    particles.uniforms.uW.value = w;
    particles.uniforms.uTime.value = time;
    particles.uniforms.uPixelRatio.value = viewport.dpr;
    particles.uniforms.uWaterLevel.value = waterLevel;

    const mistOpacity = blendScalar((stage) => stage.mistOpacity, w);
    mistRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      mesh.lookAt(camera.position);
      const material = mesh.material as THREE.ShaderMaterial;
      material.uniforms.uColor.value.copy(scratch.mist);
      material.uniforms.uOpacity.value = mistOpacity * (0.6 + 0.4 * Math.sin(time * 0.1 + index));
      material.uniforms.uTime.value = time;
    });
  });

  return (
    <>
      <mesh ref={skyMeshRef} renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[600, 48, 32]} />
        <shaderMaterial
          ref={skyRef}
          vertexShader={skyVertex}
          fragmentShader={skyFragment}
          uniforms={skyUniforms}
          side={THREE.BackSide}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      <mesh frustumCulled={false}>
        <planeGeometry args={[320, 260, 300, 240]} />
        <shaderMaterial
          ref={terrainRef}
          vertexShader={terrainVertex}
          fragmentShader={terrainFragment}
          uniforms={terrainUniforms}
        />
      </mesh>

      <mesh ref={waterMeshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, -90]} frustumCulled={false}>
        <planeGeometry args={[440, 360, 220, 180]} />
        <shaderMaterial
          ref={waterRef}
          vertexShader={waterVertex}
          fragmentShader={waterFragment}
          uniforms={waterUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      {mistPlacements.map((placement, index) => (
        <mesh
          key={index}
          ref={(node) => {
            mistRefs.current[index] = node;
          }}
          position={placement.position as unknown as [number, number, number]}
          scale={placement.scale}
          frustumCulled={false}
        >
          <planeGeometry args={[60, 26]} />
          <shaderMaterial
            vertexShader={mistVertex}
            fragmentShader={mistFragment}
            uniforms={mistUniforms[index]}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[particleSeeds, 4]} />
        </bufferGeometry>
        <shaderMaterial
          ref={particlesRef}
          vertexShader={particleVertex}
          fragmentShader={particleFragment}
          uniforms={particleUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <EffectComposer multisampling={0} frameBufferType={THREE.HalfFloatType}>
        <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.25} intensity={0.75} mipmapBlur radius={0.55} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette eskil={false} offset={0.18} darkness={0.5} />
        <Noise opacity={0.035} />
        <SMAA />
      </EffectComposer>
    </>
  );
}

export type ElementalWorldProps = {
  /** Continuous element progress, 0 (earth) → 4 (ether). */
  element: MotionValue<number>;
  reduced?: boolean;
  className?: string;
};

export function ElementalWorld({ element, reduced = false, className }: ElementalWorldProps) {
  const stateRef = useRef<FrameState>({
    pointer: { x: 0.5, y: 0.5 },
    pointerTarget: { x: 0.5, y: 0.5 },
    startedAt: 0
  });

  useEffect(() => {
    stateRef.current.startedAt = performance.now();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const state = stateRef.current;
    const handleMove = (event: PointerEvent) => {
      state.pointerTarget.x = event.clientX / window.innerWidth;
      state.pointerTarget.y = 1 - event.clientY / window.innerHeight;
    };
    const handleLeave = () => {
      state.pointerTarget.x = 0.5;
      state.pointerTarget.y = 0.5;
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, [reduced]);

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.35]}
        frameloop={reduced ? "demand" : "always"}
        camera={{ fov: 44, near: 0.5, far: 1400, position: [0, 34, 70] }}
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          toneMapping: THREE.NoToneMapping
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#2a2320"), 1);
        }}
      >
        <World stateRef={stateRef} element={element} reduced={reduced} />
      </Canvas>
    </div>
  );
}
