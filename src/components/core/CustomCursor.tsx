"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Small blue cursor with a trailing ring. Reads `data-cursor="LABEL"` from the
 * nearest ancestor to switch into a labelled state (VIEW / GITHUB / OPEN…).
 * Desktop + fine pointer only.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const labelEl = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const enabled =
      window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled) return;

    document.body.dataset.cursor = "on";

    const d = dot.current!;
    const r = ring.current!;
    const l = labelEl.current!;

    const setDX = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
    const setDY = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
    const setRX = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3.out" });
    const setRY = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3.out" });

    let current = "";

    const onMove = (e: PointerEvent) => {
      setDX(e.clientX);
      setDY(e.clientY);
      setRX(e.clientX);
      setRY(e.clientY);

      const host = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const next = host?.dataset.cursor ?? "";
      const interactive = !!(e.target as HTMLElement)?.closest?.(
        'a,button,[role="button"],input,textarea',
      );

      if (next !== current) {
        current = next;
        if (next) {
          l.textContent = next;
          gsap.to(r, {
            width: 82,
            height: 82,
            borderColor: "rgb(18 97 255 / 0.9)",
            backgroundColor: "rgb(18 97 255 / 0.92)",
            duration: 0.42,
            ease: "expo.out",
          });
          gsap.to(l, { opacity: 1, scale: 1, duration: 0.32, delay: 0.06 });
          gsap.to(d, { scale: 0, duration: 0.25 });
        } else {
          gsap.to(l, { opacity: 0, scale: 0.7, duration: 0.16 });
          gsap.to(r, {
            width: 36,
            height: 36,
            borderColor: "rgb(18 97 255 / 0.5)",
            backgroundColor: "rgb(18 97 255 / 0)",
            duration: 0.42,
            ease: "expo.out",
          });
          gsap.to(d, { scale: 1, duration: 0.3 });
        }
      }

      if (!next) {
        gsap.to(r, { scale: interactive ? 1.5 : 1, duration: 0.3 });
      }
    };

    const onDown = () => gsap.to(r, { scale: 0.82, duration: 0.16 });
    const onUp = () => gsap.to(r, { scale: 1, duration: 0.3 });
    const onLeaveWindow = () => gsap.to([d, r], { opacity: 0, duration: 0.2 });
    const onEnterWindow = () => gsap.to([d, r], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      delete document.body.dataset.cursor;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[300] hidden lg:block">
      <div
        ref={ring}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue/50"
        style={{ width: 36, height: 36, left: 0, top: 0 }}
      >
        <span
          ref={labelEl}
          className="absolute inset-0 flex scale-70 items-center justify-center text-center font-mono text-[0.55rem] font-semibold tracking-[0.14em] text-white opacity-0"
        />
      </div>
      <div
        ref={dot}
        className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue"
        style={{ left: 0, top: 0 }}
      />
    </div>
  );
}
