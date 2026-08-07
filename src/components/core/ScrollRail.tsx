"use client";

import { navItems } from "@/data/profile";
import { useActiveSection, useScrollProgress } from "./useActiveSection";
import { scrollToId } from "./SmoothScroll";
import { cn } from "@/lib/utils";

/**
 * Left-hand vertical progress rail: a blue line that grows with scroll, with a
 * numbered node per section. Desktop only — it would crowd small screens.
 */
export default function ScrollRail() {
  const active = useActiveSection();
  const progress = useScrollProgress();
  const activeIndex = Math.max(
    0,
    navItems.findIndex((n) => n.id === active),
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-1/2 left-6 z-[150] hidden -translate-y-1/2 xl:block"
    >
      <div className="relative flex flex-col gap-7 pl-px">
        {/* track */}
        <span className="absolute top-1 bottom-1 left-[3px] w-px bg-line" />
        {/* progress */}
        <span
          className="absolute top-1 left-[3px] w-px origin-top bg-gradient-to-b from-blue to-electric transition-[height] duration-150 ease-out"
          style={{ height: `calc(${progress * 100}% - 2px)` }}
        />

        {navItems.map((item, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToId(item.id)}
              className="pointer-events-auto group relative flex items-center gap-3.5 text-left"
              aria-label={`Go to ${item.label}`}
            >
              <span className="relative flex size-[7px] shrink-0 items-center justify-center">
                <span
                  className={cn(
                    "size-[7px] rounded-full border transition-all duration-400",
                    isActive
                      ? "scale-125 border-blue bg-blue"
                      : isPast
                        ? "border-blue/60 bg-blue/60"
                        : "border-line bg-bg",
                  )}
                />
                {isActive ? (
                  <span className="absolute size-[7px] rounded-full bg-blue [animation:bm-pulse-ring_2s_ease-out_infinite]" />
                ) : null}
              </span>

              <span
                className={cn(
                  "flex items-baseline gap-2 font-mono text-[0.6rem] tracking-[0.16em] transition-all duration-400",
                  isActive
                    ? "translate-x-0 text-ink opacity-100"
                    : "-translate-x-1 text-muted/60 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                )}
              >
                <span className={isActive ? "text-blue" : ""}>{item.index}</span>
                <span>{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
