"use client";

import { Mail, Phone, Send, ArrowUpRight, MapPin } from "lucide-react";
import Section from "@/components/core/Section";
import Reveal from "@/components/core/Reveal";
import SplitReveal from "@/components/core/SplitReveal";
import MagneticButton from "@/components/core/MagneticButton";
import { GithubIcon, LinkedinIcon } from "@/components/icons/Brand";
import { profile } from "@/data/profile";
import PaperPlane from "./contact/PaperPlane";

const channels = [
  {
    label: "EMAIL",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: <Mail className="size-4.5" />,
    cursor: "OPEN",
    external: false,
  },
  {
    label: "PHONE",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
    icon: <Phone className="size-4.5" />,
    cursor: "OPEN",
    external: false,
  },
  {
    label: "GITHUB",
    value: "Unni-Krishnan-M",
    href: profile.github,
    icon: <GithubIcon className="size-4.5" />,
    cursor: "GITHUB",
    external: true,
  },
  {
    label: "LINKEDIN",
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

          <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-3">
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
          </Reveal>

          <Reveal delay={0.28} className="mt-7 flex items-center gap-2 text-[0.82rem] text-muted">
            <MapPin className="size-3.5 text-blue" />
            {profile.location}
          </Reveal>
        </div>

        {/* the plane's flight */}
        <div className="relative -mx-2 lg:mx-0">
          <PaperPlane />
        </div>
      </div>

      {/* channels */}
      <div className="mt-16 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {channels.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.07} from="scale">
            <a
              href={c.href}
              data-cursor={c.cursor}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group card-soft relative flex items-center gap-4 overflow-hidden p-5 transition-[box-shadow,transform,border-color] duration-400 hover:-translate-y-1 hover:border-blue/30 hover:shadow-lift"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-soft text-blue transition-colors duration-400 group-hover:bg-blue group-hover:text-white">
                {c.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="label-tech block text-[0.6rem] text-muted/80">{c.label}</span>
                <span className="mt-1 block text-[0.84rem] leading-snug font-semibold break-words text-ink">
                  {c.value}
                </span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted/50 transition-all duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue" />
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
