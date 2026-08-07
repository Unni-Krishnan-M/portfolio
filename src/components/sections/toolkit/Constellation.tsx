"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { orbits, profile } from "@/data/profile";
import { techMark } from "@/components/icons/tech";
import { cn, lerp, seeded } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks";

type Props = {
  /** Tech name currently hovered or focused anywhere in the section. */
  hovered: string | null;
  onHover: (name: string | null) => void;
  onSelect: (name: string) => void;
};

/**
 * Ring radii are percentages of the (square) container, so the orbits scale
 * with the box and can never overflow it at any viewport width.
 */
const RINGS = [
  { rx: 29, ry: 19, speed: 1 },
  { rx: 36.5, ry: 25.5, speed: -0.66 },
  { rx: 43, ry: 31.5, speed: 0.44 },
];

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Trig results are rounded before they reach the DOM. `Math.cos`/`Math.sin` are
 * not bit-identical between V8 builds, so Node and the browser disagree in the
 * last few digits and React reports it as a hydration mismatch.
 */
const q = (n: number) => Math.round(n * 1e4) / 1e4;

const NODES = orbits
  .flatMap((o, ring) =>
    o.names.map((name, i) => {
      const angle = (i / o.names.length) * 360 + ring * 27;
      const R = RINGS[ring];
      const dx = -Math.cos(rad(angle)) * R.rx;
      const dy = -Math.sin(rad(angle)) * R.ry;
      const m = Math.hypot(dx, dy) || 1;
      return {
        name,
        ring,
        left: q(50 + Math.cos(rad(angle)) * R.rx),
        top: q(50 + Math.sin(rad(angle)) * R.ry),
        // unit vector pointing at the centre, in ring-local space
        pullX: q(dx / m),
        pullY: q(dy / m),
      };
    }),
  )
  .map((n, i) => ({ ...n, i }));

/** Faint faceted mesh over the orb — deterministic so SSR matches. */
const FACETS = Array.from({ length: 18 }, (_, i) => {
  const a1 = seeded(i * 1.7 + 2) * Math.PI * 2;
  const a2 = seeded(i * 3.3 + 9) * Math.PI * 2;
  const r1 = 16 + seeded(i * 5.1 + 3) * 34;
  const r2 = 16 + seeded(i * 7.7 + 5) * 34;
  return {
    x1: q(50 + Math.cos(a1) * r1),
    y1: q(50 + Math.sin(a1) * r1),
    x2: q(50 + Math.cos(a2) * r2),
    y2: q(50 + Math.sin(a2) * r2),
  };
});

