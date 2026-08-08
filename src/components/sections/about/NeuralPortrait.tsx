"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { seeded, clamp, lerp } from "@/lib/utils";
import { useIsDesktop, useReducedMotion } from "@/lib/hooks";

/* ------------------------------------------------------------------ */
/* Deterministic geometry, generated once at module scope so the SSR    */
/* and client markup are byte-identical (no hydration mismatch).        */
/* ------------------------------------------------------------------ */

const VB = { w: 600, h: 640 };
const CX = 300;
const CY = 300;

const q = (n: number) => Math.round(n * 1e4) / 1e4;

// The 3D bust is code-split and desktop-only; the flat cut-out stays as the base.
const PortraitScene = dynamic(() => import("@/components/three/PortraitScene"), { ssr: false });

const NODES = Array.from({ length: 14 }, (_, i) => {
  const a = seeded(i * 2.7 + 1) * Math.PI * 2;
  const r = 150 + seeded(i * 5.3 + 4) * 145;
  return {
    // Rounded: raw Math.cos/sin differ in the last digits between Node and the
    // browser, which surfaces as a hydration mismatch.
    x: q(clamp(CX + Math.cos(a) * r * 1.02, 26, VB.w - 26)),
    y: q(clamp(CY + Math.sin(a) * r * 0.98, 34, VB.h - 40)),
    r: 2.1 + seeded(i * 9.1 + 7) * 2.7,
  };
});

/** Two links per node, deterministically chosen — reads as a mesh, not a ring. */
const LINKS = NODES.flatMap((n, i) =>
  [1, 2].map((k) => {
    const j = (i + k + Math.floor(seeded(i * 3.7 + k * 11) * 3)) % NODES.length;
    const t = NODES[j];
    return { id: `${i}-${k}-${j}`, x1: n.x, y1: n.y, x2: t.x, y2: t.y };
  }),
);

const CROSSHAIRS = [
  { x: 168, y: 200 },
  { x: 132, y: 452 },
  { x: 486, y: 262 },
  { x: 520, y: 512 },
];

const ORBITS = [
  { rx: 258, ry: 214, rot: -22, dur: 74 },
  { rx: 212, ry: 268, rot: 34, dur: 96 },
  { rx: 288, ry: 150, rot: 12, dur: 118 },
];

/* Cursive "Unni" — a decorative flourish, not a real signature scan. */
/* Cursive "Unni" — four strokes plus an underline, drawn in sequence. A
   decorative flourish, not a scan of a real signature. */
const SIG_U = "M12 16C9 50 18 79 39 76C57 73 61 47 61 16";
const SIG_N1 = "M66 78C66 60 68 47 77 46C87 45 89 58 89 78";
const SIG_N2 = "M95 78C95 60 97 47 106 46C116 45 118 58 118 78";
const SIG_I = "M126 78C126 66 127 56 128 48";
const SIG_DOT = "M129 34C129.6 34 130 34.5 130 35";
const SIG_FLOURISH = "M8 94C58 108 142 104 190 86";

