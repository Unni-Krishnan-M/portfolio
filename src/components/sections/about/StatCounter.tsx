"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  suffix?: string;
  label: string;
  sub?: string;
  /** Years must read as bare integers — no decimals, no thousands separator. */
  plain?: boolean;
  delay?: number;
  className?: string;
};

function format(v: number, plain: boolean, decimals: number) {
  if (plain) return String(Math.round(v));
  return v.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Counts up on scroll-into-view. The tween runs on a proxy object and writes
 * straight to the text node, so there is no React render per frame.
 */
export default function StatCounter({
  value,
  suffix = "",
  label,
  sub,
  plain = false,
  delay = 0,
  className,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  const decimals = plain || Number.isInteger(value) ? 0 : 2;
  const final = format(value, plain, decimals);

  useGSAP(
    () => {
      const el = num.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = final;
        return;
      }

      const proxy = { v: 0 };
      el.textContent = format(0, plain, decimals);

      gsap.to(proxy, {
        v: value,
        duration: 1.7,
        delay,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = format(proxy.v, plain, decimals);
        },
        onComplete: () => {
          el.textContent = final;
        },
        scrollTrigger: { trigger: root.current, start: "top 90%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={cn(
        "card-soft group relative overflow-hidden px-4 py-5 sm:px-5 sm:py-6",
        "transition-shadow duration-500 hover:shadow-lift",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <p className="text-[1.75rem] leading-none font-extrabold tracking-[-0.04em] text-blue tabular-nums sm:text-[2.1rem]">
        <span ref={num}>{final}</span>
        {suffix}
      </p>
      <p className="mt-2.5 text-[0.82rem] font-semibold text-ink">{label}</p>
      {sub ? (
        <p className="mt-0.5 font-mono text-[0.62rem] tracking-[0.12em] text-muted/80 uppercase">
          {sub}
        </p>
      ) : null}
    </div>
  );
}
