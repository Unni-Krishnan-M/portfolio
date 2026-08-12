/**
 * One description of the content shape, used for three things:
 *   - rendering the studio's form controls
 *   - creating blank items when you press "Add"
 *   - validating a submitted document before it is committed
 *
 * That last one matters: a Server Action is a public POST endpoint, so the
 * document arriving at `save` is untrusted even though the UI that normally
 * produces it sits behind a password. Anything not described here is rejected.
 */

import { PROJECT_VISUALS } from "@/data/projects";

export type FieldSpec =
  | { kind: "text"; long?: boolean; hint?: string }
  | { kind: "number"; int?: boolean }
  | { kind: "bool" }
  | { kind: "enum"; values: readonly string[] }
  | { kind: "list"; of: FieldSpec; titleKey?: string }
  | { kind: "group"; fields: Record<string, FieldSpec> };

const text = (long = false, hint?: string): FieldSpec => ({ kind: "text", long, hint });
const num = (int = false): FieldSpec => ({ kind: "number", int });
const bool = (): FieldSpec => ({ kind: "bool" });
const list = (of: FieldSpec, titleKey?: string): FieldSpec => ({ kind: "list", of, titleKey });
const group = (fields: Record<string, FieldSpec>): FieldSpec => ({ kind: "group", fields });

export const CONTENT_SPEC: Record<string, FieldSpec> = {
  profile: group({
    name: text(),
    initials: text(false, "Two letters — the header mark."),
    logo: text(),
    brand: text(),
    headline: text(true),
    secondaryHeadline: text(true),
    eyebrow: text(),
    location: text(),
    email: text(),
    phone: text(),
    github: text(),
    githubHandle: text(false, "Shown as text; no https://"),
    linkedin: text(),
    linkedinHandle: text(),
  }),

  education: group({
    degree: text(),
    college: text(),
    university: text(),
    graduation: text(),
    gpa: text(),
    gpaScale: text(),
  }),

  aboutParagraphs: list(text(true)),
  aboutBullets: list(text()),

  stats: list(
    group({
      value: num(),
      suffix: text(false, "e.g. + or %"),
      label: text(),
      sub: text(),
      plain: bool(),
    }),
    "label",
  ),

  toolkit: list(
    group({
      id: text(false, "Used as a key — lowercase, no spaces."),
      label: text(),
      blurb: text(true),
      items: list(group({ name: text(), note: text(true) }), "name"),
    }),
    "label",
  ),

  orbits: list(group({ ring: num(true), names: list(text()) }), "ring"),

  experience: list(
    group({
      role: text(),
      company: text(),
      meta: text(),
      start: text(false, "e.g. JUN 2026"),
      end: text(false, "e.g. JUL 2026"),
      points: list(text(true)),
      stack: list(text()),
    }),
    "role",
  ),

  certifications: list(
    group({ title: text(), issuer: text(), grade: text(), date: text() }),
    "title",
  ),

  hackathons: list(group({ name: text(), kind: text(), host: text(), date: text() }), "name"),

  sportsAchievement: group({
    place: text(),
    events: text(),
    event: text(),
    date: text(),
    note: text(true),
  }),

  navItems: list(
    group({
      id: text(false, "Must match the section's DOM id."),
      label: text(),
      index: text(false, "e.g. 01"),
    }),
    "label",
  ),
  topNav: list(group({ id: text(), label: text() }), "label"),

  codeFragments: list(text()),

  statement: group({
    eyebrow: text(),
    lines: list(text()),
    accent: text(false, "Must exactly match one of the lines above to be highlighted."),
    footer: text(true),
  }),

  marqueeItems: list(text()),

  projects: list(
    group({
      slug: text(false, "URL-safe id. Changing it changes nothing externally."),
      name: text(),
      category: text(),
      tagline: text(true),
      summary: text(true),
      detail: list(text(true)),
      status: text(true, "Honest scope note. Leave empty to hide."),
      stack: list(text()),
      visual: { kind: "enum", values: PROJECT_VISUALS },
      repo: text(),
      live: text(false, "Leave empty if there is no deployment."),
      year: text(),
      metrics: list(group({ label: text(), value: text() }), "label"),
    }),
    "name",
  ),

  github: group({ repos: num(true), primaryLanguages: list(text()) }),
};

