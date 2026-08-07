"use client";

import { useRef } from "react";
import { Zap } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { hackathons, type Hackathon } from "@/data/profile";
import { cn } from "@/lib/utils";

function EventNode() {
  return (
    <span aria-hidden data-hk-node className="relative block size-3.5">
      <span className="absolute inset-0 rounded-full border border-line bg-bg-2" />
      <span data-hk-dot className="absolute inset-[3px] rounded-full bg-blue shadow-glow" />
      <span data-hk-ring className="absolute inset-0 rounded-full border border-blue/70" />
    </span>
  );
}

function EventCard({ item, className }: { item: Hackathon; className?: string }) {
  return (
    <div
      data-hk-card
      data-cursor="EXPLORE"
      className={cn(
        "card-soft js-hidden group relative w-full overflow-hidden px-4 py-4 transition-shadow duration-300 hover:shadow-lift sm:px-5",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-blue to-electric/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <p className="text-[0.88rem] font-bold tracking-tight text-ink">{item.name}</p>
      <p className="mt-1.5 text-[0.78rem] leading-snug text-muted">{item.kind}</p>
      <p className="text-[0.78rem] leading-snug text-muted/80">{item.host}</p>
      <p className="mt-2.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-blue">
        {item.date}
      </p>
    </div>
  );
}

/** Horizontal (lg+) / vertical (mobile) event line whose nodes ignite in sequence. */
export default function HackathonTimeline() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tracks = gsap.utils.toArray<HTMLElement>("[data-hk-track]", el);
      const cards = gsap.utils.toArray<HTMLElement>("[data-hk-card]", el);
      const nodes = gsap.utils.toArray<HTMLElement>("[data-hk-node]", el);

      if (reduced) {
        gsap.set(tracks, { scaleX: 1, scaleY: 1 });
        gsap.set(cards, { opacity: 1, y: 0 });
        gsap.set(nodes.map((n) => n.querySelector("[data-hk-dot]")), { scale: 1 });
        gsap.set(nodes.map((n) => n.querySelector("[data-hk-ring]")), { opacity: 0 });
        return;
      }

      tracks.forEach((track) => {
        const vertical = track.dataset.hkTrack === "vertical";
        gsap.set(track, {
          scaleX: vertical ? 1 : 0,
          scaleY: vertical ? 0 : 1,
          transformOrigin: vertical ? "top center" : "left center",
        });
        gsap.to(track, {
          scaleX: 1,
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: track.parentElement ?? track,
            start: "top 80%",
            end: "bottom 62%",
            scrub: 0.6,
          },
        });
      });

      nodes.forEach((node) => {
        const dot = node.querySelector("[data-hk-dot]");
        const ring = node.querySelector("[data-hk-ring]");
        gsap.set(dot, { scale: 0 });
        gsap.set(ring, { opacity: 0 });

        const tl = gsap
          .timeline({ paused: true })
          .to(dot, { scale: 1, duration: 0.5, ease: "back.out(2.6)" })
          .fromTo(
            ring,
            { opacity: 0.75, scale: 0.75 },
            { opacity: 0, scale: 2.6, duration: 1.2, ease: "power2.out" },
            0,
          );

        ScrollTrigger.create({
          trigger: node,
          start: "top 76%",
          once: true,
          onEnter: () => tl.play(),
        });
      });

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: 0.18 + (i % 3) * 0.05,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="min-w-0">
      <h3 className="flex items-center gap-2.5 text-[1.05rem] font-bold tracking-tight text-ink">
        <Zap aria-hidden className="size-4 text-blue" strokeWidth={2.2} />
        Hackathons
      </h3>

      {/* horizontal — lg+ */}
      <div className="relative mt-8 hidden lg:block">
        <span
          aria-hidden
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-line"
        />
        <span
          aria-hidden
          data-hk-track="horizontal"
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-blue via-blue to-electric"
        />
        <ol className="relative grid grid-cols-3 gap-4">
          {hackathons.map((item, i) => (
            <li key={item.name} className="relative flex h-[300px] min-w-0 flex-col">
              <div className="flex flex-1 items-end justify-center pb-7">
                {i % 2 === 0 ? <EventCard item={item} /> : null}
              </div>
              <div className="flex flex-1 items-start justify-center pt-7">
                {i % 2 === 1 ? <EventCard item={item} /> : null}
              </div>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <EventNode />
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* vertical — mobile / tablet */}
      <div className="relative mt-7 pl-8 lg:hidden">
        <span aria-hidden className="absolute bottom-3 left-[7px] top-3 w-px bg-line" />
        <span
          aria-hidden
          data-hk-track="vertical"
          className="absolute bottom-3 left-[7px] top-3 w-px bg-gradient-to-b from-blue to-electric"
        />
        <ol className="flex flex-col gap-4">
          {hackathons.map((item) => (
            <li key={item.name} className="relative">
              <span className="absolute -left-8 top-5">
                <EventNode />
              </span>
              <EventCard item={item} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
