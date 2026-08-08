"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { lerp, seeded } from "@/lib/utils";

const BLUE = "#1261ff";
const ELECTRIC = "#00c2ff";

const damp = (delta: number, smoothing = 0.0016) => 1 - Math.pow(smoothing, delta);

/** Portrait aspect — must match the source maps. */
const ASPECT = 920 / 1021;
const PLANE_H = 4.6;
const PLANE_W = PLANE_H * ASPECT;

/**
 * The portrait as actual geometry.
 *
 * A finely subdivided plane displaced by a depth map derived from the photo, so
 * the silhouette really moves in space rather than being a picture that tilts.
 * The normal map is what makes the relief *light* correctly — `displacementMap`
 * alone moves vertices but leaves the shading flat.
 */
function PortraitMesh() {
  const mesh = useRef<THREE.Mesh>(null);

  const [color, alpha, depth, normal] = useLoader(THREE.TextureLoader, [
    "/img/unni-color.webp",
    "/img/unni-alpha.webp",
    "/img/unni-depth.webp",
    "/img/unni-normal.webp",
  ]);

  useEffect(() => {
    // Configuring a THREE.Texture is mutation by design — the three.js API has
    // no immutable path for colour space or anisotropy. Same exception as
    // GlassCube's `needsUpdate`.
    /* eslint-disable react-hooks/immutability */
    color.colorSpace = THREE.SRGBColorSpace;
    [color, alpha, depth, normal].forEach((t) => {
      t.anisotropy = 4;
      t.needsUpdate = true;
    });
    /* eslint-enable react-hooks/immutability */
  }, [color, alpha, depth, normal]);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const k = damp(delta);
    // Small rotation only. The point is to reveal the relief's parallax, not to
    // spin a photograph — past ~12° the displaced silhouette starts to tear.
    m.rotation.y = lerp(m.rotation.y, state.pointer.x * 0.2, k);
    m.rotation.x = lerp(m.rotation.x, -state.pointer.y * 0.12, k);
    m.position.y = lerp(m.position.y, Math.sin(state.clock.elapsedTime * 0.4) * 0.05, k);
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[PLANE_W, PLANE_H, 320, 340]} />
      <meshStandardMaterial
        map={color}
        alphaMap={alpha}
        displacementMap={depth}
        displacementScale={0.62}
        displacementBias={-0.14}
        normalMap={normal}
        normalScale={new THREE.Vector2(1.15, 1.15)}
        transparent
        alphaTest={0.06}
        roughness={0.72}
        metalness={0.05}
        envMapIntensity={0.55}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

/**
 * Data nodes orbiting *behind* the bust.
 *
 * The whole group is pushed back to z = ORBIT_Z and the radius is capped so the
 * furthest-forward node still sits behind the portrait plane. Orbiting around
 * the bust instead put spheres directly on his cheek and ear, which read as
 * blemishes rather than depth.
 */
const ORBIT_Z = -2.9;
const NODES = Array.from({ length: 16 }, (_, i) => ({
  radius: 1.2 + seeded(i * 3.3) * 1.2,
  speed: 0.1 + seeded(i * 5.1) * 0.16,
  phase: seeded(i * 7.7) * Math.PI * 2,
  y: (seeded(i * 2.9) - 0.45) * 4.0,
  size: 0.05 + seeded(i * 9.1) * 0.07,
  bright: i % 4 === 0,
}));

function DataNodes() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const lines = useRef<THREE.LineSegments>(null);

  // Edges between nearby nodes, recomputed each frame into a fixed buffer so the
  // mesh reads as a live network rather than a static graph.
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(NODES.length * 6), 3));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pos: THREE.Vector3[] = [];

    NODES.forEach((n, i) => {
      const m = refs.current[i];
      const a = n.phase + t * n.speed;
      const p = new THREE.Vector3(
        Math.cos(a) * n.radius,
        n.y + Math.sin(a * 1.6) * 0.18,
        Math.sin(a) * n.radius,
      );
      pos.push(p);
      if (m) m.position.copy(p);
    });

    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    let w = 0;
    for (let i = 0; i < pos.length && w + 6 <= arr.length; i++) {
      const next = pos[(i + 1) % pos.length];
      if (pos[i].distanceTo(next) < 2.6) {
        arr[w++] = pos[i].x; arr[w++] = pos[i].y; arr[w++] = pos[i].z;
        arr[w++] = next.x;   arr[w++] = next.y;   arr[w++] = next.z;
      }
    }
    while (w < arr.length) arr[w++] = 0;
    attr.needsUpdate = true;
  });

  return (
    <group position={[0, 0, ORBIT_Z]}>
      {NODES.map((n, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <sphereGeometry args={[n.size, 14, 14]} />
          <meshStandardMaterial
            color={n.bright ? ELECTRIC : BLUE}
            emissive={n.bright ? ELECTRIC : BLUE}
            emissiveIntensity={n.bright ? 2.2 : 0.8}
            roughness={0.3}
            toneMapped={false}
          />
        </mesh>
      ))}

      <lineSegments ref={lines} geometry={geo}>
        <lineBasicMaterial color={BLUE} transparent opacity={0.3} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const k = damp(delta, 0.004);
    g.rotation.y = lerp(g.rotation.y, state.pointer.x * 0.1, k);
  });

  return (
    <group ref={group}>
      <PortraitMesh />
      <DataNodes />
    </group>
  );
}

export default function PortraitScene({ onFirstFrame }: { onFirstFrame?: () => void }) {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.6]}
        frameloop="always"
        camera={{ position: [0, 0, 6.2], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1.15} />
        {/* Key light from the upper left, matching the photograph's own light so
            the generated relief agrees with the baked shading. */}
        <directionalLight position={[-3.2, 3.6, 4]} intensity={2.1} />
        <directionalLight position={[4, 1, 2]} intensity={0.7} color="#dceaff" />
        <pointLight position={[0, -1.6, 2.4]} intensity={3} distance={7} color={BLUE} />

        <Suspense fallback={null}>
          <FrameProbe onFirstFrame={onFirstFrame} />
          <Rig />
        </Suspense>

        <Suspense fallback={null}>
          <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={2.4} position={[0, 3, -4]} scale={[10, 7, 1]} color="#ffffff" />
            <Lightformer form="rect" intensity={1.4} position={[-5, 0, 3]} scale={[7, 6, 1]} color="#dbe9ff" />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

function FrameProbe({ onFirstFrame }: { onFirstFrame?: () => void }) {
  const n = useRef(0);
  useFrame(() => {
    if (n.current < 3) {
      n.current += 1;
      if (n.current === 2) onFirstFrame?.();
    }
  });
  return null;
}
