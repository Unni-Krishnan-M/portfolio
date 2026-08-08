"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, reducedMotion } from "@/lib/motion";
import { seeded } from "@/lib/utils";
import { cn } from "@/lib/utils";

const q = (n: number) => Math.round(n * 1e3) / 1e3;

const DENSITY = { sparse: 12, normal: 20, dense: 32 } as const;

/**
 * A node/edge mesh with signals travelling along the edges — the section-scale
 * background motif for an AI portfolio. Deterministic layout so SSR and client
 * markup match; purely decorative, so it never carries meaning.
 */
export default function NeuralField({
  density = "normal",
  className,
  seed = 1,
}: {
  density?: keyof typeof DENSITY;
  className?: string;
  seed?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const count = DENSITY[density];

  const { nodes, edges } = useMemo(() => {
    const n = Array.from({ length: count }, (_, i) => {
      const s = i * 3.7 + seed * 11;
      return {
        id: i,
        x: q(6 + seeded(s) * 88),
        y: q(8 + seeded(s + 1.3) * 84),
        r: q(1.4 + seeded(s + 2.6) * 2.2),
      };
    });

    // Connect each node to its two nearest neighbours — reads as a mesh rather
    // than a random scribble, and keeps the edge count linear.
    const e: { id: string; a: typeof n[0]; b: typeof n[0]; w: number }[] = [];
    n.forEach((a) => {
      const near = n
        .filter((b) => b.id !== a.id)
        .map((b) => ({ b, d: Math.hypot(a.x - b.x, a.y - b.y) }))
        .sort((p, r) => p.d - r.d)
        .slice(0, 2);
      near.forEach(({ b, d }) => {
        const id = [a.id, b.id].sort((x, y) => x - y).join("-");
        if (!e.some((x) => x.id === id)) {
          e.push({ id, a, b, w: q(Math.max(0.35, 1 - d / 46)) });
        }
      });
    });
    return { nodes: n, edges: e };
  }, [count, seed]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const lines = el.querySelectorAll<SVGLineElement>("[data-nf-edge]");
      const dots = el.querySelectorAll<SVGCircleElement>("[data-nf-node]");
      const signals = el.querySelectorAll<SVGCircleElement>("[data-nf-signal]");

      if (reducedMotion()) {
        gsap.set(lines, { drawSVG: "100%" });
        gsap.set(dots, { opacity: 0.8, scale: 1 });
        gsap.set(signals, { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });

      tl.from(lines, {
        drawSVG: 0,
        duration: DUR.slow,
        stagger: { each: 0.02, from: "random" },
        ease: EASE.inOut,
      }).from(
        dots,
        { scale: 0, opacity: 0, duration: DUR.fast, stagger: 0.015, ease: "back.out(2)" },
        0.3,
      );

      // Signals ride their edge, then reset. Staggered so the field is always
      // carrying a few at once without ever looking busy.
      const rides = Array.from(signals).map((s, i) => {
        const e = edges[i % edges.length];
        return gsap.fromTo(
          s,
          { attr: { cx: e.a.x, cy: e.a.y }, opacity: 0 },
          {
            attr: { cx: e.b.x, cy: e.b.y },
            opacity: 1,
            duration: 1.6 + seeded(i * 5.5) * 1.8,
            ease: EASE.inOut,
            repeat: -1,
            repeatDelay: 0.6 + seeded(i * 2.2) * 2.4,
            delay: seeded(i * 8.1) * 3,
            yoyo: false,
            onRepeat: () => {
              gsap.set(s, { opacity: 0 });
            },
          },
        );
      });

      return () => {
        tl.kill();
        rides.forEach((r) => r.kill());
      };
    },
    { scope: root, dependencies: [count, seed] },
  );

  return (
    <div ref={root} aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <g stroke="#1261ff">
          {edges.map((e) => (
            <line
              key={e.id}
              data-nf-edge
              x1={e.a.x}
              y1={e.a.y}
              x2={e.b.x}
              y2={e.b.y}
              strokeWidth={q(0.12 + e.w * 0.22)}
              opacity={q(0.12 + e.w * 0.3)}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        <g fill="#1261ff">
          {nodes.map((n) => (
            <circle key={n.id} data-nf-node cx={n.x} cy={n.y} r={q(n.r * 0.32)} opacity="0.8" />
          ))}
        </g>

        <g fill="#00c2ff">
          {Array.from({ length: Math.min(5, edges.length) }).map((_, i) => (
            <circle key={i} data-nf-signal r="0.7" opacity="0" />
          ))}
        </g>
      </svg>
    </div>
  );
}
