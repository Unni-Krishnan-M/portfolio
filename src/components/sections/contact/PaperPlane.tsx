"use client";

import { useRef } from "react";
import { gsap, MotionPathPlugin, useGSAP } from "@/lib/gsap";

/** Waypoints where a glyph lights up as the plane passes. */
const GLYPHS = [
  { t: 0.14, x: 118, y: 176, kind: "mail" },
  { t: 0.34, x: 268, y: 92, kind: "plus" },
  { t: 0.52, x: 402, y: 148, kind: "dot" },
  { t: 0.72, x: 548, y: 74, kind: "mail" },
  { t: 0.88, x: 668, y: 128, kind: "plus" },
] as const;

const PATH =
  "M 24 214 C 118 214 132 128 224 122 C 316 116 318 194 410 186 C 500 178 512 96 604 96 C 676 96 706 132 758 140";

export default function PaperPlane() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const path = el.querySelector<SVGPathElement>("[data-flight]");
      const plane = el.querySelector<SVGGElement>("[data-plane]");
      const trail = el.querySelector<SVGPathElement>("[data-trail]");
      const glyphs = gsap.utils.toArray<SVGGElement>("[data-glyph]", el);
      if (!path || !plane) return;

      // Static end-state: fully drawn path, plane landed, every glyph lit.
      if (reduced) {
        gsap.set([path, trail], { drawSVG: "100%" });
        gsap.set(glyphs, { opacity: 1, scale: 1 });
        MotionPathPlugin.convertToPath(path);
        gsap.set(plane, {
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true, start: 1, end: 1 },
        });
        return;
      }

      gsap.set(glyphs, { opacity: 0.25, scale: 0.7, transformOrigin: "50% 50%" });

      // Bob the inner group, never the plane itself — motionPath owns the
      // plane's own transform and the two would fight over `y`.
      const idle = gsap.to("[data-plane-bob]", {
        y: 5,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        paused: true,
      });

      // The dashed guide draws just ahead of the plane, then the plane flies it.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          end: "bottom 55%",
          scrub: 1,
          onUpdate: (self) => {
            // Idle hover only once it has landed.
            if (self.progress > 0.985) idle.play();
            else if (idle.isActive()) {
              idle.pause();
              gsap.to("[data-plane-bob]", { y: 0, duration: 0.3 });
            }
          },
        },
      });

      tl.fromTo(
        [trail, path].filter(Boolean) as SVGPathElement[],
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 1, ease: "none" },
        0,
      ).fromTo(
        plane,
        {
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0,
            end: 0,
          },
        },
        {
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0,
            end: 1,
          },
          duration: 1,
          ease: "none",
        },
        0,
      );

      // Each waypoint ignites as the plane reaches its position on the path.
      glyphs.forEach((g, i) => {
        tl.to(g, { opacity: 1, scale: 1, duration: 0.06, ease: "power2.out" }, GLYPHS[i].t);
      });

      return () => {
        idle.kill();
        tl.kill();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="pointer-events-none relative w-full overflow-hidden">
      <svg
        viewBox="0 0 780 260"
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <defs>
          <linearGradient id="bm-plane-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5B94FF" />
            <stop offset="100%" stopColor="#1261FF" />
          </linearGradient>
          <linearGradient id="bm-plane-under" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1261FF" />
            <stop offset="100%" stopColor="#0A3AA8" />
          </linearGradient>
          <linearGradient id="bm-trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1261FF" stopOpacity="0" />
            <stop offset="55%" stopColor="#1261FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00C2FF" stopOpacity="0.5" />
          </linearGradient>
          <filter id="bm-plane-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* faint network the plane travels through */}
        <g stroke="#DCE7F5" strokeWidth="1">
          <path d="M60 60 L180 40 L300 70 L430 38 L560 62 L700 34" />
          <path d="M40 232 L170 250 L320 224 L470 244 L620 218 L748 236" />
        </g>
        <g fill="#1261FF" opacity="0.16">
          {[
            [180, 40],
            [430, 38],
            [700, 34],
            [170, 250],
            [470, 244],
            [748, 236],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" />
          ))}
        </g>

        {/* soft under-trail, then the dashed flight path */}
        <path data-trail d={PATH} stroke="url(#bm-trail)" strokeWidth="7" strokeLinecap="round" opacity="0.35" />
        <path
          data-flight
          d={PATH}
          stroke="#1261FF"
          strokeWidth="1.5"
          strokeDasharray="7 9"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* waypoint glyphs */}
        {GLYPHS.map((g, i) => (
          <g data-glyph key={i} transform={`translate(${g.x} ${g.y})`}>
            {g.kind === "mail" ? (
              <g stroke="#1261FF" strokeWidth="1.4" fill="#EAF2FF">
                <rect x="-9" y="-7" width="18" height="14" rx="2.5" />
                <path d="M-9 -5 L0 2 L9 -5" fill="none" />
              </g>
            ) : g.kind === "plus" ? (
              <g stroke="#00C2FF" strokeWidth="1.6" strokeLinecap="round">
                <path d="M-6 0 H6" />
                <path d="M0 -6 V6" />
              </g>
            ) : (
              <circle r="4" fill="#1261FF" opacity="0.5" />
            )}
          </g>
        ))}

        {/* the plane */}
        <g data-plane filter="url(#bm-plane-glow)">
          <g data-plane-bob>
            <path d="M-15 -11 L17 0 L-15 11 L-9 0 Z" fill="url(#bm-plane-top)" />
            <path d="M-15 11 L-9 0 L17 0 Z" fill="url(#bm-plane-under)" />
            <path d="M-15 -11 L-9 0 L17 0 Z" fill="#8FB6FF" opacity="0.75" />
          </g>
        </g>
      </svg>
    </div>
  );
}
