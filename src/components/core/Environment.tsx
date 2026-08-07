"use client";

import { useEffect, useRef } from "react";
import { codeFragments } from "@/data/profile";
import { seeded } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks";

const round = (n: number) => Math.round(n * 1000) / 1000;

/**
 * The persistent "digital environment" behind every section: technical grid,
 * two slow gradient auroras, drifting particles and floating code fragments.
 * Everything here is decorative and GPU-cheap (transform/opacity only).
 */
export default function Environment() {
  const reduced = useReducedMotion();
  const layer = useRef<HTMLDivElement>(null);

  // Parallax the auroras a touch with the pointer — barely perceptible, but it
  // stops the background feeling like a static image.
  useEffect(() => {
    if (reduced) return;
    const el = layer.current;
    if (!el) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 34;
      ty = (e.clientY / window.innerHeight - 0.5) * 34;
    };
    const tick = () => {
      cx += (tx - cx) * 0.045;
      cy += (ty - cy) * 0.045;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
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
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* base wash */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7faff_0%,#ffffff_45%,#f4f8ff_100%)]" />

      {/* technical grid, fading out toward the bottom */}
      <div
        className="tech-grid absolute inset-0 opacity-70"
        style={{
          maskImage: "linear-gradient(180deg,black,black 55%,transparent)",
          WebkitMaskImage: "linear-gradient(180deg,black,black 55%,transparent)",
        }}
      />

      {/* auroras */}
      <div ref={layer} className="absolute inset-0 will-change-transform">
        <div className="absolute -top-[18rem] -right-[12rem] size-[52rem] rounded-full bg-[radial-gradient(circle,rgb(18_97_255/0.09),transparent_62%)] blur-[2px]" />
        <div className="absolute top-[38%] -left-[16rem] size-[44rem] rounded-full bg-[radial-gradient(circle,rgb(0_194_255/0.08),transparent_62%)]" />
        <div className="absolute -bottom-[16rem] left-1/3 size-[46rem] rounded-full bg-[radial-gradient(circle,rgb(18_97_255/0.07),transparent_65%)]" />
      </div>

      {/* drifting particles */}
      {!reduced && (
        <div className="absolute inset-0">
          {Array.from({ length: 26 }).map((_, i) => {
            // Values are rounded before they reach the DOM: full float precision
            // round-trips differently through the CSSOM and trips React's
            // hydration diff.
            const size = round(2 + seeded(i * 3.1) * 4);
            return (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${round(seeded(i + 1) * 100)}%`,
                  top: `${round(100 + seeded(i + 40) * 45)}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor:
                    i % 3 === 0 ? "rgba(0,194,255,0.5)" : "rgba(18,97,255,0.35)",
                  boxShadow: "rgba(18,97,255,0.35) 0px 0px 8px 0px",
                  animationName: "bm-drift",
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                  animationDuration: `${round(26 + seeded(i * 7) * 30)}s`,
                  animationDelay: `${round(-seeded(i * 11) * 40)}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Floating code fragments, kept to the outer margins. Drifting them
          through the middle put them behind body copy, which read as noise. */}
      {!reduced && (
        <div className="absolute inset-0 hidden xl:block">
          {codeFragments.slice(0, 8).map((frag, i) => {
            // even → left gutter, odd → right gutter
            const left =
              i % 2 === 0
                ? 1 + seeded(i * 13 + 2) * 9
                : 86 + seeded(i * 13 + 2) * 10;
            return (
              <span
                key={frag}
                className="absolute font-mono text-[0.6rem] whitespace-nowrap text-blue/20 select-none"
                style={{
                  left: `${round(left)}%`,
                  top: `${round(104 + seeded(i * 5) * 30)}%`,
                  animationName: "bm-rise",
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                  animationDuration: `${round(46 + seeded(i * 3) * 26)}s`,
                  animationDelay: `${round(-seeded(i * 17) * 52)}s`,
                }}
              >
                {frag}
              </span>
            );
          })}
        </div>
      )}

      {/* vignette so content always stays legible */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_40%,transparent,rgb(247_250_255/0.55))]" />
    </div>
  );
}

/**
 * Thin blue data lines that travel down through a section boundary — the
 * "BLUE DATA STREAM" transition motif.
 */
export function DataStream({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none relative h-24 w-full ${className}`}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1200 96">
        <defs>
          <linearGradient id="bm-stream" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1261ff" stopOpacity="0" />
            <stop offset="45%" stopColor="#1261ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#00c2ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[220, 420, 600, 780, 980].map((x, i) => (
          <line
            key={x}
            x1={x}
            y1="0"
            x2={x + (i % 2 ? 26 : -26)}
            y2="96"
            stroke="url(#bm-stream)"
            strokeWidth="1"
            strokeDasharray="6 10"
            className="animate-dash"
            style={{ animationDuration: `${9 + i * 2.5}s` }}
          />
        ))}
        <line x1="0" y1="95.5" x2="1200" y2="95.5" stroke="#dce7f5" strokeWidth="1" />
      </svg>
    </div>
  );
}
