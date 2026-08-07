/**
 * Single source of truth for everything factual about Unni Krishnan M.
 * Edit here — every section reads from this file.
 */

export const profile = {
  name: "Unni Krishnan M",
  initials: "UK",
  logo: "UKM",
  brand: "BLUE//MOTION",
  headline: "AI & Data Science Student · Python Developer · ML Enthusiast",
  secondaryHeadline:
    "I build intelligent systems, full-stack applications and experimental AI products.",
  eyebrow: "AI & DATA SCIENCE STUDENT",
  location: "Tirunelveli, Tamil Nadu, India",
  email: "unnikr2607@gmail.com",
  phone: "+91 88075 88095",
  github: "https://github.com/Unni-Krishnan-M",
  githubHandle: "github.com/Unni-Krishnan-M",
  linkedin: "https://linkedin.com/in/unni-krishnan-m05",
  linkedinHandle: "linkedin.com/in/unni-krishnan-m05",
} as const;

export const education = {
  degree: "B.Tech — Artificial Intelligence & Data Science",
  college: "Ramco Institute of Technology, Rajapalayam",
  university: "Anna University",
  graduation: "May 2028",
  gpa: "7.57",
  gpaScale: "10.0",
} as const;

/** Long-form "about" copy — read as consecutive masked lines. */
export const aboutParagraphs: string[] = [
  "I'm a B.Tech Artificial Intelligence & Data Science student at Ramco Institute of Technology, and I learn the way I think most engineers actually do — by building the thing until it works.",
  "My centre of gravity is Python: automation scripts, ML experiments, FastAPI services. Around that I've picked up Java and Spring Boot for structured backends, C and C++ for the fundamentals, and React with Next.js for interfaces that don't feel like an afterthought.",
  "What I enjoy most is the seam between intelligence and interface — taking a model, an API and a database, and turning them into something a person can actually use. That's what KFive-AI, KRIS and the hackathon builds have all been about.",
  "Outside the editor I compete. Hackathons for the deadline pressure, and the 400m for the kind that doesn't wait for you.",
];

export const aboutBullets: string[] = [
  "B.Tech Artificial Intelligence & Data Science",
  "Python developer — automation, ML, FastAPI",
  "Full-stack builder — Next.js, React, Spring Boot",
  "Machine learning & generative AI enthusiast",
  "National-level hackathon participant",
  "Constantly shipping experiments",
];

export const stats = [
  { value: 7.57, suffix: "", label: "GPA", sub: "of 10.0" },
  { value: 2028, suffix: "", label: "Graduation", sub: "B.Tech AI & DS", plain: true },
  { value: 15, suffix: "+", label: "Repositories", sub: "on GitHub" },
  { value: 5, suffix: "+", label: "Certifications", sub: "verified" },
] as const;

/* ------------------------------------------------------------------ */
/* Toolkit — the constellation                                         */
/* ------------------------------------------------------------------ */

export type ToolCategory = {
  id: string;
  label: string;
  blurb: string;
  items: { name: string; note: string }[];
};

