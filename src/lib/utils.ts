import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Deterministic pseudo-random in [0,1) — keeps SSR and client markup identical.
 *
 * The result is rounded to 6 decimals on purpose. `Math.sin` is not guaranteed
 * bit-identical between V8 builds, so Node and the browser can disagree around
 * the 11th decimal; unrounded, that difference reaches the DOM as a hydration
 * mismatch. Rounding here fixes every downstream consumer at once, since plain
 * arithmetic on identical inputs is deterministic.
 */
export function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 1e6) / 1e6;
}
