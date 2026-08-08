"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SplitRevealProps = {
  children: ReactNode;
  className?: string;
  /** "lines" for headlines, "words" for shorter kickers, "chars" for labels. */
  type?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: ElementType;
  start?: string;
  /** Fire on mount instead of on scroll (hero). */
  immediate?: boolean;
};

/**
 * Masked split-text reveal. Lines rise out of an overflow-hidden mask, which
 * reads far more editorial than a plain fade.
 */
export default function SplitReveal({
  children,
  className,
  type = "lines",
  delay = 0,
  stagger = 0.09,
  duration = DUR.slow,
  as: TagProp = "div",
  start = "top 85%",
  immediate = false,
}: SplitRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(root, { opacity: 1 });
      if (reduced) return;

      const split = new SplitText(root, {
        type: type === "lines" ? "lines" : type === "words" ? "words,lines" : "chars,words",
        linesClass: "split-line",
        mask: type === "chars" ? undefined : "lines",
      });

      const targets =
        type === "lines" ? split.lines : type === "words" ? split.words : split.chars;

      const tween = gsap.from(targets, {
        yPercent: type === "chars" ? 0 : 118,
        opacity: type === "chars" ? 0 : 1,
        rotate: type === "chars" ? 0 : 1.5,
        y: type === "chars" ? 18 : 0,
        duration,
        delay,
        stagger,
        ease: EASE.expo,
        ...(immediate
          ? {}
          : {
              scrollTrigger: { trigger: root, start, once: true },
            }),
      });

      return () => {
        tween.kill();
        split.revert();
      };
    },
    { scope: ref, dependencies: [type] },
  );

  // R3F augments JSX.IntrinsicElements globally, which widens `ElementType`
  // past what TS can resolve here — narrow it back for the render.
  const Tag = TagProp as "div";

  return (
    <Tag ref={ref} className={cn("js-hidden", className)}>
      {children}
    </Tag>
  );
}