/** Sidebar grouping and human labels for the studio. */
export const SECTIONS: { key: string; label: string; blurb: string }[] = [
  { key: "profile", label: "Profile", blurb: "Name, contact and the headline copy." },
  { key: "education", label: "Education", blurb: "Degree, college and GPA." },
  { key: "aboutParagraphs", label: "About copy", blurb: "The long-form About paragraphs." },
  { key: "aboutBullets", label: "About bullets", blurb: "The short two-column list." },
  { key: "stats", label: "Stats", blurb: "The four counters under About." },
  { key: "toolkit", label: "Toolkit", blurb: "Skill categories and their items." },
  { key: "orbits", label: "Orbits", blurb: "Which names sit on each constellation ring." },
  { key: "experience", label: "Experience", blurb: "Roles, dates and bullet points." },
  { key: "certifications", label: "Certifications", blurb: "The certificate wall." },
  { key: "hackathons", label: "Hackathons", blurb: "The timeline entries." },
  { key: "sportsAchievement", label: "Sport", blurb: "The athletics highlight." },
  { key: "projects", label: "Projects", blurb: "Every case study, card and overlay." },
  { key: "github", label: "GitHub", blurb: "Repo count and primary languages." },
  { key: "statement", label: "Statement", blurb: "The big word-tunnel lines." },
  { key: "marqueeItems", label: "Marquee", blurb: "The giant looping band." },
  { key: "codeFragments", label: "Code fragments", blurb: "Ambient code that drifts past." },
  { key: "navItems", label: "Nav / rail", blurb: "Scroll-rail sections." },
  { key: "topNav", label: "Top nav", blurb: "Links in the header pill." },
];

/** A fresh empty value, for the "Add" buttons. */
export function blankFor(spec: FieldSpec): unknown {
  switch (spec.kind) {
    case "text":
      return "";
    case "number":
      return 0;
    case "bool":
      return false;
    case "enum":
      return spec.values[0];
    case "list":
      return [];
    case "group":
      return Object.fromEntries(
        Object.entries(spec.fields).map(([k, s]) => [k, blankFor(s)]),
      );
  }
}

/**
 * Structural validation. Returns human-readable problems; an empty array means
 * the document is safe to write. Unknown keys are reported rather than ignored,
 * so a typo cannot silently drop a whole section from the site.
 */
export function validateContent(doc: unknown): string[] {
  const problems: string[] = [];
  if (typeof doc !== "object" || doc === null || Array.isArray(doc)) {
    return ["Document must be a JSON object."];
  }
  const obj = doc as Record<string, unknown>;

  for (const key of Object.keys(obj)) {
    if (!(key in CONTENT_SPEC)) problems.push(`Unexpected top-level key "${key}".`);
  }
  for (const [key, spec] of Object.entries(CONTENT_SPEC)) {
    if (!(key in obj)) {
      problems.push(`Missing section "${key}".`);
      continue;
    }
    walk(obj[key], spec, key, problems);
  }
  return problems.slice(0, 40);
}

function walk(value: unknown, spec: FieldSpec, path: string, out: string[]) {
  if (out.length >= 40) return;
  switch (spec.kind) {
    case "text":
      if (typeof value !== "string") out.push(`${path} must be text.`);
      else if (value.length > 4000) out.push(`${path} is longer than 4000 characters.`);
      return;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) {
        out.push(`${path} must be a number.`);
      } else if (spec.int && !Number.isInteger(value)) {
        out.push(`${path} must be a whole number.`);
      }
      return;
    case "bool":
      if (typeof value !== "boolean") out.push(`${path} must be true or false.`);
      return;
    case "enum":
      if (typeof value !== "string" || !spec.values.includes(value)) {
        out.push(`${path} must be one of: ${spec.values.join(", ")}.`);
      }
      return;
    case "list":
      if (!Array.isArray(value)) {
        out.push(`${path} must be a list.`);
        return;
      }
      if (value.length > 200) out.push(`${path} has more than 200 entries.`);
      value.forEach((v, i) => walk(v, spec.of, `${path}[${i}]`, out));
      return;
    case "group": {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        out.push(`${path} must be an object.`);
        return;
      }
      const rec = value as Record<string, unknown>;
      for (const k of Object.keys(rec)) {
        if (!(k in spec.fields)) out.push(`${path}.${k} is not a known field.`);
      }
      for (const [k, s] of Object.entries(spec.fields)) {
        if (!(k in rec)) {
          out.push(`${path}.${k} is missing.`);
          continue;
        }
        walk(rec[k], s, `${path}.${k}`, out);
      }
      return;
    }
  }
}
