"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useBootReady, useIsDesktop, useReducedMotion } from "@/lib/hooks";
import { profile } from "@/data/profile";
import MagneticButton from "@/components/core/MagneticButton";
import { scrollToId } from "@/components/core/SmoothScroll";
import { GithubIcon } from "@/components/icons/Brand";
import OrbitNodes from "./hero/OrbitNodes";

declare global {
  interface Window {
    /** Hero scroll progress (0→1), written by the hero ScrollTrigger, read by the WebGL stage. */
    __bmHero?: { p: number };
  }
}

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <StaticStage />,
});

/**
 * The no-WebGL centrepiece: layered translucent panes read as a glass cube on
 * its corner, with the wordmark, the plinth and a light pool. Mobile, tablet and
 * reduced-motion visitors get this — never an empty column.
 */
function StaticStage() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgb(18_97_255/0.13),transparent_66%)] blur-xl" />

      {/* plinth */}
      <svg
        className="absolute bottom-[8%] left-1/2 w-[64%] -translate-x-1/2"
        viewBox="0 0 300 96"
        fill="none"
      >
        <defs>
          <radialGradient id="bm-hero-plinth" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#dbe9ff" />
            <stop offset="100%" stopColor="#f7faff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="150" cy="64" rx="142" ry="30" fill="url(#bm-hero-plinth)" />
        <ellipse cx="150" cy="58" rx="120" ry="25" stroke="#1261ff" strokeOpacity="0.26" />
        <ellipse cx="150" cy="50" rx="96" ry="20" stroke="#00c2ff" strokeOpacity="0.3" />
        <ellipse cx="150" cy="42" rx="72" ry="15" stroke="#1261ff" strokeOpacity="0.18" />
      </svg>

      {/* cube */}
      <div className="absolute top-1/2 left-1/2 size-[44%] -translate-x-1/2 -translate-y-[56%]">
        <div className="absolute inset-0 rotate-45 rounded-[16%] border border-white bg-[linear-gradient(150deg,rgb(255_255_255/0.95),rgb(206_228_255/0.62)_48%,rgb(255_255_255/0.9))] shadow-[0_34px_90px_-26px_rgb(18_97_255/0.5)] backdrop-blur-md" />
        <div className="absolute inset-[13%] rotate-45 rounded-[15%] border border-blue/15 bg-[linear-gradient(320deg,rgb(18_97_255/0.12),transparent_58%)]" />
        <div className="absolute inset-[30%] rotate-45 rounded-[18%] border border-electric/25" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-[clamp(1.9rem,5.4vw,4.25rem)] leading-none font-extrabold tracking-tighter text-blue">
            UK
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const scrollDot = useRef<HTMLSpanElement>(null);
  // The preloader owns the moment the hero becomes visible.
  const ready = useBootReady();
  const [sceneAlive, setSceneAlive] = useState(false);

  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const use3D = isDesktop && !reduced;

  /* Choreographed entrance, ~1.8s, gated on the preloader. */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const fades = gsap.utils.toArray<HTMLElement>("[data-hero-fade]", el);
      const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]", el);
      const buttons = gsap.utils.toArray<HTMLElement>("[data-hero-btn]", el);

      // Hold everything off-stage until the preloader hands over.
      if (!ready) {
        gsap.set(fades, { autoAlpha: 0, y: 20 });
        gsap.set(buttons, { autoAlpha: 0, y: 20 });
        gsap.set(lines, { yPercent: 112 });
        gsap.set(stage.current, { autoAlpha: 0, scale: 0.9 });
        return;
      }

      // `fromTo` throughout, deliberately: the block above has already written
      // the hidden values inline, so a plain `.from()` would tween 112 → 112.
      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.85 } });

      tl.fromTo(
        "[data-hero-badge]",
        { autoAlpha: 0, y: 16, scale: 0.94 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 },
        0,
      )
        .fromTo("[data-hero-kicker]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.1)
        .fromTo(lines[0], { yPercent: 112 }, { yPercent: 0, duration: 1.05 }, 0.2)
        .fromTo(lines.slice(1), { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.09 }, 0.44)
        .fromTo("[data-hero-desc]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0 }, 0.74)
        .fromTo(buttons, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.75 }, 0.88)
        .fromTo(
          stage.current,
          { autoAlpha: 0, scale: 0.9 },
          { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power3.out" },
          0.34,
        )
        .fromTo("[data-hero-scroll]", { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.2);

      if (scrollDot.current) {
        gsap.fromTo(
          scrollDot.current,
          { yPercent: -120 },
          { yPercent: 320, duration: 1.8, ease: "power1.inOut", repeat: -1, delay: 1.6 },
        );
      }
    },
    { scope: root, dependencies: [ready] },
  );

  /* Scroll-out: the stage dollies toward the viewer while the copy drifts back. */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      window.__bmHero = window.__bmHero ?? { p: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          onUpdate: (self) => {
            if (window.__bmHero) window.__bmHero.p = self.progress;
          },
        },
      });

      // Leaving the hero reads as flying into the cube: the copy falls back and
      // dims while the stage rushes toward the camera and past the frame.
      tl.to(copy.current, { y: -110, scale: 0.94, opacity: 0.05, ease: "none" }, 0)
        .to(
          stage.current,
          { scale: 1.85, y: "-5%", opacity: 0.18, ease: "power1.in" },
          0,
        );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root },
  );

  return (
    <section
      id="home"
      ref={root}
      className="relative isolate min-h-[100svh] w-full overflow-x-clip scroll-mt-24"
    >
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[84rem] flex-col justify-center px-6 pt-28 pb-16 sm:px-10 lg:pt-24 lg:pb-20 xl:pl-24">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
          {/* ---------------------------------------------------------- copy */}
          <div ref={copy} className="relative order-2 lg:order-1">
            <span
              data-hero-badge
              className="inline-flex items-center gap-2 rounded-full border border-blue/25 bg-soft px-4 py-1.5 font-mono text-[0.63rem] font-medium tracking-[0.2em] whitespace-nowrap text-blue uppercase"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-blue" />
              {profile.eyebrow}
            </span>

            <p data-hero-kicker className="mt-7 text-lg font-medium text-muted sm:text-xl">
              Hi, I&rsquo;m
            </p>

            <h1 className="mt-1.5 display-xl text-ink">
              <span className="line-mask">
                <span data-hero-line className="inline-block will-change-transform">
                  Unni <span className="text-blue">Krishnan M</span>
                </span>
              </span>
            </h1>

            <p className="mt-6 text-[clamp(1.15rem,2.5vw,2rem)] leading-[1.15] font-semibold tracking-tight text-ink uppercase">
              <span className="line-mask">
                <span data-hero-line className="inline-block will-change-transform">
                  I build intelligent systems
                </span>
              </span>
              <span className="line-mask">
                <span data-hero-line className="inline-block will-change-transform">
                  with <span className="text-blue">code &amp; AI</span>
                </span>
              </span>
            </p>

            <p
              data-hero-desc
              className="mt-7 max-w-[38ch] text-[0.98rem] leading-relaxed text-muted sm:text-base"
            >
              AI &amp; Data Science student passionate about building full-stack applications and
              AI systems that solve real-world problems.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <span data-hero-btn className="inline-block">
                <MagneticButton
                  onClick={() => scrollToId("projects")}
                  cursor="EXPLORE"
                  ariaLabel="Explore my work"
                >
                  Explore My Work
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.4}
                  />
                </MagneticButton>
              </span>

              <span data-hero-btn className="inline-block">
                <MagneticButton
                  href={profile.github}
                  external
                  variant="ghost"
                  cursor="GITHUB"
                  ariaLabel="View GitHub profile"
                >
                  View GitHub
                  <GithubIcon aria-hidden className="size-4" />
                </MagneticButton>
              </span>
            </div>

            {/* scroll cue */}
            <div data-hero-scroll className="mt-14 flex items-center gap-4">
              <span className="font-mono text-[0.62rem] tracking-[0.28em] text-muted uppercase">
                Scroll
              </span>
              <span aria-hidden className="relative h-12 w-px overflow-hidden bg-line">
                <span
                  ref={scrollDot}
                  className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-blue to-transparent"
                />
              </span>
              <ArrowDown aria-hidden className="size-4 text-blue/70" strokeWidth={2.2} />
            </div>
          </div>

          {/* --------------------------------------------------------- stage */}
          <div
            ref={stage}
            className="relative order-1 mx-auto aspect-square w-full max-w-[30rem] lg:order-2 lg:max-w-[38rem]"
          >
            {/* The CSS stage is the baseline, always painted. When WebGL proves
                it has produced a frame it fades in over the top and the static
                layer retires — so a failed or blocked GL context degrades to a
                deliberate composition instead of an empty column. */}
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: sceneAlive ? 0 : 1 }}
            >
              <StaticStage />
            </div>

            {use3D ? (
              <div
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: sceneAlive ? 1 : 0 }}
              >
                <HeroScene onFirstFrame={() => setSceneAlive(true)} />
              </div>
            ) : null}

            <OrbitNodes />
          </div>
        </div>
      </div>
    </section>
  );
}
