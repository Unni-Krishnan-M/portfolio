"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/data/profile";

/**
 * Tracks which section owns the viewport centre. Shared by the nav and the
 * left scroll rail so they can never disagree.
 */
export function useActiveSection() {
  const [active, setActive] = useState<string>(navItems[0].id as string);

  useEffect(() => {
    const pick = () => {
      const mid = window.innerHeight * 0.42;
      let current: string = navItems[0].id;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= mid) current = item.id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  return active;
}

/** Global 0→1 document scroll progress. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}
