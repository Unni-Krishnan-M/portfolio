"use client";

import { ChevronRight, GraduationCap, MapPin } from "lucide-react";
import Section from "@/components/core/Section";
import Reveal from "@/components/core/Reveal";
import SplitReveal from "@/components/core/SplitReveal";
import NeuralPortrait from "./about/NeuralPortrait";
import StatCounter from "./about/StatCounter";
import { aboutBullets, aboutParagraphs, education, profile, stats } from "@/data/profile";

export default function About() {
  return (
    <Section id="about">
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] lg:gap-12 xl:gap-16">
        {/* portrait first in the DOM so it stacks above the copy on mobile */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-28">
          <NeuralPortrait />
        </div>

        <div className="order-2 lg:order-1">
          <Reveal from="left" className="mb-5 flex items-center gap-3">
            <span className="font-mono text-[0.7rem] font-medium text-muted/70">02</span>
            <span className="h-px w-8 bg-gradient-to-r from-blue to-transparent" />
            <span className="label-tech">About Me</span>
          </Reveal>

          <SplitReveal as="h2" type="lines" className="display-lg text-ink">
            Turning Ideas
            <br />
            Into <span className="text-blue">Impact.</span>
          </SplitReveal>

          <div className="mt-8 max-w-[62ch] space-y-5">
            {aboutParagraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08} distance={22}>
                <p className="text-[1rem] leading-[1.85] text-muted">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal stagger={0.07} className="mt-10 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {aboutBullets.map((b) => (
              <div key={b} className="flex items-start gap-2.5">
                <ChevronRight
                  aria-hidden
                  className="mt-[0.28rem] size-3.5 shrink-0 text-blue"
                  strokeWidth={3}
                />
                <span className="text-[0.9rem] leading-snug text-ink/85">{b}</span>
              </div>
            ))}
          </Reveal>

          <Reveal from="scale" delay={0.05} className="mt-10">
            <div className="card-soft relative overflow-hidden p-6 sm:p-7">
              <div
                aria-hidden
                className="tech-grid-sm pointer-events-none absolute inset-0 opacity-40"
                style={{
                  maskImage: "linear-gradient(115deg,black,transparent 60%)",
                  WebkitMaskImage: "linear-gradient(115deg,black,transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-soft text-blue">
                    <GraduationCap aria-hidden className="size-4.5" strokeWidth={2.1} />
                  </span>
                  <span className="label-tech">Education</span>
                </div>

                <h3 className="mt-4 text-[1.05rem] leading-snug font-bold tracking-[-0.02em] text-ink">
                  {education.degree}
                </h3>
                <p className="mt-1.5 text-[0.9rem] text-muted">{education.college}</p>
                <p className="text-[0.85rem] text-muted/80">{education.university}</p>

                <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4 font-mono text-[0.68rem] tracking-[0.1em] uppercase">
                  <div className="flex items-center gap-1.5">
                    <dt className="text-muted/70">Graduating</dt>
                    <dd className="font-semibold text-blue">{education.graduation}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <dt className="text-muted/70">GPA</dt>
                    <dd className="font-semibold text-blue">
                      {education.gpa}
                      <span className="text-muted/60"> / {education.gpaScale}</span>
                    </dd>
                  </div>
                  <div className="flex items-center gap-1.5 normal-case">
                    <MapPin aria-hidden className="size-3.5 shrink-0 text-blue" strokeWidth={2.2} />
                    <dt className="sr-only">Location</dt>
                    <dd className="tracking-normal text-muted">{profile.location}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
              <StatCounter
                key={s.label}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                sub={s.sub}
                plain={"plain" in s ? s.plain : false}
                delay={i * 0.09}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
