"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { marqueeItems } from "@/data/profile";

/**
 * Giant looping band of technologies.
 *
 * Runs continuously on its own, and scroll velocity feeds into the speed — so it
 * lurches when you scroll hard and settles when you stop, which makes the page
 * feel mechanically connected rather than decorated. Two identical rows are
 * rendered and the track wraps at -50%, so the loop is seamless with no
 * measurement or resize handling.
 */
export default function Marquee({
  reverse = false,
  className,
}: {
  reverse?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>("[data-track]");
      if (!track) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const base = reverse ? 1 : -1;

      const tween = gsap.to(track, {
        xPercent: base * 50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });

      // Scroll velocity modulates playback rate; it eases back to 1 on its own.
      const tick = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const v = Math.abs((window as any).__lenis?.velocity ?? 0);
        const boost = 1 + Math.min(7, v / 12);
        tween.timeScale(gsap.utils.interpolate(tween.timeScale(), boost, 0.08));
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        tween.kill();
      };
    },
    { scope: root, dependencies: [reverse] },
  );

  const row = (
    <>
      {marqueeItems.map((item) => (
        <span key={item} className="flex shrink-0 items-center gap-[3vw] pr-[3vw]">
          <span className="text-[clamp(2rem,7vw,6rem)] leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap text-ink/[0.16]">
            {item}
          </span>
          <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-blue/45" />
        </span>
      ))}
    </>
  );

  return (
    <div
      ref={root}
      aria-hidden
      className={`relative overflow-hidden py-6 select-none ${className ?? ""}`}
    >
      <div data-track className="flex w-max will-change-transform">
        {row}
        {row}
      </div>

      {/* fade the band into the page at both ends */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[14%] bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
