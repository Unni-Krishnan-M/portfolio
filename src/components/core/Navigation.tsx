"use client";

import { useEffect, useState } from "react";
import { Send, Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/icons/Brand";
import { profile, topNav } from "@/data/profile";
import { scrollToId } from "./SmoothScroll";
import { useActiveSection } from "./useActiveSection";
import { cn } from "@/lib/utils";

/**
 * Minimal floating navigation. Condenses into a glass pill after the hero and
 * marks the active section with a travelling blue dot.
 */
export default function Navigation() {
  const active = useActiveSection();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // let the overlay close before scrolling
    window.setTimeout(() => scrollToId(id), open ? 220 : 0);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[200] transition-all duration-500",
          condensed ? "py-3" : "py-5",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[92rem] items-center justify-between rounded-full px-4 transition-all duration-500 sm:px-6",
            condensed
              ? "glass w-[calc(100%-1.5rem)] py-2.5 shadow-soft sm:w-[calc(100%-3rem)]"
              : "w-[calc(100%-1.5rem)] border border-transparent py-2.5 sm:w-[calc(100%-3rem)]",
          )}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => go("home")}
            className="group flex items-baseline gap-0.5"
            aria-label="Back to top"
          >
            <span className="text-[1.35rem] leading-none font-extrabold tracking-[-0.06em] text-blue">
              UK
            </span>
            <span className="size-1.5 rounded-full bg-electric transition-transform duration-300 group-hover:scale-150" />
          </button>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
            {topNav.map((item) => {
              const isActive =
                active === item.id || (item.id === "about" && active === "toolkit");
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={cn(
                    "relative px-3.5 py-2 font-mono text-[0.68rem] font-medium tracking-[0.14em] transition-colors duration-300",
                    isActive ? "text-blue" : "text-muted hover:text-ink",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-3.5 -bottom-0.5 flex justify-center transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <span className="h-px w-full bg-blue/30" />
                    <span className="absolute size-1 rounded-full bg-blue" />
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="GITHUB"
              aria-label="GitHub profile"
              className="hidden size-9 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-blue/40 hover:text-blue sm:flex"
            >
              <GithubIcon className="size-4" />
            </a>
            <button
              type="button"
              onClick={() => go("contact")}
              className="group hidden items-center gap-2 rounded-full border border-blue/30 bg-white/60 px-4 py-2 font-medium text-[0.8rem] text-blue transition-all duration-300 hover:border-blue hover:bg-blue hover:text-white sm:flex"
            >
              Let&apos;s Talk
              <Send className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex size-9 items-center justify-center rounded-full border border-line text-ink lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={cn(
          "fixed inset-0 z-[190] bg-bg/95 backdrop-blur-xl transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div aria-hidden className="tech-grid absolute inset-0 opacity-60" />
        <nav className="relative flex h-full flex-col justify-center gap-1 px-8">
          {topNav.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
              className={cn(
                "group flex items-baseline gap-4 border-b border-line/70 py-4 text-left transition-all duration-500",
                open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
              )}
            >
              <span className="font-mono text-[0.6rem] text-blue">
                0{i + 1}
              </span>
              <span className="text-3xl font-bold tracking-tight text-ink group-hover:text-blue">
                {item.label}
              </span>
            </button>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 font-mono text-[0.72rem] tracking-[0.12em] text-muted"
          >
            {profile.email}
          </a>
        </nav>
      </div>
    </>
  );
}
