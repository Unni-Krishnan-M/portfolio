"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Section from "@/components/core/Section";
import SectionHeader from "@/components/core/SectionHeader";
import MagneticButton from "@/components/core/MagneticButton";
import { GithubIcon } from "@/components/icons/Brand";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIsDesktop, useReducedMotion } from "@/lib/hooks";
import { profile } from "@/data/profile";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import ProjectCard from "./projects/ProjectCard";
import ProjectOverlay from "./projects/ProjectOverlay";

type OpenState = { project: Project; origin: { x: number; y: number } } | null;

export default function Projects() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const horizontal = isDesktop && !reduced;

  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const [tween, setTween] = useState<gsap.core.Tween | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState<OpenState>(null);

  useGSAP(
    () => {
      if (!horizontal) {
        st.current = null;
        setTween(null);
        return;
      }
      const wrapEl = wrap.current;
      const trackEl = track.current;
      if (!wrapEl || !trackEl) return;

      // Distance the track has to travel to bring its last card flush right.
      const distance = () => Math.max(0, trackEl.scrollWidth - wrapEl.offsetWidth);

      const t = gsap.to(trackEl, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapEl,
          start: "center center",
          // Pace: a little over one viewport of scrolling per card.
          end: () => `+=${distance() + window.innerHeight * 0.4}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.round(self.progress * (projects.length - 1));
            setActiveIndex((prev) => (prev === i ? prev : i));
          },
        },
      });

      st.current = t.scrollTrigger ?? null;
      // Cards need the tween to drive their own `containerAnimation` triggers.
      setTween(t);

      return () => {
        st.current = null;
        setTween(null);
      };
    },
    { scope: wrap, dependencies: [horizontal] },
  );

  /** Scroll the pinned timeline to a given card index. */
  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(projects.length - 1, index));

      if (!horizontal || !st.current) {
        // Vertical layout: just scroll the card into view.
        document
          .querySelectorAll("[data-project-card]")
          [clamped]?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const trigger = st.current;
      const progress = clamped / Math.max(1, projects.length - 1);
      const target = trigger.start + progress * (trigger.end - trigger.start);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).__lenis;
      if (lenis?.scrollTo) lenis.scrollTo(target, { duration: 1.1 });
      else window.scrollTo({ top: target, behavior: "smooth" });
    },
    [horizontal],
  );

  const header = (
    <SectionHeader
      index="04"
      label="PROJECTS"
      title={
        <>
          Things I&apos;ve <span className="text-blue">Built</span>
        </>
      }
      blurb="Every one of these is a real repository. Where something is a scaffold, a prototype or has mock endpoints, the case study says so."
      action={
        <div className="flex items-center gap-3">
          <MagneticButton href={profile.github} external variant="ghost" cursor="GITHUB">
            <GithubIcon className="size-4" />
            View All Projects
          </MagneticButton>
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous project"
              className="flex size-11 items-center justify-center rounded-full border border-line bg-bg-2 text-ink transition-all duration-300 hover:border-blue/40 hover:text-blue disabled:opacity-35"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === projects.length - 1}
              aria-label="Next project"
              className="flex size-11 items-center justify-center rounded-full border border-line bg-bg-2 text-ink transition-all duration-300 hover:border-blue/40 hover:text-blue disabled:opacity-35"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      }
    />
  );

  const cards = projects.map((p, i) => (
    <ProjectCard
      key={p.slug}
      project={p}
      index={i}
      onOpen={(project, origin) => setOpen({ project, origin })}
      containerAnimation={horizontal ? tween : null}
      horizontal={horizontal}
    />
  ));

  return (
    <>
      <Section id="projects" full className="py-24 sm:py-32 lg:py-40">
        <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-10 xl:pl-24">{header}</div>

        {horizontal ? (
          <div ref={wrap} className="relative mt-16 overflow-hidden">
            <div
              ref={track}
              className="flex w-max gap-7 px-6 will-change-transform sm:px-10 xl:pl-24"
            >
              {cards}
            </div>

            {/* progress */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-4">
              <span className="font-mono text-[0.65rem] tracking-[0.16em] text-muted">
                <span className="text-blue">{String(activeIndex + 1).padStart(2, "0")}</span>
                {" / "}
                {String(projects.length).padStart(2, "0")}
              </span>
              <span className="flex items-center gap-1.5">
                {projects.map((p, i) => (
                  <span
                    key={p.slug}
                    className={cn(
                      "h-0.5 rounded-full transition-all duration-500",
                      i === activeIndex ? "w-7 bg-blue" : "w-3 bg-line",
                    )}
                  />
                ))}
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-14 grid w-full max-w-[84rem] gap-6 px-6 sm:grid-cols-2 sm:px-10 xl:pl-24">
            {cards}
          </div>
        )}
      </Section>

      {open ? (
        <ProjectOverlay
          project={open.project}
          origin={open.origin}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </>
  );
}
