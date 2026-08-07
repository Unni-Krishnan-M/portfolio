/**
 * Real repositories from github.com/Unni-Krishnan-M.
 *
 * Every `stack` entry below was verified against the repo's actual
 * package.json / pyproject.toml / pubspec.yaml — not from its README, because
 * several READMEs describe intended rather than shipped functionality.
 * Descriptions deliberately state what is built, so nothing here can be
 * contradicted by someone opening the repo in an interview.
 */

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
  /** Honest note about scope/state. Shown in the overlay, not the card. */
  status?: string;
  stack: string[];
  /** Drives the generated visual: which abstract interface to draw. */
  visual:
    | "backend"
    | "chat"
    | "dashboard"
    | "neural"
    | "supplychain"
    | "event"
    | "mobile"
    | "workspace"
    | "grid";
  repo: string;
  live?: string;
  year: string;
  /** Highlighted metrics for the overlay. */
  metrics?: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "kris-ai-automation-platform",
    name: "KRIS AI Automation Platform",
    category: "AI BACKEND ARCHITECTURE",
    tagline: "A layered FastAPI backend for AI automation.",
    summary:
      "Async FastAPI service with JWT refresh-token rotation, pgvector semantic search and a LangGraph agent runtime — built in a strict models → repositories → services → api architecture.",
    detail: [
      "The project I'd point at first if someone asked to see how I structure a backend. It follows a strict layered architecture — models, repositories, services, then the versioned API surface — so business logic never leaks into route handlers.",
      "Auth is JWT with refresh-token rotation. Conversations stream over SSE. Uploaded documents are chunked and embedded into Postgres with pgvector for semantic retrieval, and there's a separate memory store plus a LangGraph agent runtime on top.",
      "It ships with six Alembic migrations, nine pytest suites covering auth, chat, RAG, memory and chunking, and CI running ruff and mypy in strict mode. Postgres, Redis and Ollama come up through Docker Compose.",
    ],
    status:
      "Backend only — the frontend directory is an intentional placeholder. This repo is the API, not a product.",
    stack: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "pgvector", "LangGraph", "Redis", "Docker"],
    visual: "backend",
    repo: "https://github.com/Unni-Krishnan-M/KRIS-AI-Automation-Platform",
    year: "2026",
    metrics: [
      { label: "Alembic migrations", value: "6" },
      { label: "Test suites", value: "9" },
      { label: "Type checking", value: "mypy strict" },
    ],
  },
  {
    slug: "medical-bot",
    name: "Medical Intake Bot",
    category: "FULL-STACK AI · INTERNSHIP",
    tagline: "Symptom triage that outputs a real clinical format.",
    summary:
      "Flutter client over a FastAPI + LangGraph backend that walks a patient through symptom, duration and severity, retrieves guidance from a vector store, and emits an HL7 FHIR R4 intake memo.",
    detail: [
      "Built during my generative AI internship at Mentron. The interesting part isn't the chat — it's that the conversation is a state machine, not a prompt.",
      "The LangGraph agent has an explicit graph, nodes, state and tools. It collects the primary symptom, then duration, then severity, retrieves relevant guidance from a ChromaDB vector store, and assembles the result into an HL7 FHIR R4 intake memo — an actual interoperable clinical format rather than free text.",
      "The client is Flutter, organised feature-first across auth, chat, history, profile and reports, using Riverpod and GoRouter. Backend is async FastAPI with SQLAlchemy, JWT plus Google OAuth, and Gemini 2.5 Flash as the model. Postgres and ChromaDB run in Docker Compose, with GitHub Actions for CI.",
    ],
    status:
      "A learning project with a medical disclaimer in the README — it is not a diagnostic tool and isn't meant to be one.",
    stack: ["Flutter", "Dart", "Python", "FastAPI", "LangGraph", "ChromaDB", "Gemini", "Riverpod"],
    visual: "mobile",
    repo: "https://github.com/Unni-Krishnan-M/Medical-Bot-Mentron-Intership",
    year: "2026",
    metrics: [
      { label: "Files", value: "222" },
      { label: "Output format", value: "FHIR R4" },
      { label: "Agent", value: "LangGraph" },
    ],
  },
  {
    slug: "certificate-management",
    name: "Certificate Management",
    category: "FULL-STACK APPLICATION",
    tagline: "Role-based certificate verification for a college.",
    summary:
      "Spring Boot and MongoDB GridFS behind a React client. Students upload certificates, staff verify or reject them, and both sides get analytics — with JWT role-based access separating the two.",
    detail: [
      "A Spring Boot 3 service with Spring Security and JWT, split into controllers, services and repositories across 21 Java files, backed by MongoDB. Certificate files — PDF, JPG or PNG — are stored in GridFS rather than on disk, so the whole thing stays stateless.",
      "Two distinct roles with genuinely different interfaces: students upload and track their certificates and see their own dashboard; staff review a queue, verify or reject submissions, and get aggregate analytics.",
      "The React front end is 28 source files — dashboards, a certificate viewer with modal preview, a drag-and-drop upload zone, reports, and an auth context wrapping the JWT flow.",
    ],
    status:
      "The Vercel deployment listed on the repo is no longer live; run it locally with the README instructions.",
    stack: ["Java 17", "Spring Boot", "Spring Security", "MongoDB", "GridFS", "React", "JWT"],
    visual: "dashboard",
    repo: "https://github.com/Unni-Krishnan-M/Certificate-Management",
    year: "2026",
    metrics: [
      { label: "Java files", value: "21" },
      { label: "React sources", value: "28" },
      { label: "Roles", value: "Student / Staff" },
    ],
  },
  {
    slug: "kfive-ai",
    name: "KFive AI",
    category: "AI WORKSPACE · MONOREPO",
    tagline: "An offline-first AI workspace, front to back.",
    summary:
      "npm-workspaces monorepo with a React/Vite workspace UI — chat, agents, a Monaco code studio, document tools, voice — over an Express and TypeScript API with WebSockets, queues and a vector store wired in.",
    detail: [
      "My most ambitious scaffold: a single workspace that puts conversational AI, a code studio, document processing and voice in one shell, structured as an npm-workspaces monorepo with separate frontend and backend packages.",
      "The frontend is React 18 with Vite and TypeScript, and around fifteen built-out pages — Chat, Agents, CodeStudio, Documents, VoiceAssistant, Workspace, Settings, Dashboard and auth — using Zustand for state, TanStack Query for data, Radix UI primitives and Monaco for the editor. It's a PWA.",
      "The backend is Express and TypeScript with routes for auth, chat, documents and agents, Socket.IO for real-time, Mongoose for persistence, BullMQ on Redis for queues, and a ChromaDB client for retrieval. Docker Compose brings up the dependencies.",
    ],
    status:
      "Honest scope note: the repo's own STATUS.md records that MongoDB, Redis and the local model server were not yet connected. What's real is the architecture, both servers, the WebSocket layer and the full UI — the AI plumbing is scaffolded, not shipped.",
    stack: ["TypeScript", "React", "Vite", "Express", "Socket.IO", "Mongoose", "BullMQ", "ChromaDB"],
    visual: "workspace",
    repo: "https://github.com/Unni-Krishnan-M/KFive-AI",
    year: "2026",
    metrics: [
      { label: "Workspaces", value: "2" },
      { label: "Pages", value: "~15" },
      { label: "Real-time", value: "Socket.IO" },
    ],
  },
  {
    slug: "ai-intern-sih",
    name: "AI Intern Matchmaking",
    category: "SMART INDIA HACKATHON",
    tagline: "Three dashboards for one matching problem.",
    summary:
      "An SIH prototype for PM internship matching, with fully built Student, Industry and Admin dashboards — including affirmative-action reporting and an AI matching visualisation. The only project here that's live.",
    detail: [
      "Built for the Smart India Hackathon framing of the PM Internship scheme: candidates and openings need matching at scale, and three very different users need three very different views of it.",
      "Students get profile setup, ranked recommendations and application tracking. Industry gets internship posting, matched-candidate review and analytics. Admin gets system overview, affirmative-action monitoring and report export. There's also a dedicated page visualising how the matching works, and a chatbot component.",
      "React 18 with TypeScript and Vite, Tailwind, Framer Motion for transitions, Recharts for the analytics, and React Router 7 across the three role trees.",
    ],
    status:
      "Front-end prototype: the dashboard figures are hardcoded demo data and there's no backend in the repo. It demonstrates the product thinking and the interface, not a running matching engine.",
    stack: ["TypeScript", "React", "Vite", "Tailwind CSS", "Recharts", "Framer Motion"],
    visual: "neural",
    repo: "https://github.com/Unni-Krishnan-M/AI-Intern-SIH",
    live: "https://ai-intern-sih.vercel.app",
    year: "2025",
    metrics: [
      { label: "Role dashboards", value: "3" },
      { label: "Status", value: "Live" },
      { label: "Event", value: "SIH" },
    ],
  },
  {
    slug: "agrichain-ai",
    name: "AgriChain AI",
    category: "HACKATHON · ML + LEDGER",
    tagline: "Forecasting and fraud detection on a hand-rolled ledger.",
    summary:
      "Agricultural supply-chain platform pairing a SHA256 hash-chain audit ledger with classical ML — an ensemble demand forecast, anomaly detection, fraud scoring, QR batch verification and PDF reports. Runs fully offline.",
    detail: [
      "The KPR hackathon build. Two halves that don't usually sit together: a tamper-evident ledger and a statistics stack.",
      "The ledger is written by hand with Node's crypto module — SHA256-linked blocks, no blockchain SDK — so every supply-chain event is append-only and verifiable. Batches carry QR codes that resolve back to their ledger entry, and the system exports PDF executive reports.",
      "The analytics engine is Python: a demand forecast ensembling linear regression, random forest and ARIMA; anomaly detection combining Z-score with Isolation Forest; and a composite Supply Chain Risk Index feeding a live operations dashboard built on Chart.js.",
    ],
    status:
      "Built inside a hackathon window and it shows in the repo hygiene. No API keys needed — it runs entirely locally against a local MongoDB.",
    stack: ["Node.js", "Express", "MongoDB", "React", "scikit-learn", "statsmodels", "Chart.js"],
    visual: "supplychain",
    repo: "https://github.com/Unni-Krishnan-M/KPR-Hackathon",
    year: "2026",
    metrics: [
      { label: "Ledger", value: "SHA256 chain" },
      { label: "Forecast", value: "3-model ensemble" },
      { label: "API keys", value: "None" },
    ],
  },
  {
    slug: "hackfinity",
    name: "Hackfinity 3.0",
    category: "EVENT PLATFORM · REACTIVE BACKEND",
    tagline: "A hackathon site with a live backend behind it.",
    summary:
      "Turborepo monorepo shipping a Next.js 16 event site — preloader, starfield, custom cursor, countdown, sponsor flows — over a Convex reactive backend handling problem statements, sponsor leads and admin auth.",
    detail: [
      "A real event website, not a template. Landing, problem statements, sponsor, team and admin pages inside a Turborepo monorepo with a shared UI package.",
      "The Convex backend is where it stops being a static site: schemas and functions for problem statements, sponsors, sponsor leads, settings and admin auth, with problem statements seeded from a large structured data file. Because Convex is reactive, the admin panel updates the public site without a redeploy.",
      "The front end is where I spent the motion budget — hero, starfield, preloader, custom cursor, live countdown, tracks, rewards, stats, coordinator grid, smooth scroll via Lenis and GSAP, plus a Web Audio module for interaction sound.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Convex", "Tailwind CSS 4", "GSAP", "Lenis", "Turborepo"],
    visual: "event",
    repo: "https://github.com/Unni-Krishnan-M/Hackfinity-3.0",
    year: "2026",
    metrics: [
      { label: "Backend", value: "Convex" },
      { label: "Admin panel", value: "40 KB" },
      { label: "Monorepo", value: "Turborepo" },
    ],
  },
  {
    slug: "card-stack",
    name: "Card Stack",
    category: "MOBILE · FLUTTER + FIREBASE",
    tagline: "A card wallet that solves the awkward parts.",
    summary:
      "Flutter and Firebase loyalty-card wallet with ML Kit document and barcode scanning, compression to fit Firestore's 1 MiB limit, an Android home-screen widget, and max brightness while a barcode is on screen.",
    detail: [
      "A loyalty and membership card wallet — the kind of app whose difficulty is entirely in the details nobody mentions.",
      "Cards are captured with Google ML Kit document scanning, with an image-picker fallback when scanning isn't available, then manually cropped and compressed so the image fits inside Firestore's 1 MiB per-document limit. Barcodes are read with ML Kit barcode scanning and re-rendered as scannable widgets.",
      "Two touches I'm happy with: the screen forces maximum brightness while a barcode is displayed, because scanners fail on dim phone screens, and there's a native Android home-screen widget backed by a platform channel and a local cache so it works before Firebase resolves.",
      "Architecture is Riverpod providers over repositories and services — auth, cards, barcode, image, scanner, storage, native cache — with Firebase Auth, Google Sign-In and Cloud Firestore underneath, and Codemagic for CI.",
    ],
    stack: ["Flutter", "Dart", "Riverpod", "Firebase", "Firestore", "ML Kit", "Kotlin"],
    visual: "mobile",
    repo: "https://github.com/Unni-Krishnan-M/Card_stack",
    year: "2026",
    metrics: [
      { label: "Version", value: "2.0.0" },
      { label: "Scanning", value: "ML Kit" },
      { label: "Widget", value: "Native Android" },
    ],
  },
  {
    slug: "kris-bot",
    name: "Kris Bot",
    category: "PERSONAL AI ASSISTANT",
    tagline: "One assistant, many output formats.",
    summary:
      "MERN-style personal assistant with JWT auth and chat history, wired for multi-format output — PDF, PowerPoint via pptxgenjs, resume generation and resume analysis behind a Tailwind React client.",
    detail: [
      "A personal AI assistant built around the idea that a chat interface should be able to hand you a file, not just text.",
      "Express and Mongoose behind JWT auth with persisted chat history. The generation layer covers PDF output, PowerPoint decks through pptxgenjs, resume building and resume analysis, with multer handling uploads.",
      "The client is React 18 with React Router, Tailwind, Headless UI and Lucide icons, running alongside the API through concurrently in development.",
    ],
    status:
      "Scope note from the repo's own README: several generation endpoints are still mock functions awaiting real model calls — PDF generation is the path that's actually implemented. The auth, history and document plumbing is real.",
    stack: ["Node.js", "Express", "MongoDB", "React", "Tailwind CSS", "pptxgenjs", "JWT"],
    visual: "chat",
    repo: "https://github.com/Unni-Krishnan-M/Kris-Bot",
    year: "2026",
    metrics: [
      { label: "Auth", value: "JWT" },
      { label: "Outputs", value: "PDF / PPTX" },
      { label: "Stack", value: "MERN" },
    ],
  },
  {
    slug: "interface-studies",
    name: "Interface Studies",
    category: "MOTION & FRONT-END PRACTICE",
    tagline: "Four concept sites, built to practise motion.",
    summary:
      "A deliberate set of front-end studies — restaurant, café, gym and barber concepts — each used to drill a different technique: scroll choreography, liquid hover distortion, data-driven sections, single-component composition.",
    detail: [
      "These aren't client work and I don't present them as products. They're practice pieces, each one an excuse to learn a specific technique properly.",
      "The restaurant site is the most developed: Next.js 15 with GSAP ScrollTrigger and Lenis choreographing fourteen scroll-told scenes, four of them pinned, with the technical trade-offs and the remaining gaps documented honestly in its README.",
      "The café site is where I built a custom effects layer — liquid hover, liquid distortion, spotlight reveal, a coverflow gallery, magnetic and text-stagger primitives. The gym site is a study in driving an entire marketing page from JSON data files. The barber site was a constraint exercise: one component, hand-written CSS, no utility framework.",
      "Everything I learned in these four went directly into the site you're reading now.",
    ],
    status:
      "Concept and practice sites, grouped honestly as one entry rather than padded out into four separate projects.",
    stack: ["Next.js", "React", "GSAP", "Lenis", "Framer Motion", "Tailwind CSS"],
    visual: "grid",
    repo: "https://github.com/Unni-Krishnan-M?tab=repositories",
    year: "2026",
    metrics: [
      { label: "Studies", value: "4" },
      { label: "Focus", value: "Scroll motion" },
      { label: "Type", value: "Practice" },
    ],
  },
];

export const githubMeta = {
  repos: 15,
  featured: projects.length,
  primaryLanguages: ["TypeScript", "Python", "Java", "Dart", "JavaScript"],
} as const;
