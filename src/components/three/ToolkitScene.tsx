"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, Lightformer } from "@react-three/drei";
import { orbits } from "@/data/profile";
import { techMark } from "@/components/icons/tech";
import { lerp, seeded } from "@/lib/utils";

const BLUE = "#1261ff";
const ELECTRIC = "#00c2ff";

const damp = (delta: number, smoothing = 0.0018) => 1 - Math.pow(smoothing, delta);

/** One entry per technology, laid out on three tilted rings in real 3D. */
type Node = {
  name: string;
  ring: number;
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  size: number;
};

const NODES: Node[] = orbits.flatMap((o, ring) =>
  o.names.map((name, i) => ({
    name,
    ring,
    radius: 1.55 + ring * 0.72,
    // Alternate direction per ring so the system reads as a mechanism.
    speed: (ring % 2 === 0 ? 1 : -1) * (0.2 - ring * 0.04),
    phase: (i / o.names.length) * Math.PI * 2 + ring * 0.5,
    tilt: 0.22 + ring * 0.19,
    size: 0.2 - ring * 0.018,
  })),
);

/** The `UK` core: a faceted icosahedron that breathes and counter-rotates. */
function Core() {
  const group = useRef<THREE.Group>(null);
  const wire = useRef<THREE.LineSegments>(null);

  const wireGeo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.02, 1);
    const e = new THREE.EdgesGeometry(g);
    g.dispose();
    return e;
  }, []);
  useEffect(() => () => wireGeo.dispose(), [wireGeo]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += delta * 0.16;
      group.current.rotation.x = Math.sin(t * 0.3) * 0.16;
      const s = 1 + Math.sin(t * 0.9) * 0.03;
      group.current.scale.setScalar(s);
    }
    if (wire.current) wire.current.rotation.y -= delta * 0.28;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial
          color={BLUE}
          roughness={0.16}
          metalness={0.55}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={ELECTRIC}
          emissiveIntensity={0.28}
          envMapIntensity={2}
        />
      </mesh>

      <lineSegments ref={wire} geometry={wireGeo}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.42} toneMapped={false} />
      </lineSegments>

      <Html center distanceFactor={5.4} style={{ pointerEvents: "none" }} zIndexRange={[30, 0]}>
        <span className="text-[1.7rem] leading-none font-extrabold tracking-tighter text-white drop-shadow-[0_2px_10px_rgba(7,26,61,0.5)]">
          UK
        </span>
      </Html>

      {/* halo */}
      <mesh scale={1.5}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={ELECTRIC}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** A thin ring drawn as a flat torus, tilted to sit in the orbit's plane. */
function Ring({ radius, tilt }: { radius: number; tilt: number }) {
  return (
    <mesh rotation={[Math.PI / 2 - tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.006, 8, 128]} />
      <meshBasicMaterial color={BLUE} transparent opacity={0.28} toneMapped={false} />
    </mesh>
  );
}

