"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, reducedMotion } from "@/lib/motion";

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

/**
 * The request in flight. Three stacked strokes tell the story: a static route,
 * a solid trail that fills in behind the plane, and marching dashes on top that
 * read as packets moving. It lands on a `200 OK`.
 */
export default function PaperPlane() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      // The guide is never touched by DrawSVG, so it stays a clean geometry
      // source for MotionPath.
      const guide = el.querySelector<SVGPathElement>("[data-guide]");
      const trail = el.querySelector<SVGPathElement>("[data-trail]");
      const packets = el.querySelector<SVGPathElement>("[data-packets]");
      const plane = el.querySelector<SVGGElement>("[data-plane]");
      const ok = el.querySelector<SVGGElement>("[data-ok]");
      const okLine = el.querySelector<SVGPathElement>("[data-ok-line]");
      const glyphs = gsap.utils.toArray<SVGGElement>("[data-glyph]", el);
      if (!guide || !plane) return;

      const land = {
        motionPath: {
          path: guide,
          align: guide,
          alignOrigin: [0.5, 0.5] as [number, number],
          autoRotate: true,
        },
      };

      // Static end-state: trail drawn, packets visible, glyphs lit, plane landed
      // next to its 200 OK.
      if (reducedMotion()) {
        gsap.set(trail, { drawSVG: "100%" });
        gsap.set(packets, { opacity: 0.6 });
        gsap.set(glyphs, { opacity: 1, scale: 1 });
        gsap.set(ok, { opacity: 1, y: 0 });
        gsap.set(okLine, { opacity: 0.45 });
        gsap.set(plane, { motionPath: { ...land.motionPath, start: 1, end: 1 } });
        return;
      }

      gsap.set(glyphs, { opacity: 0.25, scale: 0.7, transformOrigin: "50% 50%" });
      gsap.set([ok, okLine], { opacity: 0 });

      // Packets march continuously — 36 is exactly two dash periods, so the loop
      // is seamless.
      const march = packets
        ? gsap.to(packets, {
            strokeDashoffset: -36,
            duration: DUR.amble * 0.6,
            ease: EASE.none,
            repeat: -1,
          })
        : null;

      // Bob the inner group, never the plane itself — motionPath owns the
      // plane's own transform and the two would fight over `y`.
      const idle = gsap.to("[data-plane-bob]", {
        y: 5,
        duration: DUR.amble,
        ease: EASE.inOut,
        repeat: -1,
        yoyo: true,
        paused: true,
      });

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
              gsap.to("[data-plane-bob]", { y: 0, duration: DUR.fast });
            }
          },
        },
      });

      if (trail) {
        tl.fromTo(trail, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, ease: EASE.none }, 0);
      }
      if (packets) {
        tl.fromTo(packets, { opacity: 0 }, { opacity: 0.6, duration: 0.08, ease: EASE.none }, 0);
      }

      tl.fromTo(
        plane,
        { motionPath: { ...land.motionPath, start: 0, end: 0 } },
        { motionPath: { ...land.motionPath, start: 0, end: 1 }, duration: 1, ease: EASE.none },
        0,
      );

      // Each waypoint ignites as the plane reaches its position on the path.
      glyphs.forEach((g, i) => {
        tl.to(g, { opacity: 1, scale: 1, duration: 0.06, ease: EASE.out }, GLYPHS[i].t);
      });

      // The response, on arrival.
      tl.to(okLine, { opacity: 0.45, duration: 0.04, ease: EASE.none }, 0.9).fromTo(
        ok,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.1, ease: EASE.out },
        0.9,
      );

      return () => {
        march?.kill();
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

        {/* the route, the travelled trail, then the packets riding it */}
        <path data-guide d={PATH} stroke="#1261FF" strokeWidth="1.2" opacity="0.14" />
        <path
          data-trail
          d={PATH}
          stroke="url(#bm-trail)"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          data-packets
          d={PATH}
          stroke="#1261FF"
          strokeWidth="1.6"
          strokeDasharray="6 12"
          strokeDashoffset="0"
          strokeLinecap="round"
          opacity="0"
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

        {/* the response marker at the landing point */}
        <path
          data-ok-line
          d="M754 150 L706 182"
          stroke="#1261FF"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0"
        />
        <g data-ok transform="translate(694 196)" opacity="0">
          <rect
            x="-45"
            y="-13"
            width="90"
            height="26"
            rx="13"
            fill="#EAF2FF"
            stroke="#1261FF"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          <circle cx="-31" cy="0" r="3.4" fill="#00C2FF" />
          <text
            x="4"
            y="4.2"
            textAnchor="middle"
            fill="#1261FF"
            fontSize="11.5"
            fontWeight="600"
            letterSpacing="1.1"
            fontFamily="ui-monospace, monospace"
          >
            200 OK
          </text>
        </g>

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