export default function Constellation({ hovered, onHover, onSelect }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const system = useRef<HTMLDivElement>(null);
  const ringEls = useRef<(HTMLDivElement | null)[]>([]);
  const counterEls = useRef<(HTMLSpanElement | null)[]>([]);
  const btnEls = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const sys = system.current;
      if (!sys) return;

      // One mutable state object, one write path (`render`) per frame.
      const st = { spin: 0, scroll: 0, tiltX: 0, tiltY: 0 };
      const aim = { x: 0, y: 0 };
      const ringRot = RINGS.map(() => 0);

      const render = () => {
        RINGS.forEach((R, ri) => {
          const rot = (st.spin + st.scroll) * R.speed;
          ringRot[ri] = rot;
          const el = ringEls.current[ri];
          if (el) el.style.transform = `rotate(${rot.toFixed(3)}deg)`;
        });
        // Counter-rotate each tile so the icons stay upright.
        NODES.forEach((n) => {
          const el = counterEls.current[n.i];
          if (el) el.style.transform = `rotate(${(-ringRot[n.ring]).toFixed(3)}deg)`;
        });
        sys.style.transform = `perspective(1200px) rotateX(${st.tiltX.toFixed(
          3,
        )}deg) rotateY(${st.tiltY.toFixed(3)}deg)`;
      };

      if (reduced) {
        render();
        return;
      }

      const spin = gsap.to(st, { spin: 360, duration: 120, ease: "none", repeat: -1 });
      const scrub = gsap.to(st, {
        scroll: 60,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      const onMove = (e: PointerEvent) => {
        aim.y = (e.clientX / window.innerWidth - 0.5) * 13;
        aim.x = -(e.clientY / window.innerHeight - 0.5) * 9;
      };
      const tick = () => {
        st.tiltX = lerp(st.tiltX, aim.x, 0.045);
        st.tiltY = lerp(st.tiltY, aim.y, 0.045);
        render();
      };

      // Tilt is a pointer affordance — skip it on touch so nothing jumps on tap.
      if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("pointermove", onMove, { passive: true });
      }
      gsap.ticker.add(tick);

      return () => {
        window.removeEventListener("pointermove", onMove);
        gsap.ticker.remove(tick);
        spin.kill();
        scrub.kill();
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  const focusNode = (i: number) => {
    const n = NODES[i];
    onHover(n.name);
    const el = btnEls.current[i];
    if (!el) return;
    gsap.to(el, {
      scale: 1.2,
      x: n.pullX * 18,
      y: n.pullY * 18,
      duration: reduced ? 0 : 0.55,
      ease: "expo.out",
      overwrite: "auto",
    });
  };

  const blurNode = (i: number) => {
    onHover(null);
    const el = btnEls.current[i];
    if (!el) return;
    gsap.to(el, {
      scale: 1,
      x: 0,
      y: 0,
      duration: reduced ? 0 : 0.6,
      ease: "expo.out",
      overwrite: "auto",
    });
  };

  return (
    <div ref={root} className="relative w-full">
      <div className="relative mx-auto aspect-square w-full max-w-[20rem] sm:max-w-[26rem] lg:max-w-[30rem] xl:max-w-[33rem]">
        {/* ambient wash */}
        <div
          aria-hidden
          className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgb(18_97_255/0.09),transparent_66%)]"
        />

        <div ref={system} className="absolute inset-0 will-change-transform">
          {RINGS.map((R, ri) => (
            <div
              key={ri}
              ref={(el) => {
                ringEls.current[ri] = el;
              }}
              className="absolute inset-0 will-change-transform"
            >
              <span
                aria-hidden
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-line"
                style={{ width: `${R.rx * 2}%`, height: `${R.ry * 2}%` }}
              />

              {NODES.filter((n) => n.ring === ri).map((n) => {
                const { node, tint } = techMark(n.name);
                const on = hovered === n.name;
                return (
                  <div
                    key={n.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${n.left}%`, top: `${n.top}%` }}
                  >
                    <button
                      type="button"
                      ref={(el) => {
                        btnEls.current[n.i] = el;
                      }}
                      data-cursor="EXPLORE"
                      aria-label={`${n.name} — show details`}
                      aria-pressed={on}
                      onPointerEnter={() => focusNode(n.i)}
                      onPointerLeave={() => blurNode(n.i)}
                      onFocus={() => focusNode(n.i)}
                      onBlur={() => blurNode(n.i)}
                      onClick={() => onSelect(n.name)}
                      className={cn(
                        "group relative grid size-11 place-items-center rounded-full bg-bg-2 shadow-soft outline-none",
                        "ring-1 ring-line/80 transition-[opacity,box-shadow] duration-300 sm:size-12 lg:size-14",
                      )}
                      style={{
                        opacity: hovered && !on ? 0.4 : 1,
                        ...(on
                          ? {
                              boxShadow: `0 0 0 1px ${tint}22, 0 14px 40px -10px rgb(18 97 255 / 0.45)`,
                            }
                          : null),
                      }}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute -inset-1.5 rounded-full ring-2 ring-blue/50 transition-opacity duration-300",
                          on ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span
                        ref={(el) => {
                          counterEls.current[n.i] = el;
                        }}
                        className="grid size-full place-items-center will-change-transform"
                      >
                        <span aria-hidden className="size-5 sm:size-5.5 lg:size-6">
                          {node}
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* central orb */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[33%] -translate-x-1/2 -translate-y-1/2">
          <div
            aria-hidden
            className="absolute -inset-[26%] rounded-full bg-[radial-gradient(circle,rgb(18_97_255/0.24),transparent_64%)] blur-[6px]"
          />
          <div className="relative size-full overflow-hidden rounded-full bg-[radial-gradient(circle_at_32%_26%,#8ab8ff_0%,#3d7dff_36%,#1261ff_62%,#0a3ba6_100%)] shadow-[0_20px_54px_-14px_rgb(18_97_255/0.7)]">
            <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 size-full">
              <g stroke="#ffffff" strokeWidth="0.45" opacity="0.3">
                {FACETS.map((f, i) => (
                  <line key={i} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} />
                ))}
              </g>
            </svg>
            <span
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_27%_21%,rgb(255_255_255/0.6),transparent_40%)]"
            />
            <span className="absolute inset-0 grid place-items-center text-[clamp(1.5rem,5.6vw,2.6rem)] leading-none font-extrabold tracking-[-0.04em] text-white [text-shadow:0_2px_12px_rgb(7_26_61/0.35)]">
              {profile.initials}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-[0.85rem] text-muted">Hover on icons to explore</p>
    </div>
  );
}
