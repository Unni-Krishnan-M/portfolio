"use client";

import { useRef } from "react";
import { GraduationCap } from "lucide-react";
import Section from "@/components/core/Section";
import SectionHeader from "@/components/core/SectionHeader";
import { LossCurve, NotebookCell, Readout } from "@/components/core/ai";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER, reducedMotion, reveal } from "@/lib/motion";
import { education, experience, type ExperienceItem } from "@/data/profile";
import { techMark } from "@/components/icons/tech";
import { cn } from "@/lib/utils";

/**
 * The journey reads as a training run: one notebook, cells executing top to
 * bottom, the loss curve behind the masthead. Every value in the telemetry
 * strips is derived from `src/data/profile.ts` — nothing is asserted here.
 */

/** Width of the rail column, and therefore where the spine sits. */
const RAIL_COL = "0.875rem";
const RAIL_X = "0.4375rem"; // RAIL_COL / 2
/** Shared vertical anchor for a row's node, connector and `In [n]:` label. */
const NODE_Y = "top-3";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** "JUN 2026" → ["JUN", "2026"] so the date column can stack. */
function splitDate(value: string) {
  const [month, year] = value.split(" ");
  return { month, year: year ?? "" };
}

/** Prefers an explicit week count from `meta`, else the inclusive month span. */
function durationOf(item: ExperienceItem) {
  const weeks = item.meta.match(/(\d+)\s*weeks?/i);
  if (weeks) return `${weeks[1]} weeks`;

  const from = splitDate(item.start);
  const to = splitDate(item.end);
  const months =
    (Number(to.year) - Number(from.year)) * 12 +
    (MONTHS.indexOf(to.month) - MONTHS.indexOf(from.month)) +
    1;
  return months === 1 ? "1 month" : `${months} months`;
}

/** "Completed 4 project-based tasks…" → `tasks 4`. */
function volumeOf(item: ExperienceItem): { k: string; v: string } | null {
  for (const point of item.points) {
    const tasks = point.match(/\b(\d+)\s+(?:project-based\s+)?tasks?\b/i);
    if (tasks) return { k: "tasks", v: tasks[1] };
  }
  if (item.points.some((p) => /day-wise/i.test(p))) return { k: "cadence", v: "day-wise" };
  return null;
}

function telemetry(item: ExperienceItem) {
  const volume = volumeOf(item);
  return [
    { k: "duration", v: durationOf(item) },
    ...(volume ? [volume] : []),
    { k: "stack", v: item.stack.slice(0, 2).join(" · ") },
  ];
}

function Node({ live = false }: { live?: boolean }) {
  return (
    <span
      data-tl-node
      aria-hidden
      className={cn("absolute left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2", NODE_Y)}
    >
      <span className="absolute inset-0 rounded-full border border-line bg-bg-2" />
      <span data-node-fill className="absolute inset-[3px] rounded-full bg-blue" />
      <span
        data-node-ring
        className={cn(
          "absolute inset-0 rounded-full border border-blue/70",
          live && "[animation:bm-pulse-ring_2.4s_ease-out_infinite]",
        )}
      />
    </span>
  );
}

