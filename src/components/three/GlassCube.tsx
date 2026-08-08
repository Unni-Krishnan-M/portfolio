"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

const BLUE = "#1261ff";

/**
 * "UK" painted onto a canvas rather than loaded through a font atlas — the mark
 * is the whole point of the centrepiece, so it must never depend on a fetch.
 */
function useWordmark() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);

  useEffect(() => {
    const canvas = texture.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const family =
        getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
      ctx.clearRect(0, 0, 512, 512);
      ctx.font = `800 268px ${family}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = BLUE;
      ctx.fillText("UK", 256, 276);
      // Flagging a THREE.Texture dirty is how the three.js API works; the
      // compiler can't tell this apart from mutating a memoized React value.
      // eslint-disable-next-line react-hooks/immutability
      texture.needsUpdate = true;
    };

    draw();
    let alive = true;
    // Redraw once the real display face has loaded so the mark matches the page.
    document.fonts?.ready.then(() => {
      if (alive) draw();
    });

    return () => {
      alive = false;
    };
  }, [texture]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}

/**
 * The centrepiece: a slowly tumbling transmission-glass cube with the wordmark
 * suspended inside it, so the letters read through the refraction.
 */
export default function GlassCube() {
  const spin = useRef<THREE.Group>(null);
  const wordmark = useWordmark();

  const edges = useMemo(() => {
    const box = new THREE.BoxGeometry(2.17, 2.17, 2.17);
    const geo = new THREE.EdgesGeometry(box);
    box.dispose();
    return geo;
  }, []);

  useEffect(() => () => edges.dispose(), [edges]);

  useFrame((state, delta) => {
    const g = spin.current;
    if (!g) return;
    g.rotation.y += delta * 0.2;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.34) * 0.14;
    g.rotation.z = Math.sin(state.clock.elapsedTime * 0.21) * 0.05;
  });

  return (
    <group>
      {/* Behind the glass so it arrives at the camera refracted, as in the design. */}
      <mesh position={[0, 0.02, -0.3]} renderOrder={-1}>
        <planeGeometry args={[2.05, 2.05]} />
        <meshBasicMaterial
          map={wordmark}
          transparent
          toneMapped={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={spin} rotation={[0, 0.6, 0]}>
        {/* Plain alpha-blended physical glass rather than `transmission`. With a
            transparent canvas there is no backdrop to refract, so a transmissive
            material renders as a flat opaque block and swallows the wordmark.
            `depthWrite={false}` lets the back faces and the mark inside stay
            visible, which is what reads as glass. */}
        <RoundedBox args={[2.16, 2.16, 2.16]} radius={0.11} smoothness={3} bevelSegments={3}>
          <meshPhysicalMaterial
            color="#8fbaff"
            transparent
            opacity={0.5}
            depthWrite={false}
            side={THREE.DoubleSide}
            roughness={0.02}
            metalness={0.1}
            ior={1.6}
            clearcoat={1}
            clearcoatRoughness={0.02}
            specularIntensity={2}
            specularColor="#ffffff"
            envMapIntensity={3.4}
            iridescence={0.9}
            iridescenceIOR={1.4}
            iridescenceThicknessRange={[120, 560]}
            sheen={1}
            sheenRoughness={0.25}
            sheenColor="#4d8cff"
            emissive="#1261ff"
            emissiveIntensity={0.12}
          />
        </RoundedBox>

        {/* Inner core — refracted through the shell it gives the crystal depth
            instead of reading as an empty box. */}
        <mesh scale={0.46}>
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#1261ff"
            transparent
            opacity={0.3}
            roughness={0.1}
            metalness={0.4}
            emissive="#00c2ff"
            emissiveIntensity={0.5}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* Hairline edges keep the silhouette readable against a white page. */}
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={BLUE} transparent opacity={0.85} toneMapped={false} />
        </lineSegments>
      </group>
    </group>
  );
}
