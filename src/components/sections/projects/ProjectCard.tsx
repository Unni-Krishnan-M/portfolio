"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { GithubIcon } from "@/components/icons/Brand";
import { techMark } from "@/components/icons/tech";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import ProjectVisual from "./ProjectVisual";

type Props = {
  project: Project;
  index: number;
  onOpen: (project: Project, origin: { x: number; y: number }) => void;
  /** The horizontal track tween, so entrances can trigger off x-position. */
  containerAnimation?: gsap.core.Tween | gsap.core.Timeline | null;
  horizontal: boolean;
};

export default function ProjectCard({
  project,
  index,
  onOpen,
  containerAnimation,
  horizontal,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        setActive(true);
        gsap.set(el, { opacity: 1 });
        gsap.set(el.querySelectorAll("[data-stage]"), { opacity: 1, y: 0, x: 0, scale: 1 });
        return;
      }

      // Staged assembly: number → title → chips → visual → body → footer.
      const tl = gsap.timeline({
        paused: true,
        onStart: () => setActive(true),
      });

      tl.fromTo(el, { opacity: 0, scale: 0.9, rotate: 2 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.75, ease: "expo.out" })
        .fromTo('[data-stage="num"]', { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.5 }, 0.08)
        .fromTo('[data-stage="title"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.14)
        .fromTo('[data-stage="visual"]', { opacity: 0, scaleY: 0.72, transformOrigin: "50% 50%" }, { opacity: 1, scaleY: 1, duration: 0.7, ease: "expo.out" }, 0.2)
        .fromTo('[data-stage="chip"]', { opacity: 0, y: 12, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.05 }, 0.34)
        .fromTo('[data-stage="body"]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55 }, 0.42)
        .fromTo('[data-stage="foot"]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 0.52);

      const st = ScrollTrigger.create({
        trigger: el,
        // In the pinned horizontal track, position is driven by the track tween.
        ...(horizontal && containerAnimation ? { containerAnimation, start: "left 92%" } : { start: "top 88%" }),
        once: true,
        onEnter: () => tl.play(),
      });

      return () => {
        st.kill();
        tl.kill();
      };
    },
    { scope: root, dependencies: [horizontal, containerAnimation] },
  );

  // Cursor-following blue light — written straight to CSS vars, no re-render.
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = root.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const open = (e: React.MouseEvent) => onOpen(project, { x: e.clientX, y: e.clientY });

  return (
    <article
      ref={root}
      data-project-card
      data-cursor="VIEW PROJECT"
      onMouseMove={onMove}
      className={cn(
        "group card-soft relative flex shrink-0 flex-col overflow-hidden opacity-0",
        "transition-[box-shadow,transform,border-color] duration-500 hover:-translate-y-1.5 hover:border-blue/25 hover:shadow-lift",
        horizontal ? "w-[clamp(20rem,26vw,25rem)]" : "w-full",
      )}
    >
      {/* cursor light */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(20rem 20rem at var(--mx, 50%) var(--my, 50%), rgba(18,97,255,0.12), transparent 65%)",
        }}
      />

      <button
        type="button"
        onClick={open}
        aria-label={`Open case study for ${project.name}`}
        className="relative block cursor-none text-left"
      >
        <span data-stage="visual" className="block">
          <ProjectVisual variant={project.visual} active={active} className="aspect-16/10 w-full" />
        </span>

        {/* number + live badge over the visual */}
        <span
          data-stage="num"
          className="absolute top-3 left-4 font-mono text-[0.7rem] font-semibold tracking-[0.16em] text-white/45"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {project.live ? (
          <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 backdrop-blur-sm">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 rounded-full bg-electric [animation:bm-pulse-ring_1.8s_ease-out_infinite]" />
              <span className="relative size-1.5 rounded-full bg-electric" />
            </span>
            <span className="font-mono text-[0.55rem] tracking-[0.16em] text-white/90">LIVE</span>
          </span>
        ) : null}

        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-400 group-hover:opacity-100">
          <span className="flex size-12 items-center justify-center rounded-full bg-blue/90 text-white shadow-glow backdrop-blur-sm">
            <Maximize2 className="size-4.5" />
          </span>
        </span>
      </button>

      <div className="relative z-10 flex flex-1 flex-col p-6">
        <h3 data-stage="title" className="text-[1.28rem] leading-tight font-bold tracking-tight text-ink">
          {project.name}
        </h3>
        <p data-stage="title" className="label-tech mt-2 text-[0.6rem] text-muted/85">
          {project.category}
        </p>

        <p data-stage="body" className="mt-4 flex-1 text-[0.87rem] leading-relaxed text-muted">
          {project.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech) => {
            const { node } = techMark(tech);
            return (
              <span
                key={tech}
                data-stage="chip"
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg px-2 py-1 text-[0.68rem] font-medium text-muted"
              >
                <span className="size-3">{node}</span>
                {tech}
              </span>
            );
          })}
          {project.stack.length > 4 ? (
            <span
              data-stage="chip"
              className="inline-flex items-center rounded-md border border-line bg-bg px-2 py-1 font-mono text-[0.64rem] text-muted/70"
            >
              +{project.stack.length - 4}
            </span>
          ) : null}
        </div>

        <div
          data-stage="foot"
          className="mt-6 flex items-center justify-between border-t border-line pt-4"
        >
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="GITHUB"
            aria-label={`${project.name} on GitHub`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-ink transition-colors duration-300 hover:text-blue"
          >
            <GithubIcon className="size-4.5" />
            <span className="font-mono text-[0.6rem] tracking-[0.14em]">SOURCE</span>
          </a>

          <button
            type="button"
            onClick={open}
            aria-label={`Open case study for ${project.name}`}
            className="flex size-8 items-center justify-center rounded-lg bg-soft text-blue transition-colors duration-300 hover:bg-blue hover:text-white"
          >
            <ArrowUpRight className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
