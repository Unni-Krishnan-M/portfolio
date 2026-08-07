"use client";

import { useEffect, useRef } from "react";
import { techMark } from "@/components/icons/tech";
import { seeded } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks";

type Node = {
  /** Must match a key in the techMark registry. */
  name: string;
  /** Percentage position inside the square stage. */
  x: number;
  y: number;
  /** Parallax depth multiplier — different depths sell the volume. */
  depth: number;
};

const NODES: Node[] = [
  { name: "Python", x: 48, y: 8, depth: 1 },
  { name: "FastAPI", x: 14, y: 33, depth: 0.55 },
  { name: "Next.js", x: 85, y: 36, depth: 0.82 },
  { name: "AI / ML", x: 14, y: 62, depth: 0.42 },
  { name: "MongoDB", x: 85, y: 65, depth: 0.94 },
  { name: "React", x: 41, y: 90, depth: 0.68 },
];

const RINGS = [
  { r: 181, dur: 48, reverse: false, opacity: 0.3 },
  { r: 143, dur: 66, reverse: true, opacity: 0.22 },
  { r: 105, dur: 36, reverse: false, opacity: 0.15 },
];

/**
 * The 2D layer that sits over the hero stage: faint dashed orbit rings plus the
 * glass technology pills. Each pill floats on its own loop and drifts with the
 * pointer at its own depth, so the group never moves as one flat sheet.
 */
export default function OrbitNodes() {
  const reduced = useReducedMotion();
  const pills = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };

    const tick = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      for (let i = 0; i < pills.current.length; i++) {
        const el = pills.current[i];
        if (!el) continue;
        const d = NODES[i].depth;
        el.style.transform = `translate3d(${(cx * 52 * d).toFixed(2)}px, ${(cy * 38 * d).toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div aria-hidden className="absolute inset-0">
        {RINGS.map((ring) => (
          <svg
            key={ring.r}
            viewBox="0 0 400 400"
            fill="none"
            className="absolute inset-0 size-full animate-spin-slow"
            style={{
              animationDuration: `${ring.dur}s`,
              animationDirection: ring.reverse ? "reverse" : "normal",
            }}
          >
            <circle
              cx="200"
              cy="200"
              r={ring.r}
              stroke="#1261ff"
              strokeOpacity={ring.opacity}
              strokeWidth="1"
              strokeDasharray="5 9"
            />
            <circle cx={200 + ring.r} cy="200" r="3.2" fill="#1261ff" fillOpacity="0.32" />
            <circle cx={200 - ring.r} cy="200" r="2.2" fill="#00c2ff" fillOpacity="0.4" />
          </svg>
        ))}
      </div>

      <ul aria-label="Core technologies" className="absolute inset-0 list-none">
        {NODES.map((n, i) => {
          const { node, tint } = techMark(n.name);
          const duration = 6.2 + seeded(i * 4.7) * 3.8;
          const delay = -seeded(i * 2.3) * duration;

          return (
            <li key={n.name} className="absolute" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <div
                ref={(el) => {
                  pills.current[i] = el;
                }}
                className="will-change-transform"
              >
                <div className="-translate-x-1/2 -translate-y-1/2">
                  <div
                    style={
                      reduced
                        ? undefined
                        : {
                            animation: `bm-float ${duration.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
                          }
                    }
                  >
                    <span className="flex items-center gap-2.5 rounded-full bg-white/95 py-2 pr-4 pl-2.5 shadow-soft ring-1 ring-line/70 backdrop-blur-sm">
                      <span
                        className="grid size-7 shrink-0 place-items-center rounded-full"
                        style={{ background: `${tint}12`, boxShadow: `inset 0 0 0 1px ${tint}26` }}
                      >
                        <span className="size-[1.05rem]">{node}</span>
                      </span>
                      <span className="text-[0.8rem] font-semibold whitespace-nowrap text-ink">
                        {n.name}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
