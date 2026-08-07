"use client";

import { useCallback, useEffect, useLayoutEffect, useSyncExternalStore } from "react";

export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const neverChanges = () => () => {};

/**
 * Matches a media query. Modelled as an external store rather than
 * effect-plus-setState so React reads it during render and there's no
 * cascading re-render on mount. Returns `false` during SSR.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export const useReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/** True on pointer-fine devices wide enough for the full immersive build. */
export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px) and (pointer: fine)");
}

/** False on the server, true on the client — for anything that must not SSR. */
export function useMounted() {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

/* ------------------------------------------------------------------ */
/* Boot handshake                                                      */
/* ------------------------------------------------------------------ */

/**
 * The preloader dispatches `bm:loaded` when its wipe finishes. Sections that
 * need to start their entrance at that exact moment subscribe here.
 *
 * Modelled as a one-shot external store, which means a late subscriber still
 * reads `true` immediately instead of waiting for an event it already missed.
 */
let bootReady = false;
const bootListeners = new Set<() => void>();

function markBootReady() {
  if (bootReady) return;
  bootReady = true;
  for (const notify of bootListeners) notify();
}

if (typeof window !== "undefined") {
  window.addEventListener("bm:loaded", markBootReady, { once: true });
  // Safety net: never leave the hero hidden if the event is missed.
  window.setTimeout(markBootReady, 2800);
}

export function useBootReady() {
  return useSyncExternalStore(
    (onChange: () => void) => {
      bootListeners.add(onChange);
      return () => {
        bootListeners.delete(onChange);
      };
    },
    () => bootReady,
    () => false,
  );
}
