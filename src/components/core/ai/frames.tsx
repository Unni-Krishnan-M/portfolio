"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER, reducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A Jupyter-style cell frame around real content. This is the one motif that
 * wraps meaning rather than decorating around it, so it is not `aria-hidden` —
 * only the `In [n]:` gutter is.
 */
export function NotebookCell({
  n,
  label,
  children,
  className,
}: {
  n: number;
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex gap-3 sm:gap-4", className)}>
      <div aria-hidden className="flex shrink-0 flex-col items-end pt-1">
        <span className="font-mono text-[0.62rem] whitespace-nowrap text-blue/70">
          In [{n}]:
        </span>
        <span className="mt-2 w-px flex-1 bg-gradient-to-b from-blue/30 to-transparent" />
      </div>

      <div className="min-w-0 flex-1">
        {label ? (
          <p aria-hidden className="label-tech mb-2 text-[0.58rem] text-muted/70">
            {label}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}

/**
 * Mono telemetry strip — `epoch 12 · loss 0.0412 · acc 94.1%`. Real text, so it
 * stays readable; values count up on entrance when they're numeric.
 */
export function Readout({
  items,
  className,
}: {
  items: { k: string; v: string }[];
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const parts = el.querySelectorAll("[data-ro-item]");
      if (reducedMotion()) {
        gsap.set(parts, { opacity: 1, y: 0 });
        return;
      }
      const tw = gsap.from(parts, {
        opacity: 0,
        y: 8,
        duration: DUR.fast,
        stagger: STAGGER.tight,
        ease: EASE.out,
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
      return () => tw.kill();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[0.62rem] tracking-[0.08em] text-muted",
        className,
      )}
    >
      {items.map((it, i) => (
        <span key={it.k} data-ro-item className="flex items-center gap-1.5">
          {i > 0 ? (
            <span aria-hidden className="mr-2 text-line">
              ·
            </span>
          ) : null}
          <span className="text-muted/70">{it.k}</span>
          <span className="font-semibold text-blue">{it.v}</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Thin corner brackets — a technical framing device for figures and panels.
 * Cheap, and it makes an ordinary box read as instrumented.
 */
export function Brackets({ className }: { className?: string }) {
  const corners = [
    "top-0 left-0 border-t border-l",
    "top-0 right-0 border-t border-r",
    "bottom-0 left-0 border-b border-l",
    "bottom-0 right-0 border-b border-r",
  ];
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {corners.map((c) => (
        <span key={c} className={cn("absolute size-3.5 border-blue/40", c)} />
      ))}
    </span>
  );
}
