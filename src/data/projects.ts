/**
 * Real repositories from github.com/Unni-Krishnan-M.
 *
 * Every `stack` entry was verified against the repo's actual package.json /
 * pyproject.toml / pubspec.yaml — not from its README, because several READMEs
 * describe intended rather than shipped functionality. Descriptions deliberately
 * state what is built, so nothing here can be contradicted by someone opening
 * the repo in an interview. Keep that standard when editing.
 *
 * The values live in ../data/content.json so the admin studio can rewrite them.
 */

import content from "./content.json";

/** Which abstract interface the generated card visual draws. */
export const PROJECT_VISUALS = [
  "backend",
  "chat",
  "dashboard",
  "neural",
  "supplychain",
  "event",
  "mobile",
  "workspace",
  "grid",
] as const;

export type ProjectVisualKind = (typeof PROJECT_VISUALS)[number];

export type Project = {
  slug: string;
  name: string;
  category: string;
  /** One-line hook for the card. */
  tagline: string;
  /** Card body — 2 sentences max. */
  summary: string;
  /** Case-study overlay copy. */
  detail: string[];
  /** Honest note about scope/state. Shown in the overlay, not the card. Empty = hidden. */
  status: string;
  stack: string[];
  /** Drives the generated visual: which abstract interface to draw. */
  visual: ProjectVisualKind;
  repo: string;
  /** Empty = no live deployment. */
  live: string;
  year: string;
  /** Highlighted metrics for the overlay. Empty = hidden. */
  metrics: { label: string; value: string }[];
};

export const projects: Project[] = content.projects as Project[];

export const githubMeta = {
  repos: content.github.repos,
  /** Derived, not stored — it can never drift from the list above. */
  featured: projects.length,
  primaryLanguages: content.github.primaryLanguages,
};