export default function NeuralPortrait() {
  const root = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [bust3d, setBust3d] = useState(false);
  const use3D = isDesktop && !reduced;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const links = el.querySelectorAll<SVGLineElement>("[data-nn-link]");
      const nodes = el.querySelectorAll<SVGCircleElement>("[data-nn-node]");
      const arcs = el.querySelectorAll<SVGEllipseElement>("[data-nn-arc]");
      const sig = el.querySelectorAll<SVGPathElement>("[data-nn-sig]");

      if (reduced) {
        gsap.set([...links, ...arcs, ...sig], { drawSVG: "100%" });
        gsap.set(nodes, { opacity: 0.75, scale: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
      });

      tl.from(links, {
        drawSVG: 0,
        duration: 1.3,
        stagger: { each: 0.035, from: "random" },
        ease: "power2.inOut",
      })
        .from(
          nodes,
          { scale: 0, opacity: 0, duration: 0.5, stagger: 0.03, ease: "back.out(2)" },
          0.35,
        )
        .from(arcs, { drawSVG: 0, duration: 2.2, stagger: 0.22, ease: "power1.inOut" }, 0.2)
        .from(sig, { drawSVG: 0, duration: 1.5, stagger: 0.35, ease: "power1.inOut" }, 1.05);

      // Nodes breathe on staggered loops so the mesh never sits still.
      const pulse = gsap.to(nodes, {
        scale: 1.55,
        opacity: 0.5,
        duration: 1.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.22, from: "random" },
        transformOrigin: "center",
        delay: 1.6,
      });

      // Long elliptical sweeps around the figure.
      const spins = Array.from(arcs).map((arc, i) =>
        gsap.to(arc, {
          rotate: i % 2 ? -360 : 360,
          duration: ORBITS[i]?.dur ?? 90,
          repeat: -1,
          ease: "none",
          svgOrigin: `${CX} ${CY}`,
        }),
      );

      return () => {
        tl.kill();
        pulse.kill();
        spins.forEach((s) => s.kill());
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  // Damped pointer parallax on the figure — ±6px, no React state per frame.
  useGSAP(
    () => {
      const el = tilt.current;
      if (!el || reduced) return;
      if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;

      let tx = 0;
      let ty = 0;
      let cx = 0;
      let cy = 0;

      const onMove = (e: PointerEvent) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 12;
        ty = (e.clientY / window.innerHeight - 0.5) * 12;
      };
      const tick = () => {
        cx = lerp(cx, tx, 0.05);
        cy = lerp(cy, ty, 0.05);
        el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      gsap.ticker.add(tick);
      return () => {
        window.removeEventListener("pointermove", onMove);
        gsap.ticker.remove(tick);
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className="relative mx-auto w-full max-w-[26rem] sm:max-w-[30rem] lg:max-w-[34rem]">
      <div className="relative aspect-[920/1021]">
        {/* soft blue glow sphere sitting behind the head */}
        <div
          aria-hidden
          className="animate-float absolute top-[24%] left-[52%] size-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(18_97_255/0.15),rgb(0_194_255/0.07)_52%,transparent_72%)]"
        />
        <div
          aria-hidden
          className="absolute top-[26%] left-[52%] size-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue/10"
        />

        {/* dot-grid patch */}
        <div
          aria-hidden
          className="dot-grid absolute top-[44%] left-[2%] h-[11%] w-[18%] opacity-70"
          style={{
            maskImage: "radial-gradient(circle at 30% 40%, black, transparent 78%)",
            WebkitMaskImage: "radial-gradient(circle at 30% 40%, black, transparent 78%)",
          }}
        />

        {/* neural mesh — behind the figure */}
        <svg
          aria-hidden
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className="absolute inset-0 h-full w-full"
        >
          <g stroke="#1261ff" strokeWidth="0.9" opacity="0.34">
            {LINKS.map((l) => (
              <line key={l.id} data-nn-link x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
            ))}
          </g>
          <g fill="#1261ff">
            {NODES.map((n, i) => (
              <circle key={i} data-nn-node cx={n.x} cy={n.y} r={n.r} opacity="0.75" />
            ))}
          </g>
          <g stroke="#1261ff" strokeWidth="1.1" opacity="0.4">
            {CROSSHAIRS.map((c) => (
              <g key={`${c.x}-${c.y}`}>
                <line x1={c.x - 6} y1={c.y} x2={c.x + 6} y2={c.y} />
                <line x1={c.x} y1={c.y - 6} x2={c.x} y2={c.y + 6} />
              </g>
            ))}
          </g>
        </svg>

        {/* The figure. The flat cut-out is the base layer — alpha-feathered on
            every edge, so it sits directly on the page background with no frame.
            The displaced 3D bust fades in over it once WebGL reports a frame. */}
        <div
          ref={tilt}
          className="absolute inset-0 flex items-end justify-center transition-opacity duration-700 will-change-transform"
          style={{ opacity: bust3d ? 0 : 1 }}
        >
          <Image
            src="/img/unni-portrait.webp"
            alt="Unni Krishnan M"
            width={920}
            height={1021}
            priority={false}
            sizes="(min-width: 1024px) 34rem, 90vw"
            className="h-full w-auto object-contain"
          />
        </div>

        {use3D ? (
          <div
            aria-hidden
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: bust3d ? 1 : 0 }}
          >
            <PortraitScene onFirstFrame={() => setBust3d(true)} />
          </div>
        ) : null}

        {/* long orbital sweeps — in front, so they wrap the figure */}
        <svg
          aria-hidden
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="bm-orbit-arc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1261ff" stopOpacity="0" />
              <stop offset="45%" stopColor="#1261ff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#00c2ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* base tilt lives on the <g> so GSAP owns the ellipse transform outright */}
          {ORBITS.map((o, i) => (
            <g key={i} transform={`rotate(${o.rot} ${CX} ${CY})`}>
              <ellipse
                data-nn-arc
                cx={CX}
                cy={CY}
                rx={o.rx}
                ry={o.ry}
                fill="none"
                stroke="url(#bm-orbit-arc)"
                strokeWidth={i === 0 ? 1.4 : 1}
              />
            </g>
          ))}
        </svg>

        {/* handwritten flourish, overlapping the lower fade */}
        <svg
          aria-hidden
          viewBox="0 0 210 110"
          className="pointer-events-none absolute right-[1%] bottom-[3%] w-[42%] max-w-[13rem]"
          fill="none"
          stroke="#1261ff"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path data-nn-sig d={SIG_U} />
          <path data-nn-sig d={SIG_N1} />
          <path data-nn-sig d={SIG_N2} />
          <path data-nn-sig d={SIG_I} />
          <path data-nn-sig d={SIG_DOT} strokeWidth="6" strokeLinecap="round" />
          <path data-nn-sig d={SIG_FLOURISH} strokeWidth="2.6" opacity="0.65" />
        </svg>
      </div>
    </div>
  );
}
