"use client";

import { useEffect, useRef } from "react";
import { X, Info, ExternalLink } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { NotebookCell, Readout } from "@/components/core/ai";
import { GithubIcon } from "@/components/icons/Brand";
import { techMark } from "@/components/icons/tech";
import MagneticButton from "@/components/core/MagneticButton";
import { DUR, EASE, STAGGER, reducedMotion } from "@/lib/motion";
import type { Project } from "@/data/projects";
import ProjectVisual from "./ProjectVisual";

type Props = {
  project: Project;
  /** Click point, so the warp opens from where the user actually clicked. */
  origin: { x: number; y: number };
  onClose: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ProjectOverlay({ project, origin, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  /* Lock the page and pause Lenis while the dialog owns the viewport. */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis;
    lenis?.stop?.();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const restoreFocus = document.activeElement as HTMLElement | null;

    return () => {
      document.documentElement.style.overflow = prev;
      lenis?.start?.();
      restoreFocus?.focus?.();
    };
  }, []);

  /* Escape to close + focus trap. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* The warp-in: blue rings rush out of the click point, a circular clip-path
     opens behind them, then the content rises. */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const x = origin.x;
      const y = origin.y;
      const far = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      closeBtn.current?.focus();

      if (reducedMotion()) {
        gsap.set(el, { clipPath: "none", opacity: 1 });
        gsap.set("[data-warp-ring]", { opacity: 0 });
        gsap.set("[data-ov]", { opacity: 1, y: 0 });
        gsap.set("[data-ro-item]", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline();

      tl.fromTo(
        el,
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${far}px at ${x}px ${y}px)`, duration: DUR.base, ease: EASE.inOut },
      )
        .fromTo(
          "[data-warp-ring]",
          { scale: 0, opacity: 0.65 },
          { scale: 3.4, opacity: 0, duration: DUR.slow, stagger: STAGGER.base, ease: EASE.expo },
          0,
        )
        .fromTo(
          "[data-ov]",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: DUR.base, stagger: STAGGER.base, ease: EASE.out },
          0.3,
        )
        // The Readout self-reveals on scroll; inside a fixed dialog there is no
        // scroll to wait for, so guarantee its end state.
        .set("[data-ro-item]", { opacity: 1, y: 0 }, 0.9);

      return () => tl.kill();
    },
    { scope: root, dependencies: [origin.x, origin.y] },
  );

  const close = () => {
    const el = root.current;
    if (!el || reducedMotion()) {
      onClose();
      return;
    }
    gsap.to(el, {
      clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`,
      duration: DUR.fast,
      ease: EASE.inOut,
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bm-case-title"
      className="fixed inset-0 z-[350] overflow-y-auto overscroll-contain bg-bg"
    >
      {/* warp rings, anchored at the click point */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            data-warp-ring
            className="absolute size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue/40"
            style={{ left: origin.x, top: origin.y }}
          />
        ))}
      </div>

      <div aria-hidden className="tech-grid pointer-events-none fixed inset-0 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 right-0 size-[42rem] rounded-full bg-[radial-gradient(circle,rgb(18_97_255/0.1),transparent_65%)]"
      />

      {/* backdrop click target */}
      <button
        type="button"
        aria-label="Close case study"
        tabIndex={-1}
        onClick={close}
        className="fixed inset-0 z-0 cursor-default"
      />

      <div ref={panel} className="relative z-20 mx-auto max-w-5xl px-6 py-14 sm:px-10 sm:py-20">
        <div data-ov className="mb-10 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="label-tech mb-3">{project.category}</p>
            <h2 id="bm-case-title" className="display-md max-w-2xl text-ink">
              {project.name}
            </h2>
            <p className="mt-3 text-[1.05rem] text-blue">{project.tagline}</p>
            <Readout
              items={[
                { k: "year", v: project.year },
                ...(project.live ? [{ k: "status", v: "live" }] : []),
              ]}
              className="mt-4"
            />
          </div>
          <button
            ref={closeBtn}
            type="button"
            onClick={close}
            aria-label="Close case study"
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-bg-2 text-ink transition-colors duration-300 hover:border-blue/40 hover:text-blue"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <div data-ov className="overflow-hidden rounded-2xl border border-line shadow-lift">
          <ProjectVisual variant={project.visual} active className="aspect-16/9 w-full" />
        </div>

        {project.metrics?.length ? (
          <div data-ov className="mt-8 grid gap-3 sm:grid-cols-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="card-soft p-5">
                <p className="text-[1.35rem] leading-none font-bold tracking-tight text-blue">
                  {m.value}
                </p>
                <p className="mt-2 font-mono text-[0.62rem] tracking-[0.14em] text-muted">
                  {m.label.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.55fr_1fr]">
          {/* The case study reads as a notebook: one cell per beat. */}
          <div data-ov className="space-y-7">
            {project.detail.map((para, i) => (
              <NotebookCell key={i} n={i + 1}>
                <p className="text-[1rem] leading-[1.75] text-muted">{para}</p>
              </NotebookCell>
            ))}
          </div>

          <div data-ov>
            <p className="label-tech mb-4">Built with</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => {
                const { node } = techMark(tech);
                return (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-2 rounded-lg border border-line bg-bg-2 px-2.5 py-1.5 text-[0.78rem] font-medium text-ink"
                  >
                    <span className="size-3.5">{node}</span>
                    {tech}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {project.status ? (
          <div
            data-ov
            className="mt-12 flex gap-4 rounded-2xl border border-blue/15 bg-soft p-6"
          >
            <Info className="mt-0.5 size-4.5 shrink-0 text-blue" />
            <div>
              <p className="label-tech mb-2">Scope note</p>
              <p className="text-[0.92rem] leading-relaxed text-deep/80">{project.status}</p>
            </div>
          </div>
        ) : null}

        <div data-ov className="mt-12 flex flex-wrap gap-3">
          <MagneticButton href={project.repo} external cursor="GITHUB">
            <GithubIcon className="size-4" />
            View Repository
          </MagneticButton>
          {project.live ? (
            <MagneticButton href={project.live} external variant="ghost" cursor="OPEN">
              <ExternalLink className="size-4" />
              Open Live Site
            </MagneticButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}
