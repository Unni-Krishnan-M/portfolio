"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  /** Custom-cursor label while hovered. */
  cursor?: string;
  external?: boolean;
  strength?: number;
  ariaLabel?: string;
};

/**
 * Button that leans toward the cursor and lifts a blue glow. The transform is
 * applied to an inner span so the hit area never moves — no hover flicker.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  cursor,
  external,
  strength = 0.28,
  ariaLabel,
}: Props) {
  const wrap = useRef<HTMLElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = wrap.current;
    const move = inner.current;
    if (!el || !move) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    gsap.to(move, { x, y, duration: 0.5, ease: "power3.out" });
  };

  const onLeave = () => {
    if (!inner.current) return;
    gsap.to(inner.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
  };

  const base =
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold tracking-tight transition-[box-shadow,background-color,color] duration-300 will-change-transform";

  const variants = {
    primary:
      "bg-blue text-white px-7 py-3.5 text-[0.9rem] shadow-[0_10px_30px_-8px_rgb(18_97_255/0.55)] hover:shadow-[0_18px_44px_-10px_rgb(18_97_255/0.7)]",
    ghost:
      "bg-white text-ink px-7 py-3.5 text-[0.9rem] border border-line hover:border-blue/40 shadow-soft hover:shadow-lift",
    outline:
      "bg-transparent text-blue px-5 py-2.5 text-[0.8rem] border border-blue/30 hover:border-blue hover:bg-soft",
  } as const;

  const content = (
    <>
      {/* sheen sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:[animation:bm-sheen_0.9s_var(--ease-out-expo)_forwards]" />
      </span>
      <span ref={inner} className="relative z-10 inline-flex items-center gap-2.5">
        {children}
      </span>
    </>
  );

  const shared = {
    ref: wrap as React.Ref<never>,
    className: cn(base, variants[variant], className),
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    "data-cursor": cursor,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <a
        {...shared}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button {...shared} type="button" onClick={onClick}>
      {content}
    </button>
  );
}
