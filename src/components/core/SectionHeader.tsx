"use client";

import type { ReactNode } from "react";
import SplitReveal from "./SplitReveal";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

type Props = {
  index: string;
  label: string;
  /** Plain part of the headline. */
  title: ReactNode;
  blurb?: ReactNode;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
};

/**
 * Consistent section masthead: numeric index, mono eyebrow, editorial headline.
 */
export default function SectionHeader({
  index,
  label,
  title,
  blurb,
  align = "left",
  className,
  action,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between",
        align === "center" && "items-center text-center lg:flex-col lg:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <Reveal
          from="left"
          className={cn(
            "mb-4 flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span className="font-mono text-[0.7rem] font-medium text-muted/70">{index}</span>
          <span className="h-px w-8 bg-gradient-to-r from-blue to-transparent" />
          <span className="label-tech">{label}</span>
        </Reveal>

        <SplitReveal as="h2" className="display-lg text-ink" type="lines">
          {title}
        </SplitReveal>

        {blurb ? (
          <Reveal delay={0.15} className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-muted">
            {blurb}
          </Reveal>
        ) : null}
      </div>

      {action ? <Reveal from="right">{action}</Reveal> : null}
    </div>
  );
}