/** Rail cell: the node plus the hairline that reaches the notebook gutter. */
function RailCell({ live = false }: { live?: boolean }) {
  return (
    <div className="relative">
      <Node live={live} />
      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 h-px w-[calc(50%+1rem)] -translate-y-1/2 bg-gradient-to-r from-blue/45 to-transparent sm:w-[calc(50%+1.5rem)]",
          NODE_Y,
        )}
      />
    </div>
  );
}

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const line = el.querySelector<HTMLElement>("[data-tl-line]");
      const track = el.querySelector<HTMLElement>("[data-tl-track]");
      const pulse = el.querySelector<HTMLElement>("[data-tl-pulse]");
      const halo = el.querySelector<HTMLElement>("[data-tl-halo]");
      const nodes = gsap.utils.toArray<HTMLElement>("[data-tl-node]", el);
      const cards = gsap.utils.toArray<HTMLElement>("[data-tl-card]", el);

      const settleNodes = () =>
        nodes.forEach((n) => {
          gsap.set(n.querySelector("[data-node-fill]"), { scale: 1 });
          gsap.set(n.querySelector("[data-node-ring]"), { opacity: 0 });
        });

      if (reducedMotion()) {
        gsap.set(line, { scaleY: 1 });
        gsap.set(cards, { opacity: 1, x: 0 });
        gsap.set([pulse, halo], { opacity: 0 });
        gsap.set(gsap.utils.toArray<HTMLElement>("[data-tl-chip]", el), { opacity: 1, scale: 1 });
        settleNodes();
        return;
      }

      // The spine draws itself as the section scrolls past, and a pulse rides
      // the drawing front the whole way down.
      gsap.set(line, { transformOrigin: "top center" });
      const spine = gsap.timeline({
        defaults: { ease: EASE.none },
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
      spine
        .fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
        .fromTo(pulse, { y: 0, opacity: 0 }, { opacity: 1, duration: 0.05 }, 0)
        .to(pulse, { y: () => track?.offsetHeight ?? 0, duration: 1 }, 0)
        .to(pulse, { opacity: 0, duration: 0.07 }, 0.93);

      // The pulse emits a ripple continuously while it travels.
      const ripple = gsap.fromTo(
        halo,
        { scale: 1, opacity: 0.55 },
        { scale: 3.2, opacity: 0, duration: 1.3, repeat: -1, ease: EASE.out },
      );

      // Each node ignites as the drawing front reaches it.
      const triggers: ScrollTrigger[] = [];
      nodes.forEach((node) => {
        const fill = node.querySelector("[data-node-fill]");
        const ring = node.querySelector("[data-node-ring]");
        gsap.set(fill, { scale: 0 });
        gsap.set(ring, { opacity: 0 });

        const tl = gsap
          .timeline({ paused: true })
          .to(fill, { scale: 1, duration: DUR.fast, ease: "back.out(2.4)" })
          .fromTo(
            ring,
            { opacity: 0.7, scale: 0.8 },
            { opacity: 0, scale: 2.3, duration: DUR.slow, ease: EASE.out },
            0,
          );

        triggers.push(
          ScrollTrigger.create({
            trigger: node,
            start: "top 74%",
            once: true,
            onEnter: () => tl.play(),
          }),
        );
      });

      cards.forEach((card) => {
        reveal(card, { from: "right", distance: 52, duration: DUR.slow, ease: EASE.expo });
        const chips = card.querySelectorAll("[data-tl-chip]");
        if (chips.length) {
          reveal(chips, {
            from: "scale",
            distance: 6,
            duration: DUR.fast,
            stagger: STAGGER.tight,
            delay: 0.22,
            trigger: card,
          });
        }
      });

      return () => {
        spine.kill();
        ripple.kill();
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: root },
  );

  return (
    <Section id="experience">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="relative lg:sticky lg:top-32 lg:self-start">
          {/* the learning curve, literally — decorative, behind the masthead */}
          <LossCurve
            label="training loss"
            className="pointer-events-none absolute -left-2 bottom-0 h-44 w-[min(100%,24rem)] translate-y-[34%] opacity-[0.14] sm:h-52"
          />

          <div className="relative z-10">
            <SectionHeader
              index="05"
              label="EXPERIENCE"
              title={
                <>
                  Learning.
                  <br />
                  Building.
                  <br />
                  <span className="text-blue">Growing.</span>
                </>
              }
              blurb="Two internships, one degree in progress, and a habit of turning every course into something that runs."
            />
            <p
              aria-hidden
              className="mt-8 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted/60"
            >
              journey.ipynb · {experience.length + 1} cells
            </p>
          </div>
        </div>

        {/* Timeline — a notebook executing top to bottom */}
        <div ref={root} className="relative">
          {/* static rail, drawn overlay, and the travelling pulse share one x */}
          <span
            aria-hidden
            className="absolute bottom-2 top-3 w-px -translate-x-1/2 bg-line"
            style={{ left: RAIL_X }}
          />
          <span
            aria-hidden
            data-tl-line
            className="absolute bottom-2 top-3 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-blue via-blue to-electric"
            style={{ left: RAIL_X }}
          />
          <span
            aria-hidden
            data-tl-track
            className="pointer-events-none absolute bottom-2 top-3 w-px -translate-x-1/2"
            style={{ left: RAIL_X }}
          >
            <span data-tl-pulse className="absolute -left-[3px] top-0 size-[7px] -translate-y-1/2">
              <span className="absolute inset-0 rounded-full bg-electric" />
              <span data-tl-halo className="absolute inset-0 rounded-full bg-electric/50" />
            </span>
          </span>

          <ol className="flex flex-col gap-10 lg:gap-14">
            {experience.map((item, i) => {
              const from = splitDate(item.start);
              const to = splitDate(item.end);

              return (
                <li
                  key={`${item.company}-${item.start}`}
                  className="grid gap-x-4 sm:gap-x-6"
                  style={{ gridTemplateColumns: `${RAIL_COL} minmax(0, 1fr)` }}
                >
                  <RailCell />

                  <NotebookCell n={i + 1}>
                    <article data-tl-card className="js-hidden card-soft overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        {/* date column */}
                        <div className="flex shrink-0 items-center justify-start gap-3 border-b border-line bg-soft px-6 py-4 font-mono text-blue sm:w-28 sm:flex-col sm:justify-center sm:gap-2 sm:border-b-0 sm:px-4 sm:py-8">
                          <span className="text-center text-[0.82rem] font-semibold leading-tight">
                            <span className="block">{from.month}</span>
                            <span className="block">{from.year}</span>
                          </span>
                          <span className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.2em] text-blue/45">
                            <span aria-hidden className="h-px w-4 bg-blue/20" />
                            to
                            <span aria-hidden className="h-px w-4 bg-blue/20" />
                          </span>
                          <span className="text-center text-[0.82rem] font-semibold leading-tight">
                            <span className="block">{to.month}</span>
                            <span className="block">{to.year}</span>
                          </span>
                        </div>

                        {/* content */}
                        <div className="min-w-0 flex-1 border-line px-6 py-6 sm:border-l sm:px-7 sm:py-7">
                          <h3 className="text-[1.05rem] font-bold tracking-tight text-ink sm:text-[1.15rem]">
                            {item.role}
                          </h3>
                          <p className="mt-1.5 text-[0.85rem] text-muted">
                            <span className="font-medium text-ink/70">{item.company}</span>
                            <span aria-hidden className="mx-2 text-line">
                              |
                            </span>
                            {item.meta}
                          </p>

                          <Readout className="mt-3.5" items={telemetry(item)} />

                          <ul className="mt-4 space-y-2.5">
                            {item.points.map((point) => (
                              <li
                                key={point}
                                className="flex gap-2.5 text-[0.85rem] leading-relaxed text-muted"
                              >
                                <span
                                  aria-hidden
                                  className="mt-[0.5rem] size-[5px] shrink-0 rounded-full bg-blue/50"
                                />
                                {point}
                              </li>
                            ))}
                          </ul>

                          <ul className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                            {item.stack.map((tech) => {
                              const { node } = techMark(tech);
                              return (
                                <li
                                  key={tech}
                                  data-tl-chip
                                  className="js-hidden inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted"
                                >
                                  <span aria-hidden className="size-3.5">
                                    {node}
                                  </span>
                                  {tech}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </article>
                  </NotebookCell>
                </li>
              );
            })}

            {/* live end point — the cell that is still running */}
            <li
              className="grid gap-x-4 sm:gap-x-6"
              style={{ gridTemplateColumns: `${RAIL_COL} minmax(0, 1fr)` }}
            >
              <RailCell live />

              <NotebookCell n={experience.length + 1}>
                <div
                  data-tl-card
                  className="js-hidden flex flex-wrap items-center gap-x-4 gap-y-2"
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue px-3 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-[0.22em] text-white">
                    <GraduationCap aria-hidden className="size-3.5" />
                    NOW
                  </span>
                  <p className="text-[0.86rem] text-muted">
                    B.Tech AI &amp; DS · graduating {education.graduation}
                  </p>
                </div>
              </NotebookCell>
            </li>
          </ol>
        </div>
      </div>
    </Section>
  );
}
