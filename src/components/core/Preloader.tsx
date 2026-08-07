"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const LINES = [
  "INITIALIZING UKM...",
  "LOADING AI SYSTEM...",
  "COMPILING PROJECTS...",
  "SYSTEM READY",
];

/**
 * Developer boot sequence. Counts 0→100 while log lines type in, then wipes
 * upward to reveal the hero. Fires `bm:loaded` so the hero can start its own
 * timeline at exactly the right moment.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.style.overflow = "hidden";

    const finish = () => {
      document.documentElement.style.overflow = "";
      setVisible(false);
      window.dispatchEvent(new Event("bm:loaded"));
    };

    if (reduced) {
      const t = window.setTimeout(finish, 240);
      return () => window.clearTimeout(t);
    }

    const counter = { v: 0 };
    const tl = gsap.timeline();

    tl.to(counter, {
      v: 100,
      duration: 2.15,
      ease: "power2.inOut",
      onUpdate() {
        const v = Math.round(counter.v);
        if (numRef.current) numRef.current.textContent = String(v).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`;
        setLineIndex(Math.min(LINES.length - 1, Math.floor(v / 26)));
      },
    })
      .to(".bm-boot-content", { opacity: 0, y: -18, duration: 0.45, ease: "power2.in" }, "+=0.22")
      .to(
        root.current,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1,
          ease: "expo.inOut",
          onComplete: finish,
        },
        "-=0.1",
      );

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[400] flex flex-col justify-between overflow-hidden bg-bg px-6 py-8 sm:px-12 sm:py-12"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div aria-hidden className="tech-grid pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(18_97_255/0.1),transparent_65%)] blur-2xl"
      />

      <div className="bm-boot-content relative flex items-start justify-between">
        <span className="font-mono text-[0.65rem] tracking-[0.3em] text-blue">BLUE//MOTION</span>
        <span className="font-mono text-[0.65rem] tracking-[0.2em] text-muted">v1.0</span>
      </div>

      <div className="bm-boot-content relative mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-baseline gap-4">
          <span
            ref={numRef}
            className="font-mono text-[clamp(3.5rem,13vw,8rem)] leading-none font-bold tracking-tighter text-ink tabular-nums"
          >
            000
          </span>
          <span className="font-mono text-lg text-blue">%</span>
        </div>

        <div className="relative h-px w-full overflow-hidden bg-line">
          <span
            ref={barRef}
            className="absolute inset-0 origin-left bg-gradient-to-r from-blue to-electric"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <div className="mt-6 h-6 font-mono text-[0.72rem] tracking-[0.16em] text-muted">
          <span className="text-blue">›</span> {LINES[lineIndex]}
          <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-px bg-blue [animation:bm-caret_1s_step-end_infinite]" />
        </div>
      </div>

      <div className="bm-boot-content relative flex justify-between font-mono text-[0.6rem] tracking-[0.2em] text-muted/70">
        <span>UNNI KRISHNAN M</span>
        <span>AI &amp; DATA SCIENCE</span>
      </div>
    </div>
  );
}
