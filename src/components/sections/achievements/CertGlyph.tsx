"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ConfusionMatrix } from "@/components/core/ai";
import { DUR, EASE, reducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Corner watermark for a credential card. A recorded score becomes a ring gauge
 * that fills to that value; everything else gets a small confusion matrix, so
 * each card reads as a model card rather than a certificate with an award icon.
 */

/** Ring gauge that draws itself to `pct`. */
function ProgressArc({ pct }: { pct: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const arc = el?.querySelector("[data-arc]");
      if (!el || !arc) return;

      if (reducedMotion()) {
        gsap.set(arc, { drawSVG: `0% ${pct}%` });
        return;
      }

      const tw = gsap.fromTo(
        arc,
        { drawSVG: "0% 0%" },
        {
          drawSVG: `0% ${pct}%`,
          duration: DUR.slow,
          ease: EASE.inOut,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        },
      );
      return () => tw.kill();
    },
    { scope: root, dependencies: [pct] },
  );

  return (
    <div ref={root} aria-hidden className="relative size-full">
      <svg viewBox="0 0 100 100" className="size-full" fill="none">
        <g transform="rotate(-90 50 50)">
          <circle cx="50" cy="50" r="38" stroke="#1261ff" strokeOpacity="0.22" strokeWidth="7" />
          <circle
            data-arc
            cx="50"
            cy="50"
            r="38"
            stroke="#1261ff"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#1261ff"
          fontSize="26"
          fontFamily="ui-monospace, monospace"
        >
          {pct}
        </text>
      </svg>
    </div>
  );
}

export default function CertGlyph({
  grade,
  index,
  className,
}: {
  /** The certificate's recorded grade, e.g. `Elite · 75%`. */
  grade: string;
  index: number;
  className?: string;
}) {
  const score = grade.match(/(\d+)\s*%/);

  return (
    <span aria-hidden className={cn("pointer-events-none absolute", className)}>
      {score ? (
        <ProgressArc pct={Number(score[1])} />
      ) : (
        // Vary the matrix order per card so the wall doesn't read as five copies.
        <ConfusionMatrix size={3 + (index % 3)} className="size-full" />
      )}
    </span>
  );
}
