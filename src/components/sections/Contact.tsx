"use client";

import { Mail, Phone, Send, ArrowUpRight, MapPin } from "lucide-react";
import Section from "@/components/core/Section";
import Reveal from "@/components/core/Reveal";
import SplitReveal from "@/components/core/SplitReveal";
import MagneticButton from "@/components/core/MagneticButton";
import { NeuralField } from "@/components/core/ai";
import { GithubIcon, LinkedinIcon } from "@/components/icons/Brand";
import { profile } from "@/data/profile";
import PaperPlane from "./contact/PaperPlane";

/**
 * Contact reads as a request/response exchange: the left column is the request
 * being composed, these are the endpoints it can be sent to. Every value and
 * href below is the real one, written out in full.
 */
const channels = [
  {
    label: "EMAIL",
    method: "mailto",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: <Mail className="size-4.5" />,
    cursor: "OPEN",
    external: false,
  },
  {
    label: "PHONE",
    method: "tel",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
    icon: <Phone className="size-4.5" />,
    cursor: "OPEN",
    external: false,
  },
  {
    label: "GITHUB",
    method: "GET",
    value: "Unni-Krishnan-M",
    href: profile.github,
    icon: <GithubIcon className="size-4.5" />,
    cursor: "GITHUB",
    external: true,
  },
  {
    label: "LINKEDIN",
    method: "GET",
    value: "unni-krishnan-m05",
    href: profile.linkedin,
    icon: <LinkedinIcon className="size-4.5" />,
    cursor: "OPEN",
    external: true,
  },
];

export default function Contact() {
  return (
    <Section id="contact" className="pb-16 sm:pb-20 lg:pb-24">
      <div className="relative">
        {/* decorative mesh, behind everything */}
        <NeuralField
          density="sparse"
          seed={7}
          className="opacity-[0.55] [mask-image:radial-gradient(70%_60%_at_50%_45%,black,transparent)]"
        />

        <div className="relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
            <div>
              <Reveal from="left" className="mb-4 flex items-center gap-3">
                <span className="font-mono text-[0.7rem] font-medium text-muted/70">07</span>
                <span className="h-px w-8 bg-gradient-to-r from-blue to-transparent" />
                <span className="label-tech">CONTACT</span>
              </Reveal>

              <SplitReveal as="h2" className="display-lg text-ink" type="lines">
                <>
                  Let&apos;s <span className="text-blue">Build</span>
                  <br />
                  Something Great!
                </>
              </SplitReveal>

              <Reveal delay={0.12} className="mt-6 max-w-md text-[1rem] leading-relaxed text-muted">
                Have an idea, a project, an opportunity or a hackathon team that needs one more
                pair of hands? I read everything, and I reply.
              </Reveal>

              {/* the request being composed */}
              <Reveal delay={0.2} className="mt-8 max-w-md">
                <div className="rounded-2xl border border-line bg-bg-2/80 p-5 shadow-soft backdrop-blur-sm">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 border-b border-line/70 pb-3 font-mono text-[0.64rem] tracking-[0.1em]">
                    <span className="rounded bg-blue px-1.5 py-[0.15rem] text-[0.56rem] font-semibold tracking-[0.16em] text-white">
                      POST
                    </span>
                    <span className="font-semibold text-ink">/contact</span>
                    <span className="text-muted/70">to: {profile.email}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <MagneticButton
                      href={`mailto:${profile.email}`}
                      cursor="OPEN"
                      className="px-8 py-4 text-[0.95rem] tracking-[0.02em]"
                    >
                      LET&apos;S TALK
                      <Send className="size-4" />
                    </MagneticButton>
                    <MagneticButton href={profile.github} external variant="ghost" cursor="GITHUB">
                      <GithubIcon className="size-4" />
                      View GitHub
                    </MagneticButton>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.28} className="mt-7 flex items-center gap-2 text-[0.82rem] text-muted">
                <MapPin className="size-3.5 text-blue" />
                {profile.location}
              </Reveal>
            </div>

            {/* the request in flight */}
            <div className="relative -mx-2 lg:mx-0">
              <PaperPlane />
            </div>
          </div>

          {/* endpoints */}
          <Reveal className="mt-16 mb-5 flex items-center gap-3">
            <span className="label-tech shrink-0">AVAILABLE ENDPOINTS</span>
            <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-line to-transparent" />
            <span className="shrink-0 font-mono text-[0.6rem] tracking-[0.12em] text-muted/70">
              {channels.length} open
            </span>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.07} from="scale">
                <a
                  href={c.href}
                  data-cursor={c.cursor}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group card-soft relative flex h-full items-start gap-4 overflow-hidden p-5 transition-[box-shadow,transform,border-color] duration-400 hover:-translate-y-1 hover:border-blue/30 hover:shadow-lift"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-soft text-blue transition-colors duration-400 group-hover:bg-blue group-hover:text-white">
                    {c.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="rounded border border-blue/25 bg-soft px-1.5 py-[0.1rem] font-mono text-[0.52rem] tracking-[0.14em] text-blue">
                        {c.method}
                      </span>
                      <span className="label-tech text-[0.58rem] text-muted/80">{c.label}</span>
                    </span>
                    <span className="mt-1.5 block text-[0.84rem] leading-snug font-semibold break-words text-ink">
                      {c.value}
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted/50 transition-all duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
