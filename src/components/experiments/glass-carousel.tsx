"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Text, Image as DreiImage, ScrollControls, useScroll, Environment } from "@react-three/drei";
import * as THREE from "three";

const testimonials = [
  { id: 1, name: "Jane Doe", role: "CTO, TechCorp", text: "Nirmal transformed our data pipelines. Absolute genius.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=800" },
  { id: 2, name: "John Smith", role: "VP Eng, DataInc", text: "The most reliable engineer I've ever worked with.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600&h=800" },
  { id: 3, name: "Alice Lee", role: "Director, AI Solutions", text: "Outstanding architecture and flawless execution.", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600&h=800" },
  { id: 4, name: "Bob Chen", role: "Founder, StartupX", text: "Delivered 10x value in half the expected time.", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600&h=800" },
];

function Carousel() {
  const group = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const radius = 3.5;
  const count = testimonials.length;

  useFrame((state, delta) => {
    if (group.current) {
      const targetRotation = scroll.offset * Math.PI * 2;
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        targetRotation,
        4,
        delta
      );
    }
  });

  return (
    <group ref={group}>
      {testimonials.map((item, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        return (
          <group key={item.id} position={[x, 0, z]} rotation={[0, Math.PI + angle, 0]}>
            <mesh position={[0, 0, 0.1]}>
              <boxGeometry args={[3, 4, 0.1]} />
              <MeshTransmissionMaterial 
                backside
                samples={4}
                thickness={0.5}
                chromaticAberration={0.06}
                anisotropy={0.1}
                distortion={0.2}
                distortionScale={0.5}
                temporalDistortion={0.1}
                transmission={1}
                roughness={0.15}
                ior={1.5}
                color="#ffffff"
              />
            </mesh>

            {/* We must wrap image in Suspense if we want to be completely safe, 
                but DreiImage usually handles it, or we can use normal textures. */}
            <DreiImage url={item.img} position={[0, 0, -0.1]} scale={[2.8, 3.8]} />
            
            <Text 
              position={[0, -1.2, 0.2]} 
              fontSize={0.25} 
              color="#ffffff" 
              anchorX="center" 
              anchorY="middle"
            >
              {item.name}
            </Text>
            <Text 
              position={[0, -1.5, 0.2]} 
              fontSize={0.15} 
              color="#dddddd" 
              anchorX="center" 
              anchorY="middle"
            >
              {item.role}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export function GlassCarousel() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#050505', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
        <ScrollControls pages={testimonials.length} infinite>
          <Carousel />
        </ScrollControls>
      </Canvas>
      <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', color: 'white', zIndex: 10, pointerEvents: 'none', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Client Testimonials</h1>
        <p style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: '0.5rem' }}>Scroll to explore</p>
      </div>
    </div>
  );
}

