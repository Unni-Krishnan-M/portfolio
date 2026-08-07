"use client";

import { useRef } from "react";
import { Award, BadgeCheck } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { certifications } from "@/data/profile";
import { seeded } from "@/lib/utils";

/**
 * Credential wall: the cards arrive scattered in 3D and snap into an aligned
 * grid, then breathe on independent loops.
 */
export default function CertWall() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-cert]", el);
      const floats = gsap.utils.toArray<HTMLElement>("[data-cert-float]", el);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
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

      gsap.to(cards, {
        opacity: 1,
        x: 0,
        y: 0,
        z: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.085,
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
        onComplete: () => {
          floats.forEach((f, i) => {
            const a = seeded(i + 5);
            gsap.to(f, {
              y: -6 - a * 7,
              duration: 3.2 + a * 2.1,
              delay: a * 1.8,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          });
        },
      });
    },
    { scope: root },
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
      duration: 0.5,
      ease: "power3.out",
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
      duration: 0.7,
      ease: "power3.out",
    });
  };

  return (
    <div>
      <h3 className="flex items-center gap-2.5 text-[1.05rem] font-bold tracking-tight text-ink">
        <BadgeCheck aria-hidden className="size-4 text-blue" strokeWidth={2.2} />
        Certifications
      </h3>

      <div
        ref={root}
        className="mt-6 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-5"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      >
        {certifications.map((cert) => (
          <div key={cert.title} data-cert className="js-hidden h-full">
            <div data-cert-float className="h-full">
              <div
                data-cert-tilt
                data-cursor="OPEN"
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className="card-soft group relative flex h-full flex-col overflow-hidden px-4 py-5 transition-shadow duration-300 hover:shadow-glow sm:px-5"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue via-electric to-blue/0"
                />
                <Award
                  aria-hidden
                  className="pointer-events-none absolute -bottom-4 -right-4 size-20 text-blue/[0.06] transition-colors duration-300 group-hover:text-blue/[0.12]"
                  strokeWidth={1.4}
                />

                <p className="font-mono text-[0.62rem] font-medium uppercase leading-relaxed tracking-[0.1em] text-blue">
                  {cert.issuer}
                </p>
                <p className="mt-2.5 text-[0.9rem] font-bold leading-snug tracking-tight text-ink">
                  {cert.title}
                </p>
                <p className="mt-1.5 text-[0.78rem] leading-snug text-muted">{cert.grade}</p>

                <div aria-hidden className="h-5" />
                <p className="relative z-10 mt-auto border-t border-line pt-3.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted/80">
                  {cert.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
