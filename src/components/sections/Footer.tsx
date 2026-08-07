"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import { scrollToId } from "@/components/core/SmoothScroll";
import { profile } from "@/data/profile";

const links = [
  { label: "GITHUB", href: profile.github, external: true },
  { label: "LINKEDIN", href: profile.linkedin, external: true },
  { label: "EMAIL", href: `mailto:${profile.email}`, external: false },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex w-full max-w-[84rem] flex-col gap-6 px-6 py-9 sm:px-10 md:flex-row md:items-center md:justify-between xl:pl-24">
        <p className="font-mono text-[0.68rem] tracking-[0.1em] text-muted">
          © 2026 {profile.name}. All rights reserved.
        </p>

        <nav className="flex items-center gap-5" aria-label="Elsewhere">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="font-mono text-[0.62rem] tracking-[0.18em] text-muted transition-colors duration-300 hover:text-blue"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 font-mono text-[0.62rem] tracking-[0.14em] text-muted">
            <Sparkles className="size-3 text-blue" />
            BUILT WITH PASSION
          </span>
          <button
            type="button"
            onClick={() => scrollToId("home")}
            className="group flex items-center gap-2 rounded-full border border-line px-3.5 py-2 font-mono text-[0.6rem] tracking-[0.16em] text-muted transition-colors duration-300 hover:border-blue/40 hover:text-blue"
          >
            BACK TO TOP
            <ArrowUp className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
