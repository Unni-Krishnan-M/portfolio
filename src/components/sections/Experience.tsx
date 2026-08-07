"use client";

import { useRef } from "react";
import { Briefcase, GraduationCap } from "lucide-react";
import Section from "@/components/core/Section";
import SectionHeader from "@/components/core/SectionHeader";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { education, experience } from "@/data/profile";
import { techMark } from "@/components/icons/tech";
import { cn } from "@/lib/utils";

/** "JUN 2026" → ["JUN", "2026"] so the date column can stack. */
function splitDate(value: string) {
  const [month, year] = value.split(" ");
  return { month, year: year ?? "" };
}

function Node({ live = false, className }: { live?: boolean; className?: string }) {
  return (
    <span
      data-tl-node
      aria-hidden
      className={cn("absolute left-0 size-3.5 -translate-x-1/2", className ?? "top-8 lg:top-10")}
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

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const line = el.querySelector<HTMLElement>("[data-tl-line]");
      const nodes = gsap.utils.toArray<HTMLElement>("[data-tl-node]", el);
      const cards = gsap.utils.toArray<HTMLElement>("[data-tl-card]", el);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set(line, { scaleY: 1 });
        gsap.set(cards, { opacity: 1, x: 0 });
        nodes.forEach((n) => {
          gsap.set(n.querySelector("[data-node-fill]"), { scale: 1 });
          gsap.set(n.querySelector("[data-node-ring]"), { opacity: 0 });
        });
        return;
      }

      // The spine draws itself as the section scrolls past.
      gsap.set(line, { scaleY: 0, transformOrigin: "top center" });
      gsap.to(line, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 60%", scrub: 0.7 },
      });

      // Each node ignites as the drawing front reaches it.
      nodes.forEach((node) => {
        const fill = node.querySelector("[data-node-fill]");
        const ring = node.querySelector("[data-node-ring]");
        gsap.set(fill, { scale: 0 });
        gsap.set(ring, { opacity: 0 });

        const tl = gsap
          .timeline({ paused: true })
          .to(fill, { scale: 1, duration: 0.45, ease: "back.out(2.4)" })
          .fromTo(
            ring,
            { opacity: 0.7, scale: 0.8 },
            { opacity: 0, scale: 2.3, duration: 1.1, ease: "power2.out" },
            0,
          );

        ScrollTrigger.create({
          trigger: node,
          start: "top 74%",
          once: true,
          onEnter: () => tl.play(),
        });
      });

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: 52 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 82%", once: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <Section id="experience">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
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
        </div>

        {/* Timeline */}
        <div ref={root} className="relative pl-9 sm:pl-12">
          {/* static rail + drawn blue overlay */}
          <span
            aria-hidden
            className="absolute bottom-2 left-[7px] top-3 w-px -translate-x-1/2 bg-line"
          />
          <span
            aria-hidden
            data-tl-line
            className="absolute bottom-2 left-[7px] top-3 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-blue via-blue to-electric"
          />

          <ol className="flex flex-col gap-10 lg:gap-14">
            {experience.map((item) => {
              const from = splitDate(item.start);
              const to = splitDate(item.end);

              return (
                <li key={`${item.company}-${item.start}`} className="relative">
                  <Node />
                  {/* connector stub from rail to card */}
                  <span
                    aria-hidden
                    className="absolute left-[7px] top-8 h-px w-6 bg-gradient-to-r from-blue/40 to-transparent sm:w-9 lg:top-10"
                  />

                  <article
                    data-tl-card
                    className="js-hidden card-soft relative overflow-hidden"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-bg-2 shadow-soft ring-1 ring-blue/10 sm:right-5 sm:top-5 sm:size-12"
                    >
                      <Briefcase className="size-5 text-blue" strokeWidth={2.1} />
                    </span>

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
                      <div className="min-w-0 flex-1 border-line px-6 py-6 pr-16 sm:border-l sm:px-7 sm:py-7 sm:pr-20">
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

                        <ul className="mt-5 flex flex-wrap gap-2">
                          {item.stack.map((tech) => {
                            const { node } = techMark(tech);
                            return (
                              <li
                                key={tech}
                                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted"
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
                </li>
              );
            })}

            {/* live end point */}
            <li className="relative">
              <Node live className="top-[1.55rem] lg:top-[2.05rem]" />
              <div
                data-tl-card
                className="js-hidden flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 lg:pt-7"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-blue px-3 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-[0.22em] text-white">
                  <GraduationCap aria-hidden className="size-3.5" />
                  NOW
                </span>
                <p className="text-[0.86rem] text-muted">
                  B.Tech AI &amp; DS · graduating {education.graduation}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </Section>
  );
}
