"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Direction the content travels in from. */
  from?: "bottom" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  distance?: number;
  /** Stagger direct children instead of animating the wrapper. */
  stagger?: number;
  as?: ElementType;
  start?: string;
  once?: boolean;
};

/**
 * Scroll-triggered entrance. One shared implementation so timing and easing
 * stay consistent across every section.
 */
export default function Reveal({
  children,
  className,
  from = "bottom",
  delay = 0,
  duration = 1,
  distance = 34,
  stagger,
  as: TagProp = "div",
  start = "top 85%",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const targets = stagger ? Array.from(root.children) : [root];
      if (!targets.length) return;

      const fromVars: gsap.TweenVars = { opacity: 0 };
      if (from === "bottom") fromVars.y = distance;
      if (from === "left") fromVars.x = -distance;
      if (from === "right") fromVars.x = distance;
      if (from === "scale") {
        fromVars.scale = 0.94;
        fromVars.y = distance * 0.4;
      }

      gsap.set(root, { opacity: 1 });
      gsap.from(targets, {
        ...fromVars,
        duration,
        delay,
        stagger: stagger ?? 0,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start, once, toggleActions: "play none none none" },
      });
    },
    { scope: ref },
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
