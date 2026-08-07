"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { statement } from "@/data/profile";
import { cn } from "@/lib/utils";

/**
 * The word tunnel.
 *
 * A pinned scene where each line of the statement rushes out of the distance,
 * fills the screen and passes the camera — the "going inside" idea applied to
 * typography instead of a frame. Lines overlap slightly so there is always
 * something on screen, and the type is deliberately oversized: at full scale a
 * line is wider than the viewport, which is what sells the sense of passing
 * through it rather than reading it at arm's length.
 */
export default function Statement() {
  const root = useRef<HTMLElement>(null);
  const lines = statement.lines;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const items = gsap.utils.toArray<HTMLElement>("[data-word]", el);

      if (reduced) {
        gsap.set(items, { opacity: 1, scale: 1, y: 0 });
        gsap.set("[data-grid]", { opacity: 0.6 });
        return;
      }

      const step = 1 / lines.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
        },
      });

      items.forEach((item, i) => {
        const at = i * step;
        // The first line starts already legible: beginning at opacity 0 left the
        // scene blank for its opening stretch, which reads as a broken section
        // rather than a beat.
        const first = i === 0;
        tl.fromTo(
          item,
          first
            ? { scale: 0.66, opacity: 1, z: -260 }
            : { scale: 0.28, opacity: 0, z: -900 },
          { scale: 1, opacity: 1, z: 0, ease: "power2.out", duration: step * 0.62 },
          at,
        )
          // …and straight past the camera.
          .to(
            item,
            { scale: 3.4, opacity: 0, z: 700, ease: "power2.in", duration: step * 0.46 },
            at + step * 0.6,
          );
      });

      // The floor grid accelerates through the whole scene.
      tl.fromTo(
        "[data-grid]",
        { backgroundPositionY: "0px", opacity: 0.45 },
        { backgroundPositionY: "900px", opacity: 0.9, ease: "none", duration: 1 },
        0,
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root, dependencies: [lines.length] },
  );

  return (
    <section ref={root} className="relative" style={{ height: `${lines.length * 78 + 60}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* perspective floor rushing toward the viewer */}
        <div
          aria-hidden
          data-grid
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] opacity-45"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(18,97,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,97,255,0.5) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
            transform: "perspective(520px) rotateX(66deg)",
            transformOrigin: "bottom center",
            maskImage: "linear-gradient(to top, black, transparent 78%)",
            WebkitMaskImage: "linear-gradient(to top, black, transparent 78%)",
          }}
        />

        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgb(18_97_255/0.08),transparent_70%)]" />

        <p className="label-tech absolute top-[16%] left-1/2 -translate-x-1/2">
          {statement.eyebrow}
        </p>

        {/* the tunnel of words — one <h2> for the whole statement, so it reads
            as a single heading to assistive tech */}
        <h2
          className="relative flex items-center justify-center [perspective:1000px]"
          aria-label={lines.join(" ")}
        >
          {lines.map((line) => (
            <span
              key={line}
              data-word
              aria-hidden
              className={cn(
                "absolute whitespace-nowrap text-center font-extrabold tracking-[-0.05em] opacity-0",
                "text-[clamp(3rem,12vw,11rem)] leading-[0.9]",
                line === statement.accent ? "text-blue" : "text-ink",
              )}
              style={{ willChange: "transform, opacity" }}
            >
              {line}
            </span>
          ))}
        </h2>

        <p className="absolute bottom-[14%] left-1/2 max-w-sm -translate-x-1/2 px-6 text-center text-[0.9rem] text-muted">
          {statement.footer}
        </p>
      </div>
    </section>
  );
}