function Orbiters({ activeName }: { activeName: string | null }) {
  const refs = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const k = damp(delta);

    NODES.forEach((n, i) => {
      const g = refs.current[i];
      if (!g) return;

      const a = n.phase + t * n.speed;
      const active = activeName === n.name;

      // Hovering pulls the node in toward the core and scales it up — the same
      // affordance the CSS version had, now with real depth.
      const targetRadius = active ? n.radius * 0.6 : n.radius;
      const r = lerp(g.userData.r ?? n.radius, targetRadius, k);
      g.userData.r = r;

      g.position.set(
        Math.cos(a) * r,
        Math.sin(a) * r * Math.sin(n.tilt) + Math.sin(t * 0.6 + i) * 0.06,
        Math.sin(a) * r * Math.cos(n.tilt),
      );

      const s = lerp(g.scale.x, active ? 1.65 : 1, k);
      g.scale.setScalar(s);
    });
  });

  return (
    <group>
      {NODES.map((n, i) => (
        <group
          key={n.name}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <mesh>
            <sphereGeometry args={[n.size, 24, 24]} />
            <meshPhysicalMaterial
              color={activeName === n.name ? ELECTRIC : "#ffffff"}
              roughness={0.14}
              metalness={0.35}
              clearcoat={1}
              emissive={activeName === n.name ? ELECTRIC : BLUE}
              emissiveIntensity={activeName === n.name ? 1.5 : 0.3}
              envMapIntensity={2.2}
              toneMapped={false}
            />
          </mesh>
          {/* trailing glow */}
          <mesh scale={2.1}>
            <sphereGeometry args={[n.size, 16, 16]} />
            <meshBasicMaterial
              color={activeName === n.name ? ELECTRIC : BLUE}
              transparent
              opacity={activeName === n.name ? 0.22 : 0.08}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          {/* Icon + name as a DOM overlay tracking the node in 3D. Anonymous
              spheres read as decoration; labelled ones read as a toolkit.
              `distanceFactor` shrinks them with depth, which sells the 3D. */}
          <Html
            center
            distanceFactor={7}
            style={{ pointerEvents: "none" }}
            zIndexRange={[20, 0]}
          >
            <span
              className="flex -translate-y-[2.1rem] items-center gap-1.5 rounded-full border border-line bg-white/95 px-2 py-1 shadow-soft backdrop-blur-sm"
              style={{
                transform: `scale(${activeName === n.name ? 1.15 : 1})`,
                borderColor: activeName === n.name ? "rgba(18,97,255,0.5)" : undefined,
              }}
            >
              <span className="size-3.5 shrink-0">{techMark(n.name).node}</span>
              <span className="text-[0.62rem] font-semibold whitespace-nowrap text-ink">
                {n.name}
              </span>
            </span>
          </Html>
        </group>
      ))}
    </group>
  );
}

/** Sparse dust so the space between rings isn't empty. */
function Dust({ count = 140 }: { count?: number }) {
  const pts = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.2 + seeded(i * 2.3) * 3.4;
      const a = seeded(i * 3.7) * Math.PI * 2;
      const y = (seeded(i * 5.9) - 0.5) * 2.6;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((_, delta) => {
    if (pts.current) pts.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={pts} geometry={geo}>
      <pointsMaterial
        size={0.035}
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

function Rig({ activeName }: { activeName: string | null }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const k = damp(delta);
    // Whole system tilts toward the pointer.
    g.rotation.y = lerp(g.rotation.y, state.pointer.x * 0.5, k);
    g.rotation.x = lerp(g.rotation.x, -state.pointer.y * 0.32, k);
  });

  return (
    <group ref={group}>
      <Core />
      {orbits.map((_, ring) => (
        <Ring key={ring} radius={1.55 + ring * 0.72} tilt={0.22 + ring * 0.19} />
      ))}
      <Orbiters activeName={activeName} />
      <Dust />
    </group>
  );
}

export default function ToolkitScene({
  activeName = null,
  onFirstFrame,
}: {
  /** Name of the hovered technology, so the 3D node can respond. */
  activeName?: string | null;
  onFirstFrame?: () => void;
}) {
  const frames = useRef(0);

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        // Centred and pulled back so the outer ring plus its labels sit inside
        // the square frame with margin, rather than clipping at the edges.
        camera={{ position: [0, 0, 9.4], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 5, 5]} intensity={2} />
        <directionalLight position={[-5, -2, -4]} intensity={0.7} color="#cfe3ff" />
        <pointLight position={[0, 0, 0]} intensity={6} distance={5} color={ELECTRIC} />

        <Suspense fallback={null}>
          <FrameProbe
            onFirstFrame={() => {
              if (frames.current === 0) {
                frames.current = 1;
                onFirstFrame?.();
              }
            }}
          />
          <Rig activeName={activeName} />
        </Suspense>

        <Suspense fallback={null}>
          <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={3} position={[0, 4, -5]} scale={[12, 8, 1]} color="#ffffff" />
            <Lightformer form="rect" intensity={1.6} position={[-6, 0, 3]} scale={[8, 6, 1]} color="#dbe9ff" />
            <Lightformer form="rect" intensity={1.6} position={[6, 0, 3]} scale={[8, 6, 1]} color="#ffffff" />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

/** Reports upward once WebGL has actually produced frames. */
function FrameProbe({ onFirstFrame }: { onFirstFrame: () => void }) {
  const n = useRef(0);
  useFrame(() => {
    if (n.current < 3) {
      n.current += 1;
      if (n.current === 2) onFirstFrame();
    }
  });
  return null;
}
