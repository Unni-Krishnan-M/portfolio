"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { seeded } from "@/lib/utils";

const STREAKS = 22;

/**
 * Scroll-velocity warp. Radial blue streaks rush outward from the centre when
 * you scroll fast and vanish the moment you stop, so moving through the page
 * feels like travelling rather than panning.
 *
 * Driven by a single CSS custom property written once per frame from the GSAP
 * ticker — no React state, no per-streak JS, so the cost is one style write
 * regardless of streak count.
 */
export default function WarpOverlay() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = window.scrollY;
    let smooth = 0;

    const tick = () => {
      const now = window.scrollY;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).__lenis;
      const raw = lenis?.velocity != null ? Math.abs(lenis.velocity) : Math.abs(now - last);
      last = now;

      // Normalise: ~45px/frame of travel is "full warp".
      const target = Math.min(1, raw / 45);
      smooth += (target - smooth) * (target > smooth ? 0.18 : 0.07);
      if (smooth < 0.001) smooth = 0;

      el.style.setProperty("--warp", smooth.toFixed(3));
      el.style.opacity = smooth > 0.02 ? "1" : "0";
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[120] overflow-hidden opacity-0 transition-opacity duration-300"
      style={{ ["--warp" as string]: 0 }}
    >
      {/* streaks radiating from the centre */}
      {Array.from({ length: STREAKS }).map((_, i) => {
        const angle = (i / STREAKS) * 360 + seeded(i * 3.1) * 9;
        const dist = 26 + seeded(i * 7.7) * 26;
        const len = 6 + seeded(i * 5.3) * 16;
        return (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              height: 1.5,
              width: `${len}vmax`,
              background:
                "linear-gradient(90deg, rgba(18,97,255,0) 0%, rgba(18,97,255,0.55) 45%, rgba(0,194,255,0.75) 100%)",
              transform: `rotate(${angle}deg) translateX(${dist}vmax) scaleX(calc(var(--warp) * 1))`,
              opacity: `calc(var(--warp) * 0.9)`,
            }}
          />
        );
      })}

      {/* speed vignette — darkens the edges as velocity rises */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 42%, rgba(18,97,255,0.13) 100%)",
          opacity: "calc(var(--warp) * 1)",
        }}
      />
    </div>
  );
}
