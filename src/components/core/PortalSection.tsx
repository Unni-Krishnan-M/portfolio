"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** How far in the portal starts, as a percentage inset. */
  inset?: number;
  /** Corner radius of the portal window, in rem. */
  radius?: number;
  /** Starting scale of the incoming scene. */
  scale?: number;
};

/**
 * The "going inside" transition.
 *
 * A section arrives as a small rounded window floating in the middle of the
 * viewport and opens outward past the frame edges as you scroll toward it, while
 * its contents scale up from behind. The effect is that the camera flies *into*
 * the next scene rather than the page sliding to it.
 *
 * Only `clip-path` and `transform` are animated — no blur, no box-shadow — so it
 * stays on the compositor. Never wrap a section that pins internally (the
 * projects gallery): `clip-path` creates a containing block and would break
 * ScrollTrigger's fixed-position pin.
 */
export default function PortalSection({
  children,
  className,
  inset = 9,
  radius = 3.5,
  scale = 0.9,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = wrap.current;
      const content = inner.current;
      if (!el || !content) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { clipPath: "none" });
        gsap.set(content, { scale: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          // Fully open by the time the section's top reaches a third up the
          // viewport, so the content is settled before it's being read.
          end: "top 28%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // Horizontal inset only. These sections are far taller than the viewport,
      // so a vertical inset would clip hundreds of pixels off edges that are
      // already off-screen — invisible, and it breaks the read. The sense of
      // depth comes from `scale`; the side inset plus corner radius is what
      // makes it a window you pass through.
      tl.fromTo(
        el,
        { clipPath: `inset(0% ${inset}% 0% ${inset}% round ${radius}rem)` },
        { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none" },
        0,
      ).fromTo(
        content,
        { scale, y: "2%" },
        { scale: 1, y: "0%", ease: "none" },
        0,
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: wrap, dependencies: [inset, radius, scale] },
  );

  return (
    <div ref={wrap} className={cn("relative will-change-[clip-path]", className)}>
      <div ref={inner} className="origin-top will-change-transform">
        {children}
      </div>
    </div>
  );
}

/**
 * The counterpart: the section you are leaving recedes past the camera instead
 * of simply scrolling away. Pair it with a `PortalSection` immediately after.
 */
export function RecedeSection({
  children,
  className,
  to = 1.14,
}: {
  children: ReactNode;
  className?: string;
  /** Scale reached by the time the section has fully left. */
  to?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = wrap.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "bottom bottom",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      tl.to(el, { scale: to, opacity: 0.25, ease: "none" });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className={cn("origin-center will-change-transform", className)}>
      {children}
    </div>
  );
}
