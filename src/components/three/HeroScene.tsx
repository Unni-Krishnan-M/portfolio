"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { lerp, seeded } from "@/lib/utils";
import GlassCube from "./GlassCube";

const BLUE = "#1261ff";
const ELECTRIC = "#00c2ff";

/** Frame-rate independent lerp factor — same feel at 60 and 144 Hz. */
const damp = (delta: number, smoothing = 0.0015) => 1 - Math.pow(smoothing, delta);

/* ------------------------------------------------------------------ */
/* Plinth                                                              */
/* ------------------------------------------------------------------ */

const RING_RADII = [1.34, 1.62, 1.9];

function Plinth() {
  return (
    <group position={[0, -1.5, 0]}>
      <mesh position={[0, -0.34, 0]} receiveShadow>
        <cylinderGeometry args={[2.02, 1.94, 0.2, 72]} />
        <meshStandardMaterial color="#f6faff" roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[1.72, 1.72, 0.14, 72]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.25}
          metalness={0.08}
          emissive={BLUE}
          emissiveIntensity={0.04}
        />
      </mesh>

      {RING_RADII.map((r, i) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08 + i * 0.06, 0]}>
          <torusGeometry args={[r, 0.019, 12, 110]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={i === 1 ? ELECTRIC : BLUE}
            emissiveIntensity={0.75 - i * 0.18}
            roughness={0.18}
            metalness={0.35}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Soft light pooling on the plinth surface. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial
          color={BLUE}
          transparent
          opacity={0.09}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Orbiting spheres                                                    */
/* ------------------------------------------------------------------ */

const ORBITERS = Array.from({ length: 8 }, (_, i) => ({
  radius: 2.45 + seeded(i * 3.7) * 1.15,
  speed: 0.14 + seeded(i * 5.1) * 0.2,
  phase: seeded(i * 9.3) * Math.PI * 2,
  tilt: 0.35 + seeded(i * 2.2) * 0.85,
  y: (seeded(i * 6.6) - 0.4) * 2.1,
  size: 0.055 + seeded(i * 8.8) * 0.08,
  glow: i % 3 === 0,
}));

function Orbiters() {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    for (let i = 0; i < ORBITERS.length; i++) {
      const m = meshes.current[i];
      if (!m) continue;
      const o = ORBITERS[i];
      const a = o.phase + t * o.speed;
      m.position.set(
        Math.cos(a) * o.radius,
        o.y + Math.sin(a * 1.3) * o.tilt,
        Math.sin(a) * o.radius * 0.55,
      );
    }
  });

  return (
    <group>
      {ORBITERS.map((o, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
        >
          <sphereGeometry args={[o.size, 20, 20]} />
          {o.glow ? (
            <meshStandardMaterial
              color="#ffffff"
              emissive={ELECTRIC}
              emissiveIntensity={2.4}
              roughness={0.2}
              toneMapped={false}
            />
          ) : (
            <meshStandardMaterial
              color={BLUE}
              roughness={0.1}
              metalness={0.6}
              emissive={BLUE}
              emissiveIntensity={0.35}
            />
          )}
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Particle field — one draw call                                      */
/* ------------------------------------------------------------------ */

function Particles({ count = 120 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.1 + seeded(i * 1.7) * 3.6;
      const a = seeded(i * 2.9) * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (seeded(i * 4.3) - 0.45) * 5.8;
      pos[i * 3 + 2] = Math.sin(a) * r * 0.7;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }, delta) => {
    const p = points.current;
    if (!p) return;
    p.rotation.y += delta * 0.032;
    p.position.y = Math.sin(clock.elapsedTime * 0.17) * 0.24;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.048}
        sizeAttenuation
        color={BLUE}
        transparent
        opacity={0.5}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Stage — pointer parallax + scroll dolly                             */
/* ------------------------------------------------------------------ */

function Stage({ onFirstFrame }: { onFirstFrame?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const frames = useRef(0);

  useFrame((state, delta) => {
    // Two frames in, WebGL has demonstrably produced output — tell the hero so
    // it can retire the CSS stage it was showing as a base layer.
    if (frames.current < 3) {
      frames.current += 1;
      if (frames.current === 2) onFirstFrame?.();
    }

    const g = group.current;
    if (!g) return;
    const k = damp(delta);
    const progress = window.__bmHero?.p ?? 0;

    g.rotation.y = lerp(g.rotation.y, state.pointer.x * 0.26, k);
    g.rotation.x = lerp(g.rotation.x, -state.pointer.y * 0.16, k);

    // Leaving the hero pulls the whole stage toward the viewer.
    g.position.z = lerp(g.position.z, progress * 1.7, k);
    g.position.y = lerp(g.position.y, 0.12 + progress * 0.35, k);
    g.scale.setScalar(lerp(g.scale.x, 1 + progress * 0.2, k));

    state.camera.position.x = lerp(state.camera.position.x, state.pointer.x * 0.42, k);
    state.camera.position.y = lerp(state.camera.position.y, state.pointer.y * 0.28, k);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group} position={[0, 0.12, 0]}>
      <GlassCube />
      <Plinth />
      <Orbiters />
      <Particles />
    </group>
  );
}

/* ------------------------------------------------------------------ */

export default function HeroScene({ onFirstFrame }: { onFirstFrame?: () => void }) {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} />
        <directionalLight position={[-5, 2, -4]} intensity={0.9} color="#c9dfff" />
        <pointLight position={[0, -2, 2]} intensity={9} distance={8} color={BLUE} />
        <pointLight position={[2.4, 2.6, 2.4]} intensity={6} distance={9} color={ELECTRIC} />

        {/* Each half gets its own boundary: if the environment probe is slow to
            resolve, the cube still renders rather than the whole scene stalling
            on a single suspended child. */}
        <Suspense fallback={null}>
          <Stage onFirstFrame={onFirstFrame} />
        </Suspense>

        {/* Locally generated studio env — gives the glass something to refract
            without depending on a remote HDRI. */}
        <Suspense fallback={null}>
          <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={3.4} position={[0, 4, -6]} scale={[14, 9, 1]} color="#ffffff" />
            <Lightformer form="rect" intensity={1.5} position={[-7, 1, 2]} scale={[9, 7, 1]} color="#dbe9ff" />
            <Lightformer form="rect" intensity={1.9} position={[7, 0.5, 2]} scale={[9, 7, 1]} color="#ffffff" />
            <Lightformer form="circle" intensity={2.2} position={[0, -5, 1]} scale={7} color="#9dc4ff" />
            <Lightformer form="rect" intensity={1.1} position={[0, 0, 8]} scale={[12, 12, 1]} color="#f7faff" />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
