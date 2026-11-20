"use client";

import * as React from "react";
import { useRef, useMemo } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================
// OPTIMIZED VOLUMETRIC STORM SHADER
// ==========================================

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uResolution;
  uniform float uLightningIntensity;
  uniform vec3 uLightningPos;

  // --- 3D Noise Functions ---
  float hash(vec3 p) {
      p = fract(p * 0.3183099 + .1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                     mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                 mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                     mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }

  // FBM for cloud texture (Optimized to 4 octaves for performance)
  float fbm(vec3 p) {
      float f = 0.0;
      float amp = 0.5;
      for(int i = 0; i < 4; i++) {
          f += amp * noise(p);
          p *= 2.02;
          amp *= 0.5;
      }
      return f;
  }

  // --- Volume Density ---
  float map(vec3 p) {
      // Thick horizontal slab
      float d = 1.0 - abs(p.y * 0.3); 
      
      // Complex stormy texture
      float n = fbm(p * 1.5 + uTime * 0.2);
      float density = (d + n - 0.6) * 2.5;
      
      // The Scroll Hole: camera flies through this opening
      float distToCenter = length(p.xy);
      float holeRadius = pow(uScroll, 3.0) * 20.0; 
      float edgeNoise = fbm(p * 2.5) * 2.0;
      
      density -= smoothstep(holeRadius + 4.0 + edgeNoise, holeRadius, distToCenter) * 3.0;

      return clamp(density, 0.0, 1.0);
  }

  void main() {
      // Center and correct aspect ratio
      vec2 uv = (vUv - 0.5) * 2.0;
      uv.x *= uResolution.x / uResolution.y;
      
      // Camera Fly-Through
      vec3 ro = vec3(0.0, 0.0, 8.0 - uScroll * 22.0);
      vec3 rd = normalize(vec3(uv, -1.0));
      
      // --- Dark Dramatic Aesthetic ---
      vec3 sunDir = normalize(vec3(0.4, 0.8, 0.2));
      vec3 sunColor = vec3(0.5, 0.55, 0.6); // Muted moon/sun light
      vec3 skyColor = vec3(0.08, 0.1, 0.12); // Deep dark grey storm
      vec3 shadowColor = vec3(0.01, 0.015, 0.02); // Almost pitch black
      
      // Electric Blue Lightning
      vec3 lightningColor = vec3(0.5, 0.8, 1.0) * 6.0; 
      
      vec4 sum = vec4(0.0);
      float t = 0.0;
      
      // Optimized Raymarching Loop (50 steps max)
      for(int i = 0; i < 50; i++) {
          if (sum.a > 0.99) break;
          
          vec3 p = ro + rd * t;
          float density = map(p);
          
          if (density > 0.01) {
              // Direct Lighting Scattering
              float h = 0.25;
              float shadowDensity = map(p + sunDir * h);
              float transmittance = exp(-shadowDensity * 3.0);
              
              vec3 ambient = mix(shadowColor, skyColor, density);
              vec3 cloudColor = ambient + sunColor * transmittance;
              
              // --- Dynamic Lightning Effect ---
              float distToLightning = length(p - uLightningPos);
              // Light decays rapidly with distance through the dense cloud
              float lightningAtten = exp(-distToLightning * 0.9);
              cloudColor += lightningColor * lightningAtten * uLightningIntensity;
              
              // Accumulate
              float alpha = (1.0 - sum.a) * density * 0.25;
              sum.rgb += cloudColor * alpha;
              sum.a += alpha;
          }
          
          // Exponential step size for optimization
          t += 0.05 + 0.06 * t;
      }
      
      gl_FragColor = vec4(clamp(sum.rgb, 0.0, 1.0), sum.a);
  }
`;

function RaymarchedCloudScene({ progress }: { progress: MotionValue<number> }) {
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uLightningIntensity: { value: 0 },
      uLightningPos: { value: new THREE.Vector3(0, 0, 0) },
    }),
    [size]
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = progress.get();

    // --- Dynamic Lightning Controller ---
    // Random chance to strike if it's currently dark
    if (Math.random() > 0.985 && uniforms.uLightningIntensity.value < 0.1) {
      // Strike!
      uniforms.uLightningIntensity.value = 1.0;
      
      // Spawn lightning somewhere deep in the cloud volume
      uniforms.uLightningPos.value.set(
        (Math.random() - 0.5) * 12, // X offset
        (Math.random() - 0.5) * 6,  // Y offset
        -Math.random() * 8          // Deep in Z
      );
    } else {
      // Fade out (decay)
      uniforms.uLightningIntensity.value *= 0.85; 
    }
  });

  return (
    <mesh>
      {/* 2x2 Plane exactly fills clip space when paired with an orthographic camera at [0,0,1] */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}

export function AboutDissolve() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 15,
    mass: 1,
    restDelta: 0.001
  });

  const textY = useTransform(smoothProgress, [0.4, 0.9], ["10vh", "0vh"]);
  const textOpacity = useTransform(smoothProgress, [0.4, 0.8], [0, 1]);
  const textBlur = useTransform(smoothProgress, [0.4, 0.7], ["blur(15px)", "blur(0px)"]);

  const titleStyle = {
    fontFamily: 'var(--font-serif)',
  };

  const bodyStyle = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#e8ecef' // Lighter text to contrast with the dark storm background
  };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full"
      style={{ height: "300vh", backgroundColor: "#0a0c0e" }} // Dark background for the storm
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* --- THE TEXT (Revealed underneath) --- */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0"
          style={{ y: textY, opacity: textOpacity, filter: textBlur }}
        >
          <h2 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-white drop-shadow-lg"
            style={titleStyle}
          >
            BEYOND THE PIPELINE.
          </h2>
          <div className="max-w-2xl mx-auto space-y-6 text-lg md:text-xl leading-relaxed" style={bodyStyle}>
            <p>
              The digital world is not just built on code; it is woven from vast, unseen architectures. I specialize in parting the clouds of complexity, crafting clear, resilient, and scalable data ecosystems.
            </p>
            <p>
              I am Nirmal. A Data Engineer dedicated to turning the abstract chaos of raw information into the tangible foundation of tomorrow's enterprise intelligence.
            </p>
          </div>
        </motion.div>

        {/* --- PURE MATHEMATICAL VOLUMETRIC RAYMARCHING --- */}
        {/* Sits at z-10, masking the text until you fly through the hole */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* OrthographicCamera ensures the 2x2 plane flawlessly covers the screen geometry, fixing the blank screen bug */}
          <Canvas>
            {/* @ts-expect-error R3F v9 types issue with makeDefault */}
            <orthographicCamera makeDefault args={[-1, 1, 1, -1]} position={[0, 0, 1]} />
            <RaymarchedCloudScene progress={smoothProgress} />
          </Canvas>
        </div>

      </div>
    </section>
  );
}
