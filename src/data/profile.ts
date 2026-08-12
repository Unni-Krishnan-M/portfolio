/**
 * Single source of truth for everything factual about Unni Krishnan M.
 *
 * The values live in ./content.json so the admin studio can rewrite them; this
 * module owns the types and the export names every section imports. Editing the
 * JSON by hand is still perfectly fine — it is the same file the studio writes.
 */

import content from "./content.json";

export const profile = content.profile;
export const education = content.education;

/** Long-form "about" copy — read as consecutive masked lines. */
export const aboutParagraphs: string[] = content.aboutParagraphs;
export const aboutBullets: string[] = content.aboutBullets;

export type Stat = {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  /** Render the number literally instead of counting up to it (e.g. a year). */
  plain: boolean;
};

export const stats: Stat[] = content.stats;

/* ------------------------------------------------------------------ */
/* Toolkit — the constellation                                         */
/* ------------------------------------------------------------------ */

export type ToolCategory = {
  id: string;
  label: string;
  blurb: string;
  items: { name: string; note: string }[];
};

export const toolkit: ToolCategory[] = content.toolkit;

/** Orbit rings for the 3D/CSS constellation — flat list, ring-indexed. */
export const orbits: { ring: number; names: string[] }[] = content.orbits;

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export type ExperienceItem = {
  role: string;
  company: string;
  meta: string;
  start: string;
  end: string;
  points: string[];
  stack: string[];
};

export const experience: ExperienceItem[] = content.experience;

/* ------------------------------------------------------------------ */
/* Certifications                                                      */
/* ------------------------------------------------------------------ */

export type Certification = {
  title: string;
  issuer: string;
  grade: string;
  date: string;
};

export const certifications: Certification[] = content.certifications;

/* ------------------------------------------------------------------ */
/* Hackathons                                                          */
/* ------------------------------------------------------------------ */

export type Hackathon = {
  name: string;
  kind: string;
  host: string;
  date: string;
};

export const hackathons: Hackathon[] = content.hackathons;

/* ------------------------------------------------------------------ */
/* Beyond code                                                         */
/* ------------------------------------------------------------------ */

export const sportsAchievement = content.sportsAchievement;

/* ------------------------------------------------------------------ */
/* Navigation / scroll rail                                            */
/* ------------------------------------------------------------------ */

export type NavItem = { id: string; label: string; index: string };

export const navItems: NavItem[] = content.navItems;

/** Nav shown in the top bar (subset — SYSTEM folds into ABOUT visually). */
export const topNav: { id: string; label: string }[] = content.topNav;

/* ------------------------------------------------------------------ */
/* Ambient code fragments that drift through the environment           */
/* ------------------------------------------------------------------ */

export const codeFragments: string[] = content.codeFragments;

/* ------------------------------------------------------------------ */
/* Big statement — the word tunnel                                     */
/* ------------------------------------------------------------------ */

/** Each line rushes past the camera in turn. Keep them short and declarative. */
export const statement: {
  eyebrow: string;
  lines: string[];
  /** The word that gets the accent colour. */
  accent: string;
  footer: string;
} = content.statement;

/** Giant looping band. Reads as a machine ticking over. */
export const marqueeItems: string[] = content.marqueeItems;
