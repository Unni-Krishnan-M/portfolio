"use client";

import { gsap } from "@/lib/gsap";

/**
 * Shared motion vocabulary.
 *
 * Every section reaching for its own easing and duration is what makes a site
 * feel assembled rather than designed. Import from here instead.
 */
export const EASE = {
  /** Default for entrances — decelerates hard, settles clean. */
  out: "power3.out",
  /** Symmetric, for things that travel between two states. */
  inOut: "power2.inOut",
  /** The most "cinematic" — use for headline and hero-scale moves. */
  expo: "expo.out",
  /** Scrubbed scroll timelines: never ease, the scrollbar is the easing. */
  none: "none",
} as const;

export const DUR = {
  fast: 0.42,
  base: 0.72,
  slow: 1.1,
  /** Ambient loops. */
  amble: 2.6,
} as const;

/** Stagger presets, so rhythm is consistent across sections. */
export const STAGGER = {
  tight: 0.045,
  base: 0.075,
  loose: 0.12,
} as const;

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type RevealOpts = {
  from?: "up" | "down" | "left" | "right" | "scale" | "none";
  distance?: number;
  delay?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  ease?: string;
  /** Pass a container to scope a ScrollTrigger to it. */
  trigger?: Element | null;
};

/**
 * The one entrance helper. Returns the tween so callers can kill it, and no-ops
 * into the final state under reduced motion.
 */
export function reveal(
  targets: gsap.TweenTarget,
  {
    from = "up",
    distance = 28,
    delay = 0,
    duration = DUR.base,
    stagger = 0,
    start = "top 85%",
    ease = EASE.out,
    trigger,
  }: RevealOpts = {},
) {
  const list = gsap.utils.toArray<Element>(targets);
  if (!list.length) return null;

  if (reducedMotion()) {
    gsap.set(list, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: "transform" });
    return null;
  }

  const fromVars: gsap.TweenVars = { opacity: 0 };
  if (from === "up") fromVars.y = distance;
  if (from === "down") fromVars.y = -distance;
  if (from === "left") fromVars.x = -distance;
  if (from === "right") fromVars.x = distance;
  if (from === "scale") {
    fromVars.scale = 0.94;
    fromVars.y = distance * 0.35;
  }

  return gsap.fromTo(
    list,
    fromVars,
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger: { trigger: trigger ?? (list[0] as Element), start, once: true },
    },
  );
}
