"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER, reducedMotion } from "@/lib/motion";
import { cn, seeded } from "@/lib/utils";

const q = (n: number) => Math.round(n * 1e3) / 1e3;

/* ------------------------------------------------------------------ */
/* LossCurve                                                           */
/* ------------------------------------------------------------------ */

/**
 * A training-loss curve that draws itself. Decaying exponential with a little
 * deterministic noise — the shape any ML student recognises immediately.
 */
export function LossCurve({
  className,
  label = "training loss",
  seed = 3,
}: {
  className?: string;
  label?: string;
  seed?: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  const { path, ticks } = useMemo(() => {
    const N = 34;
    const pts: [number, number][] = Array.from({ length: N }, (_, i) => {
      const t = i / (N - 1);
      const base = Math.exp(-t * 3.1);
      const noise = (seeded(i * 4.3 + seed) - 0.5) * 0.08 * (1 - t * 0.7);
      return [q(4 + t * 92), q(6 + Math.max(0.02, base + noise) * 74)];
    });
    const d = pts
      .map(([x, y], i) => (i === 0 ? `M${x} ${y}` : `L${x} ${y}`))
      .join(" ");
    return { path: d, ticks: [0, 8, 16, 24, 32].map((i) => q(4 + (i / (N - 1)) * 92)) };
  }, [seed]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const line = el.querySelector("[data-lc-line]");
      const fill = el.querySelector("[data-lc-fill]");
      const head = el.querySelector("[data-lc-head]");
      if (!line) return;

      if (reducedMotion()) {
        gsap.set(line, { drawSVG: "100%" });
        gsap.set([fill, head], { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      tl.from(line, { drawSVG: 0, duration: 1.5, ease: EASE.inOut })
        .from(fill, { opacity: 0, duration: DUR.base }, 0.5)
        .from(head, { opacity: 0, scale: 0, duration: DUR.fast, ease: "back.out(3)" }, 1.2);

      return () => tl.kill();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className={cn("relative", className)}>
      <svg viewBox="0 0 100 88" className="h-full w-full" fill="none">
        <defs>
          <linearGradient id="bm-lc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1261ff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#1261ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* axes */}
        <line x1="4" y1="80" x2="96" y2="80" stroke="#dce7f5" strokeWidth="0.6" />
        <line x1="4" y1="6" x2="4" y2="80" stroke="#dce7f5" strokeWidth="0.6" />
        {ticks.map((x) => (
          <line key={x} x1={x} y1="80" x2={x} y2="82.4" stroke="#dce7f5" strokeWidth="0.6" />
        ))}

        <path data-lc-fill d={`${path} L96 80 L4 80 Z`} fill="url(#bm-lc-fill)" />
        <path
          data-lc-line
          d={path}
          stroke="#1261ff"
          strokeWidth="1.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle data-lc-head cx="96" cy="7.6" r="1.8" fill="#00c2ff" />

        <text x="6" y="4.4" fill="#64748b" fontSize="3.4" fontFamily="ui-monospace, monospace">
          {label}
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EmbeddingScatter                                                    */
/* ------------------------------------------------------------------ */

/** A 2-D projection with three labelled clusters that settle into place. */
export function EmbeddingScatter({
  className,
  labels = ["python", "web", "ml"],
}: {
  className?: string;
  labels?: string[];
}) {
  const root = useRef<HTMLDivElement>(null);

  const clusters = useMemo(
    () =>
      labels.map((name, c) => {
        const cx = 24 + c * 26;
        const cy = 30 + ((c % 2) * 26 - 6);
        return {
          name,
          cx,
          cy,
          pts: Array.from({ length: 16 }, (_, i) => {
            const s = i * 2.7 + c * 31;
            const a = seeded(s) * Math.PI * 2;
            const r = seeded(s + 1.1) * 11;
            return {
              x: q(cx + Math.cos(a) * r),
              y: q(cy + Math.sin(a) * r * 0.9),
              r: q(0.7 + seeded(s + 2.2) * 0.9),
            };
          }),
        };
      }),
    [labels],
  );

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const dots = el.querySelectorAll("[data-es-dot]");
      const rings = el.querySelectorAll("[data-es-ring]");

      if (reducedMotion()) {
        gsap.set([dots, rings], { opacity: 1, scale: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      tl.from(dots, {
        opacity: 0,
        scale: 0,
        // Converging from the middle reads as a projection settling.
        transformOrigin: "50% 50%",
        duration: DUR.base,
        stagger: { each: 0.012, from: "random" },
        ease: "back.out(2)",
      }).from(rings, { opacity: 0, scale: 0.6, duration: DUR.base, stagger: STAGGER.base }, 0.4);

      return () => tl.kill();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className={cn("relative", className)}>
      <svg viewBox="0 0 100 76" className="h-full w-full">
        {clusters.map((c) => (
          <g key={c.name}>
            <ellipse
              data-es-ring
              cx={c.cx}
              cy={c.cy}
              rx="14"
              ry="12.5"
              fill="rgba(18,97,255,0.05)"
              stroke="#1261ff"
              strokeOpacity="0.22"
              strokeDasharray="2 2"
              strokeWidth="0.5"
            />
            {c.pts.map((p, i) => (
              <circle
                key={i}
                data-es-dot
                cx={p.x}
                cy={p.y}
                r={p.r}
                fill={i % 5 === 0 ? "#00c2ff" : "#1261ff"}
                opacity={i % 5 === 0 ? 0.9 : 0.55}
              />
            ))}
            <text
              x={c.cx}
              y={c.cy + 18}
              textAnchor="middle"
              fill="#64748b"
              fontSize="3.2"
              fontFamily="ui-monospace, monospace"
            >
              {c.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ConfusionMatrix                                                     */
/* ------------------------------------------------------------------ */

/** Small NxN heatmap whose cells fill in, diagonal strongest. */
export function ConfusionMatrix({ className, size = 5 }: { className?: string; size?: number }) {
  const root = useRef<HTMLDivElement>(null);

  const cells = useMemo(() => {
    const out: { x: number; y: number; v: number }[] = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Strong diagonal with a little off-diagonal confusion.
        const v = x === y ? 0.72 + seeded(x * 3 + y * 7) * 0.28 : seeded(x * 5 + y * 11) * 0.22;
        out.push({ x, y, v: q(v) });
      }
    }
    return out;
  }, [size]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const rects = el.querySelectorAll("[data-cm-cell]");
      if (reducedMotion()) {
        gsap.set(rects, { opacity: 1, scale: 1 });
        return;
      }
      const tw = gsap.from(rects, {
        opacity: 0,
        scale: 0.4,
        transformOrigin: "50% 50%",
        duration: DUR.fast,
        stagger: { each: 0.014, from: "start" },
        ease: EASE.out,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
      return () => tw.kill();
    },
    { scope: root },
  );

  const gap = 1.4;
  const cell = (100 - gap * (size + 1)) / size;

  return (
    <div ref={root} aria-hidden className={cn("relative", className)}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {cells.map((c) => (
          <rect
            key={`${c.x}-${c.y}`}
            data-cm-cell
            x={q(gap + c.x * (cell + gap))}
            y={q(gap + c.y * (cell + gap))}
            width={q(cell)}
            height={q(cell)}
            rx="1.4"
            fill={c.x === c.y ? "#1261ff" : "#00c2ff"}
            opacity={q(c.x === c.y ? 0.25 + c.v * 0.6 : 0.08 + c.v * 0.5)}
          />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TensorGrid                                                          */
/* ------------------------------------------------------------------ */

/** Isometric stack of cubes with slices highlighting in sequence. */
export function TensorGrid({
  className,
  cols = 6,
  rows = 4,
}: {
  className?: string;
  cols?: number;
  rows?: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  const cubes = useMemo(() => {
    const out: { x: number; y: number; col: number }[] = [];
    const w = 11;
    const h = 6.4;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({
          x: q(20 + (c - r) * (w / 2)),
          y: q(18 + (c + r) * (h / 2)),
          col: c,
        });
      }
    }
    return out;
  }, [cols, rows]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const gs = el.querySelectorAll("[data-tg-cube]");
      if (reducedMotion()) {
        gsap.set(gs, { opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      tl.from(gs, {
        opacity: 0,
        y: -14,
        duration: DUR.base,
        stagger: { each: 0.03, from: "start" },
        ease: EASE.out,
      });

      // A slice sweeps through the volume, over and over.
      const sweep = gsap.to("[data-tg-top]", {
        opacity: 0.85,
        duration: 0.5,
        stagger: { each: 0.06, repeat: -1, repeatDelay: 2.4, yoyo: true },
        ease: EASE.inOut,
      });

      return () => {
        tl.kill();
        sweep.kill();
      };
    },
    { scope: root, dependencies: [cols, rows] },
  );

  const w = 11;
  const h = 6.4;
  const d = 7;

  return (
    <div ref={root} aria-hidden className={cn("relative", className)}>
      <svg viewBox="0 0 100 76" className="h-full w-full">
        {cubes.map((c, i) => (
          <g key={i} data-tg-cube>
            {/* top */}
            <path
              data-tg-top
              d={`M${c.x} ${c.y} l${w / 2} ${h / 2} l${-w / 2} ${h / 2} l${-w / 2} ${-h / 2} Z`}
              fill="#1261ff"
              opacity="0.34"
            />
            {/* left */}
            <path
              d={`M${c.x - w / 2} ${c.y + h / 2} l${w / 2} ${h / 2} l0 ${d} l${-w / 2} ${-h / 2} Z`}
              fill="#1261ff"
              opacity="0.16"
            />
            {/* right */}
            <path
              d={`M${c.x + w / 2} ${c.y + h / 2} l${-w / 2} ${h / 2} l0 ${d} l${w / 2} ${-h / 2} Z`}
              fill="#00c2ff"
              opacity="0.12"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
