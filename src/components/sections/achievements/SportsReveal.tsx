"use client";

import { useRef } from "react";
import { Trophy } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { sportsAchievement } from "@/data/profile";

const TRAILS = [
  { delay: 0, opacity: 0.95, height: "38%" },
  { delay: 0.05, opacity: 0.4, height: "22%" },
  { delay: 0.1, opacity: 0.22, height: "12%" },
  { delay: 0.16, opacity: 0.12, height: "6%" },
];

const SPEED_LINES = [0.18, 0.34, 0.52, 0.68, 0.82];

/**
 * A blue light streak crosses the block at speed and the record is revealed in
 * its wake — the "400m" motif of the whole section.
 */
export default function SportsReveal() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const streaks = gsap.utils.toArray<HTMLElement>("[data-streak]", el);
      const lines = gsap.utils.toArray<HTMLElement>("[data-speed-line]", el);
      const place = el.querySelector<HTMLElement>("[data-place]");
      const body = gsap.utils.toArray<HTMLElement>("[data-reveal-body]", el);
      const badge = el.querySelector<HTMLElement>("[data-trophy]");

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set(place, { clipPath: "inset(-12% 0% -12% 0%)", opacity: 1 });
        gsap.set(body, { opacity: 1, y: 0 });
        gsap.set(badge, { opacity: 1, scale: 1 });
        gsap.set([...streaks, ...lines], { opacity: 0 });
        return;
      }

      gsap.set(streaks, { xPercent: -120, opacity: 0 });
      gsap.set(lines, { opacity: 0, scaleX: 0.2, x: -40 });
      gsap.set(place, { clipPath: "inset(-12% 100% -12% 0%)", opacity: 1 });
      gsap.set(body, { opacity: 0, y: 18 });
      gsap.set(badge, { opacity: 0, scale: 0.6, rotate: -22 });

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: el, start: "top 76%", once: true },
      });

      streaks.forEach((streak, i) => {
        const cfg = TRAILS[i] ?? TRAILS[TRAILS.length - 1];
        tl.to(streak, { opacity: cfg.opacity, duration: 0.08, ease: "none" }, cfg.delay);
        tl.to(streak, { xPercent: 210, duration: 0.5 }, cfg.delay);
        tl.to(streak, { opacity: 0, duration: 0.22, ease: "none" }, cfg.delay + 0.34);
      });

      // Text wipes open behind the leading edge of the streak.
      tl.to(place, { clipPath: "inset(-12% 0% -12% 0%)", duration: 0.55 }, 0.09);

      tl.to(
        lines,
        {
          opacity: 1,
          scaleX: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.03,
        },
        0.05,
      ).to(lines, { opacity: 0, x: 60, duration: 0.5, stagger: 0.03 }, 0.42);

      tl.to(badge, { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: "back.out(1.7)" }, 0.24);
      tl.to(body, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 }, 0.38);

      // slow idle shimmer on the trophy so the block never sits dead
      tl.to(badge, { y: -5, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 }, 1.2);
    },
    { scope: root },
  );

  return (
    <div className="min-w-0">
      <h3 className="flex items-center gap-2.5 text-[1.05rem] font-bold tracking-tight text-ink">
        <Trophy aria-hidden className="size-4 text-blue" strokeWidth={2.2} />
        Beyond Code
      </h3>

      <div
        ref={root}
        className="card-soft relative mt-6 overflow-hidden px-6 py-8 sm:px-8 sm:py-10"
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-[0.35]" />

        {/* light streak + motion trail */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {TRAILS.map((t, i) => (
            <span
              key={i}
              data-streak
              className="absolute left-0 top-1/2 w-[58%] -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-electric to-blue opacity-0 blur-[1px]"
              style={{ height: t.height }}
            />
          ))}
          {SPEED_LINES.map((top, i) => (
            <span
              key={i}
              data-speed-line
              className="absolute left-[6%] h-px w-[24%] origin-left bg-gradient-to-r from-blue/0 via-blue/60 to-blue/0 opacity-0"
              style={{ top: `${top * 100}%` }}
            />
          ))}
        </div>

        <div className="relative">
          <span
            aria-hidden
            data-trophy
            className="js-hidden relative grid size-16 place-items-center rounded-full bg-soft shadow-[0_0_0_1px_rgb(18_97_255/0.14),0_14px_40px_-10px_rgb(18_97_255/0.45)] sm:size-[4.5rem]"
          >
            <span className="absolute inset-0 rounded-full border border-blue/25 [animation:bm-pulse-ring_3.4s_ease-out_infinite]" />
            <Trophy className="size-8 text-blue sm:size-9" strokeWidth={1.9} />
          </span>

          <p
            data-place
            className="js-hidden mt-6 text-gradient-blue text-[clamp(2.4rem,5.6vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          >
            {sportsAchievement.place}
          </p>

          <p
            data-reveal-body
            className="js-hidden mt-4 text-[1.05rem] font-bold tracking-tight text-ink sm:text-[1.15rem]"
          >
            {sportsAchievement.events}
          </p>
          <p data-reveal-body className="js-hidden mt-1.5 text-[0.88rem] text-muted">
            {sportsAchievement.event}
          </p>
          <p
            data-reveal-body
            className="js-hidden mt-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-blue"
          >
            {sportsAchievement.date}
          </p>
          <p
            data-reveal-body
            className="js-hidden mt-5 max-w-md border-l-2 border-blue/25 pl-4 text-[0.86rem] leading-relaxed text-muted"
          >
            {sportsAchievement.note}
          </p>
        </div>
      </div>
    </div>
  );
}
