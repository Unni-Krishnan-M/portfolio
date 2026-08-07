"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes } from "lucide-react";
import Section from "@/components/core/Section";
import Reveal from "@/components/core/Reveal";
import SplitReveal from "@/components/core/SplitReveal";
import Constellation from "./toolkit/Constellation";
import { toolkit } from "@/data/profile";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks";

/** Which category owns a given technology name — first match wins. */
const CATEGORY_OF: Record<string, string> = {};
for (const cat of toolkit) {
  for (const item of cat.items) {
    if (!(item.name in CATEGORY_OF)) CATEGORY_OF[item.name] = cat.id;
  }
}

export default function Toolkit() {
  const [activeId, setActiveId] = useState(toolkit[0].id);
  const [hovered, setHovered] = useState<string | null>(null);
  const tabEls = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();

  // Hovering a node previews its category; clicking pins it.
  const shownId = (hovered ? CATEGORY_OF[hovered] : undefined) ?? activeId;
  const shown = toolkit.find((c) => c.id === shownId) ?? toolkit[0];

  const onSelect = useCallback((name: string) => {
    const id = CATEGORY_OF[name];
    if (id) setActiveId(id);
  }, []);

  const onTabKey = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const last = toolkit.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = idx === last ? 0 : idx + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = idx === 0 ? last : idx - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActiveId(toolkit[next].id);
    setHovered(null);
    tabEls.current[next]?.focus();
  };

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <Section id="toolkit">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,16.5rem)] lg:items-center lg:gap-8 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,19rem)] xl:gap-10">
        {/* ---- masthead + category tabs ---- */}
        <div>
          <Reveal from="left" className="mb-5 flex items-center gap-3">
            <span className="font-mono text-[0.7rem] font-medium text-muted/70">03</span>
            <span className="h-px w-8 bg-gradient-to-r from-blue to-transparent" />
            <span className="label-tech">My Toolkit</span>
          </Reveal>

          <SplitReveal as="h2" type="lines" className="display-md text-ink">
            Technologies
            <br />I <span className="text-blue">Work</span> With
          </SplitReveal>

          <div
            role="tablist"
            aria-label="Technology categories"
            className={cn(
              "mt-7 -mx-6 flex gap-2 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "snap-x snap-mandatory",
              "lg:card-soft lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:p-2 lg:pb-2",
            )}
          >
            {toolkit.map((cat, i) => {
              const on = cat.id === shownId;
              return (
                <button
                  key={cat.id}
                  ref={(el) => {
                    tabEls.current[i] = el;
                  }}
                  id={`tk-tab-${cat.id}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="tk-panel"
                  tabIndex={cat.id === activeId ? 0 : -1}
                  onClick={() => {
                    setActiveId(cat.id);
                    setHovered(null);
                  }}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    "relative flex shrink-0 snap-start items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-[0.86rem] font-semibold whitespace-nowrap",
                    "outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-blue/50",
                    "lg:w-full lg:shrink lg:rounded-lg lg:px-3.5 lg:py-3",
                    on
                      ? "bg-blue text-white shadow-[0_10px_26px_-10px_rgb(18_97_255/0.6)]"
                      : "bg-bg-2 text-muted ring-1 ring-line hover:text-ink lg:bg-transparent lg:ring-0 lg:hover:bg-soft",
                  )}
                >
                  <Boxes
                    aria-hidden
                    className={cn("size-4 shrink-0", on ? "text-white" : "text-blue/70")}
                    strokeWidth={2}
                  />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- constellation ---- */}
        <Constellation hovered={hovered} onHover={setHovered} onSelect={onSelect} />

        {/* ---- detail panel ---- */}
        <div
          id="tk-panel"
          role="tabpanel"
          aria-labelledby={`tk-tab-${shown.id}`}
          className="card-soft overflow-hidden p-5 sm:p-6"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={shown.id}
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -12 }}
              transition={{ duration: reduced ? 0 : 0.34, ease }}
            >
              <p className="label-tech">{shown.label}</p>
              <p className="mt-3 text-[0.8rem] leading-snug text-muted">{shown.blurb}</p>

              <ul className="mt-4 divide-y divide-line border-t border-line">
                {shown.items.map((item) => {
                  const on = hovered === item.name;
                  return (
                    <li key={item.name} className="relative py-3 pl-3">
                      <span
                        aria-hidden
                        className={cn(
                          "absolute top-3 bottom-3 left-0 w-[2px] rounded-full bg-blue transition-opacity duration-300",
                          on ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <p
                        className={cn(
                          "text-[0.9rem] font-semibold transition-colors duration-300",
                          on ? "text-blue" : "text-ink",
                        )}
                      >
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-[0.78rem] leading-snug text-muted">{item.note}</p>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