export const toolkit: ToolCategory[] = [
  {
    id: "languages",
    label: "Languages",
    blurb: "The foundation — where I actually write logic.",
    items: [
      { name: "Python", note: "Primary language. Automation, ML, FastAPI services." },
      { name: "Java", note: "OOP, collections, Spring Boot backends. NPTEL Elite." },
      { name: "C", note: "Memory, pointers and the fundamentals." },
      { name: "C++", note: "Data structures and competitive problem solving." },
      { name: "TypeScript", note: "Typed front-ends and Next.js applications." },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    blurb: "How the logic becomes a product.",
    items: [
      { name: "FastAPI", note: "Async Python APIs with typed request models." },
      { name: "Next.js", note: "App Router, server components, static export." },
      { name: "React", note: "Component architecture, hooks, state design." },
      { name: "Spring Boot", note: "REST services, layered Java architecture." },
      { name: "Tailwind CSS", note: "Utility-first design systems." },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    blurb: "Where the state lives.",
    items: [
      { name: "MongoDB", note: "Document modelling for app and chat data." },
      { name: "SQLite", note: "Embedded relational storage for local tools." },
      { name: "MySQL", note: "Schema design, joins and normalisation." },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    blurb: "The daily workflow.",
    items: [
      { name: "Git", note: "Branching, rebasing, resolving my own mistakes." },
      { name: "GitHub", note: "15+ public repositories and counting." },
      { name: "VS Code", note: "Home base." },
      { name: "Google Colab", note: "Notebook experiments and model training." },
      { name: "Vercel", note: "Deploying front-ends in one push." },
    ],
  },
  {
    id: "concepts",
    label: "Concepts",
    blurb: "What I'm actually studying under the syntax.",
    items: [
      { name: "Machine Learning", note: "Supervised models, evaluation, feature work." },
      { name: "Generative AI", note: "LLM prompting, RAG patterns, AI product design." },
      { name: "OOP", note: "Encapsulation, inheritance, clean interfaces." },
      { name: "Data Structures", note: "Trees, graphs, hashing, complexity analysis." },
      { name: "File Handling", note: "Parsing, streaming and document pipelines." },
    ],
  },
];

/** Orbit rings for the 3D/CSS constellation — flat list, ring-indexed. */
export const orbits = [
  { ring: 0, names: ["Python", "Java", "C", "C++"] },
  { ring: 1, names: ["FastAPI", "Next.js", "React", "Spring Boot"] },
  { ring: 2, names: ["MongoDB", "SQLite", "Git", "GitHub"] },
] as const;

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

export const experience: ExperienceItem[] = [
  {
    role: "Generative AI Intern",
    company: "Mentron",
    meta: "Internship · Google Colab",
    start: "JUN 2026",
    end: "JUL 2026",
    points: [
      "Completed a day-wise generative AI programme, documenting every session as a runnable Google Colab notebook.",
      "Built hands-on implementations using free and open AI tooling, from prompting patterns to small applied projects.",
      "Shipped a medical-assistant bot as the applied project for the internship track.",
    ],
    stack: ["Python", "Jupyter", "Generative AI", "Dart"],
  },
  {
    role: "Python Programming Intern",
    company: "CodSoft",
    meta: "Virtual Internship · 4 Weeks",
    start: "JAN 2025",
    end: "FEB 2025",
    points: [
      "Engineered Python scripts and small applications covering functions, loops, OOP and file handling.",
      "Completed 4 project-based tasks demonstrating practical programming and problem-solving.",
      "Worked to task deadlines and submitted reviewed, working code for each milestone.",
    ],
    stack: ["Python", "OOP", "File Handling"],
  },
];

/* ------------------------------------------------------------------ */
/* Certifications                                                      */
/* ------------------------------------------------------------------ */

export type Certification = {
  title: string;
  issuer: string;
  grade: string;
  date: string;
};

export const certifications: Certification[] = [
  {
    title: "Programming in Java",
    issuer: "NPTEL · IIT Kharagpur",
    grade: "Elite · 75%",
    date: "Jan – Apr 2025",
  },
  {
    title: "Python Essentials 1 & 2",
    issuer: "Cisco & OpenEDG",
    grade: "Completed",
    date: "Dec 2024 / Jul 2025",
  },
  {
    title: "Networking Basics",
    issuer: "Cisco Networking Academy",
    grade: "Completed",
    date: "Apr 2026",
  },
  {
    title: "Java (Basic)",
    issuer: "HackerRank",
    grade: "Skill Certified",
    date: "Dec 2025",
  },
  {
    title: "Advanced Diploma in Java Programming",
    issuer: "CSC Computer Education",
    grade: "Grade A",
    date: "Apr – Aug 2024",
  },
];

/* ------------------------------------------------------------------ */
/* Hackathons                                                          */
/* ------------------------------------------------------------------ */

export type Hackathon = {
  name: string;
  kind: string;
  host: string;
  date: string;
};

export const hackathons: Hackathon[] = [
  {
    name: "Build with AI",
    kind: "AI Workshop Series",
    host: "Google Developer Groups on Campus, RIT",
    date: "Nov 2024",
  },
  {
    name: "CREONIX'25",
    kind: "National Level Hackathon",
    host: "Inter-college",
    date: "Sep 2025",
  },
  {
    name: "FIESTAA'26",
    kind: "Gen AI Hackathon",
    host: "Inter-college",
    date: "Feb 2026",
  },
];

/* ------------------------------------------------------------------ */
/* Beyond code                                                         */
/* ------------------------------------------------------------------ */

export const sportsAchievement = {
  place: "1ST PLACE",
  events: "400m & 4×400m Relay",
  event: "RIT 12th Annual Sports Day",
  date: "May 2025",
  note: "Two golds in a single afternoon — the same stubbornness I bring to a build.",
} as const;

/* ------------------------------------------------------------------ */
/* Navigation / scroll rail                                            */
/* ------------------------------------------------------------------ */

export const navItems = [
  { id: "home", label: "HOME", index: "01" },
  { id: "about", label: "ABOUT", index: "02" },
  { id: "toolkit", label: "SYSTEM", index: "03" },
  { id: "projects", label: "PROJECTS", index: "04" },
  { id: "experience", label: "JOURNEY", index: "05" },
  { id: "achievements", label: "ACHIEVEMENTS", index: "06" },
  { id: "contact", label: "CONTACT", index: "07" },
] as const;

/** Nav shown in the top bar (subset — SYSTEM folds into ABOUT visually). */
export const topNav = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "projects", label: "PROJECTS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "achievements", label: "ACHIEVEMENTS" },
  { id: "contact", label: "CONTACT" },
] as const;

/* ------------------------------------------------------------------ */
/* Ambient code fragments that drift through the environment           */
/* ------------------------------------------------------------------ */

export const codeFragments = [
  "def train(model, X, y):",
  "@app.get('/predict')",
  "npm run build",
  "git commit -m 'ship it'",
  "SELECT * FROM certificates",
  "model.fit(X_train, y_train)",
  "await db.collection('users')",
  "class Node<T> { }",
  "pip install fastapi",
  "export default function Page()",
  "torch.no_grad()",
  "0.9412 accuracy",
] as const;

/* ------------------------------------------------------------------ */
/* Big statement — the word tunnel                                     */
/* ------------------------------------------------------------------ */

/** Each line rushes past the camera in turn. Keep them short and declarative. */
export const statement = {
  eyebrow: "WHAT I ACTUALLY DO",
  lines: ["I TURN", "IDEAS INTO", "RUNNING", "SYSTEMS."],
  /** The word that gets the accent colour. */
  accent: "RUNNING",
  footer: "Not slide decks. Not mock-ups. Things that run.",
} as const;

/** Giant looping band. Reads as a machine ticking over. */
export const marqueeItems = [
  "PYTHON",
  "FASTAPI",
  "NEXT.JS",
  "REACT",
  "JAVA",
  "SPRING BOOT",
  "MONGODB",
  "POSTGRES",
  "LANGGRAPH",
  "FLUTTER",
  "TYPESCRIPT",
  "MACHINE LEARNING",
] as const;
