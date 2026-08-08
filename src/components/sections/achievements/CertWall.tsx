"use client";

import { useRef } from "react";
import { BadgeCheck } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Brackets, Readout } from "@/components/core/ai";
import { DUR, EASE, STAGGER, reducedMotion } from "@/lib/motion";
import { certifications } from "@/data/profile";
import { seeded } from "@/lib/utils";
import CertGlyph from "./CertGlyph";

/** Everything here is counted from `certifications`, never asserted. */
const CERT_STATS = [
  { k: "certificates", v: String(certifications.length) },
  { k: "issuers", v: String(new Set(certifications.map((c) => c.issuer)).size) },
  { k: "elite", v: String(certifications.filter((c) => /elite/i.test(c.grade)).length) },
];

/**
 * Credential wall: the cards arrive scattered in 3D and snap into an aligned
 * grid, then breathe on independent loops. Each one is framed as a model card —
 * mono field labels, a corner metric glyph, brackets on hover.
 */
export default function CertWall() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-cert]", el);
      const floats = gsap.utils.toArray<HTMLElement>("[data-cert-float]", el);

      if (reducedMotion()) {
        gsap.set(cards, { opacity: 1, clearProps: "transform" });
        return;
      }

      cards.forEach((card, i) => {
        const a = seeded(i + 1);
        const b = seeded(i + 17);
        const c = seeded(i + 41);
        gsap.set(card, {
          opacity: 0,
          z: -260 - a * 320,
          x: (b - 0.5) * 180,
          y: (c - 0.5) * 150,
          rotateX: (c - 0.5) * 46,
          rotateY: (b - 0.5) * 58,
          transformPerspective: 1000,
        });
      });

      const loops: gsap.core.Tween[] = [];
      const assemble = gsap.to(cards, {
        opacity: 1,
        x: 0,
        y: 0,
        z: 0,
        rotateX: 0,
        rotateY: 0,
        duration: DUR.slow,
        ease: EASE.expo,
        stagger: STAGGER.base,
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
        onComplete: () => {
          floats.forEach((f, i) => {
            const a = seeded(i + 5);
            loops.push(
              gsap.to(f, {
                y: -6 - a * 7,
                duration: DUR.amble + a * 2.1,
                delay: a * 1.8,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              }),
            );
          });
        },
      });

      return () => {
        assemble.kill();
        loops.forEach((l) => l.kill());
      };
    },
    { scope: root },
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion()) return;
    const host = e.currentTarget;
    const tilt = host.querySelector<HTMLElement>("[data-cert-tilt]");
    if (!tilt) return;
    const r = host.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(tilt, {
      rotateY: px * 13,
      rotateX: -py * 13,
      y: -8,
      scale: 1.03,
      duration: DUR.fast,
      ease: EASE.out,
      transformPerspective: 800,
    });
  };

  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const tilt = e.currentTarget.querySelector<HTMLElement>("[data-cert-tilt]");
    if (!tilt) return;
    gsap.to(tilt, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      scale: 1,
      duration: DUR.base,
      ease: EASE.out,
    });
  };

  return (
    <div>
      <h3 className="flex items-center gap-2.5 text-[1.05rem] font-bold tracking-tight text-ink">
        <BadgeCheck aria-hidden className="size-4 text-blue" strokeWidth={2.2} />
        Certifications
      </h3>
      <Readout className="mt-3" items={CERT_STATS} />

      <div
        ref={root}
        className="mt-6 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-5"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      >
        {certifications.map((cert, i) => (
          <div key={cert.title} data-cert className="js-hidden h-full">
            <div data-cert-float className="h-full">
              <div
                data-cert-tilt
                data-cursor="OPEN"
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className="card-soft group relative flex h-full flex-col overflow-hidden px-4 py-5 transition-shadow duration-300 hover:shadow-glow sm:px-5"
              >
                {/* decorative layers — all beneath the content block below */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue via-electric to-blue/0"
                />
                <CertGlyph
                  grade={cert.grade}
                  index={i}
                  className="-bottom-5 -right-5 size-24 opacity-[0.13] transition-opacity duration-300 group-hover:opacity-[0.26]"
                />
                <Brackets className="inset-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono text-[0.62rem] font-medium uppercase leading-relaxed tracking-[0.1em] text-blue">
                      {cert.issuer}
                    </p>
                    <span
                      aria-hidden
                      className="mt-px font-mono text-[0.6rem] tracking-[0.1em] text-muted/45"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mt-2.5 text-[0.9rem] font-bold leading-snug tracking-tight text-ink">
                    {cert.title}
                  </p>

                  <p className="mt-2 font-mono text-[0.68rem] leading-snug">
                    <span className="text-muted/60">grade </span>
                    <span className="font-semibold text-ink/80">{cert.grade}</span>
                  </p>

                  <p className="mt-auto border-t border-line pt-3.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted/80">
                    {cert.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
