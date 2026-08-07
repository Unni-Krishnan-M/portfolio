"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Standard section shell — consistent id anchor, vertical rhythm and gutter.
 * The `xl:pl-*` gutter keeps content clear of the fixed scroll rail.
 */
export default function Section({
  id,
  children,
  className,
  full = false,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  /** Skip the max-width container (horizontal-scroll sections manage their own). */
  full?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24", !full && "py-24 sm:py-32 lg:py-40", className)}
    >
      {full ? children : <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-10 xl:pl-24">{children}</div>}
    </section>
  );
}
