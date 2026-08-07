"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { seeded } from "@/lib/utils";

/**
 * The fly-through.
 *
 * A short pinned scene between two sections: a small rounded blue-rimmed window
 * sits in the middle of the viewport, then rushes outward past the frame while
 * tunnel rings and streaks accelerate through it. Because the frame is pinned it
 * is genuinely viewport-sized, which is what a `clip-path` on a tall section
 * can't give you — this is the one place the "going inside" read has to land, so
 * it gets its own scene.
 *
 * The wrapper's height is the scroll runway; the sticky child is the camera.
 */
export default function Gateway({
  label = "ABOUT",
  index = "02",
  variant = "portal",
}: {
  label?: string;
  index?: string;
  /** "portal" is the rounded window; "grid" is a perspective corridor. */
  variant?: "portal" | "grid";
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      // The window rushes past the camera. Every element starts visible — an
      // opening frame at opacity 0 left a blank screen for the first stretch of
      // the runway, which read as a bug rather than a beat.
      tl.fromTo(
        "[data-gw-frame]",
        { scale: 0.5, opacity: 0.9 },
        { scale: 1.15, opacity: 1, ease: "power1.in", duration: 0.6 },
        0,
      )
        .to(
          "[data-gw-frame]",
          { scale: 6, opacity: 0, borderRadius: "0rem", ease: "power2.in", duration: 0.4 },
          0.6,
        )
        // Tunnel rings, each starting further back.
        .fromTo(
          "[data-gw-ring]",
          { scale: 0.18, opacity: 0.45 },
          {
            scale: 7,
            opacity: 0,
            ease: "power2.in",
            duration: 1,
            stagger: { each: 0.09, from: "start" },
          },
          0,
        )
        // Streaks stretch as speed builds.
        .fromTo(
          "[data-gw-streak]",
          { scaleX: 0.12, opacity: 0.18 },
          { scaleX: 1, opacity: 0.8, ease: "power2.in", duration: 1 },
          0,
        )
        .fromTo(
          "[data-gw-label]",
          { opacity: 0.5, y: 16, letterSpacing: "0.45em" },
          { opacity: 1, y: 0, letterSpacing: "0.28em", ease: "power2.out", duration: 0.45 },
          0,
        )
        .to("[data-gw-label]", { opacity: 0, scale: 1.6, ease: "power2.in", duration: 0.3 }, 0.66);

      // The corridor variant flies down a perspective grid instead.
      if (variant === "grid") {
        tl.fromTo(
          "[data-gw-corridor]",
          { backgroundPositionY: "0px", opacity: 0.4 },
          { backgroundPositionY: "1400px", opacity: 0.95, ease: "none", duration: 1 },
          0,
        );
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root, dependencies: [variant] },
  );

  return (
    <div ref={root} aria-hidden className="relative h-[135vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* perspective corridor — floor and ceiling rushing past */}
        {variant === "grid" ? (
          <>
            {(["bottom", "top"] as const).map((edge) => (
              <div
                key={edge}
                data-gw-corridor
                className="pointer-events-none absolute inset-x-0 h-[58%]"
                style={{
                  [edge]: 0,
                  backgroundImage:
                    "linear-gradient(to right, rgba(18,97,255,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,97,255,0.55) 1px, transparent 1px)",
                  backgroundSize: "84px 84px",
                  transform: `perspective(500px) rotateX(${edge === "bottom" ? 68 : -68}deg)`,
                  transformOrigin: `${edge} center`,
                  maskImage: `linear-gradient(to ${edge === "bottom" ? "top" : "bottom"}, black, transparent 80%)`,
                  WebkitMaskImage: `linear-gradient(to ${edge === "bottom" ? "top" : "bottom"}, black, transparent 80%)`,
                  opacity: 0.4,
                }}
              />
            ))}
          </>
        ) : null}

        {/* tunnel rings */}
        {(variant === "portal" ? Array.from({ length: 7 }) : []).map((_, i) => (
          <span
            key={i}
            data-gw-ring
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[3rem] border border-blue/45"
            style={{ width: "34vmin", height: "34vmin", opacity: 0.45 }}
          />
        ))}

        {/* radial streaks */}
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * 360 + seeded(i * 4.1) * 8;
          return (
            <span
              key={`s${i}`}
              data-gw-streak
              // top/left 50% + origin-left puts the rotation pivot exactly at
              // the viewport centre. Relying on the flex centring instead pivots
              // about the span's left edge, half a screen off to the side.
              className="absolute top-1/2 left-1/2 origin-left"
              style={{
                height: 1.5,
                width: "44vmax",
                opacity: 0.18,
                background:
                  "linear-gradient(90deg, rgba(18,97,255,0) 0%, rgba(18,97,255,0.5) 50%, rgba(0,194,255,0.85) 100%)",
                transform: `rotate(${angle}deg) translateX(11vmin)`,
              }}
            />
          );
        })}

        {/* the window you pass through */}
        <span
          data-gw-frame
          className="absolute top-1/2 left-1/2 size-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] border-2 border-blue/70 bg-[radial-gradient(circle,rgba(18,97,255,0.16),transparent_72%)] shadow-[0_0_90px_-8px_rgb(18_97_255/0.6)]"
          style={{ opacity: 0.9 }}
        />

        {/* section marker */}
        <span
          data-gw-label
          className="relative flex flex-col items-center gap-2 font-mono text-[0.7rem] font-semibold text-blue uppercase"
          style={{ opacity: 0.5 }}
        >
          <span className="text-muted/70">{index}</span>
          <span>{label}</span>
        </span>
      </div>
    </div>
  );
}
