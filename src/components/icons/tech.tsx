/**
 * Maps a technology name to a small mark + its brand colour.
 * One registry so the hero orbit, toolkit constellation and project chips can
 * never disagree about how a technology is drawn.
 */
import type { ReactNode } from "react";
import { Brain, Database, GitBranch, Zap, Leaf, Boxes, FileCode2, Cpu, Cloud, Terminal, Sparkles, Layers } from "lucide-react";
import {
  GithubIcon,
  PythonIcon,
  JavaIcon,
  ReactIcon,
  NextIcon,
  MongoIcon,
  TailwindIcon,
  FlutterIcon,
  LetterMark,
} from "./Brand";

export type TechMark = { node: ReactNode; tint: string };

const size = "size-full";

const registry: Record<string, TechMark> = {
  Python: { node: <PythonIcon className={size} />, tint: "#3776AB" },
  Java: { node: <JavaIcon className={size} />, tint: "#EA2D2E" },
  "Java 17": { node: <JavaIcon className={size} />, tint: "#EA2D2E" },
  C: { node: <LetterMark text="C" className={size} bg="#E8F1FF" fg="#00599C" />, tint: "#00599C" },
  "C++": { node: <LetterMark text="C++" className={size} bg="#E8F1FF" fg="#00599C" />, tint: "#00599C" },
  TypeScript: { node: <LetterMark text="TS" className={size} bg="#E6F0FF" fg="#3178C6" />, tint: "#3178C6" },
  JavaScript: { node: <LetterMark text="JS" className={size} bg="#FFF6D6" fg="#B58900" />, tint: "#F7DF1E" },
  Dart: { node: <LetterMark text="{ }" className={size} bg="#E4F6FF" fg="#0175C2" />, tint: "#0175C2" },
  Kotlin: { node: <LetterMark text="Kt" className={size} bg="#EFE9FF" fg="#7F52FF" />, tint: "#7F52FF" },

  React: { node: <ReactIcon className={`${size} text-[#61DAFB]`} />, tint: "#61DAFB" },
  "React 19": { node: <ReactIcon className={`${size} text-[#61DAFB]`} />, tint: "#61DAFB" },
  "Next.js": { node: <NextIcon className={size} />, tint: "#0A0A0A" },
  "Next.js 16": { node: <NextIcon className={size} />, tint: "#0A0A0A" },
  FastAPI: { node: <Zap className={`${size} text-[#009688]`} strokeWidth={2.2} />, tint: "#009688" },
  "Spring Boot": { node: <Leaf className={`${size} text-[#6DB33F]`} strokeWidth={2.2} />, tint: "#6DB33F" },
  "Spring Security": { node: <Leaf className={`${size} text-[#6DB33F]`} strokeWidth={2.2} />, tint: "#6DB33F" },
  "Tailwind CSS": { node: <TailwindIcon className={size} />, tint: "#06B6D4" },
  "Tailwind CSS 4": { node: <TailwindIcon className={size} />, tint: "#06B6D4" },
  "Tailwind CSS 3": { node: <TailwindIcon className={size} />, tint: "#06B6D4" },
  Flutter: { node: <FlutterIcon className={size} />, tint: "#47C5FB" },
  Express: { node: <Terminal className={`${size} text-ink`} strokeWidth={2} />, tint: "#111827" },
  "Node.js": { node: <Boxes className={`${size} text-[#5FA04E]`} strokeWidth={2} />, tint: "#5FA04E" },
  Vite: { node: <Zap className={`${size} text-[#BD34FE]`} strokeWidth={2.2} />, tint: "#646CFF" },
  Riverpod: { node: <Layers className={`${size} text-[#0175C2]`} strokeWidth={2} />, tint: "#0175C2" },
  Turborepo: { node: <Boxes className={`${size} text-blue`} strokeWidth={2} />, tint: "#1261FF" },
  GSAP: { node: <LetterMark text="G" className={size} bg="#E9FFD9" fg="#4F9E00" />, tint: "#88CE02" },
  Lenis: { node: <LetterMark text="L" className={size} bg="#EAF2FF" fg="#1261FF" />, tint: "#1261FF" },
  "Framer Motion": { node: <Sparkles className={`${size} text-blue`} strokeWidth={2} />, tint: "#1261FF" },
  "Socket.IO": { node: <Cloud className={`${size} text-ink`} strokeWidth={2} />, tint: "#111827" },
  Recharts: { node: <Layers className={`${size} text-blue`} strokeWidth={2} />, tint: "#1261FF" },
  "Chart.js": { node: <Layers className={`${size} text-[#FF6384]`} strokeWidth={2} />, tint: "#FF6384" },

  MongoDB: { node: <MongoIcon className={size} />, tint: "#00ED64" },
  Mongoose: { node: <MongoIcon className={size} />, tint: "#00ED64" },
  Firestore: { node: <Database className={`${size} text-[#FFA000]`} strokeWidth={2} />, tint: "#FFA000" },
  Firebase: { node: <Database className={`${size} text-[#FFA000]`} strokeWidth={2} />, tint: "#FFA000" },
  SQLite: { node: <Database className={`${size} text-[#0F80CC]`} strokeWidth={2} />, tint: "#0F80CC" },
  MySQL: { node: <Database className={`${size} text-[#00758F]`} strokeWidth={2} />, tint: "#00758F" },
  PostgreSQL: { node: <Database className={`${size} text-[#336791]`} strokeWidth={2} />, tint: "#336791" },
  pgvector: { node: <Database className={`${size} text-[#336791]`} strokeWidth={2} />, tint: "#336791" },
  SQLAlchemy: { node: <Database className={`${size} text-[#D71F00]`} strokeWidth={2} />, tint: "#D71F00" },
  Redis: { node: <Database className={`${size} text-[#DC382D]`} strokeWidth={2} />, tint: "#DC382D" },
  ChromaDB: { node: <Database className={`${size} text-blue`} strokeWidth={2} />, tint: "#1261FF" },
  Convex: { node: <LetterMark text="Cv" className={size} bg="#FFEDE6" fg="#EE342F" />, tint: "#EE342F" },
  GridFS: { node: <MongoIcon className={size} />, tint: "#00ED64" },

  Git: { node: <GitBranch className={`${size} text-[#F05032]`} strokeWidth={2.2} />, tint: "#F05032" },
  GitHub: { node: <GithubIcon className={`${size} text-ink`} />, tint: "#111827" },
  "VS Code": { node: <FileCode2 className={`${size} text-[#007ACC]`} strokeWidth={2} />, tint: "#007ACC" },
  Docker: { node: <Boxes className={`${size} text-[#2496ED]`} strokeWidth={2} />, tint: "#2496ED" },
  Vercel: { node: <LetterMark text="▲" className={size} bg="#F1F5F9" fg="#0A0A0A" />, tint: "#0A0A0A" },
  "Google Colab": { node: <FileCode2 className={`${size} text-[#F9AB00]`} strokeWidth={2} />, tint: "#F9AB00" },
  JWT: { node: <LetterMark text="JWT" className={size} bg="#F3E8FF" fg="#6B21A8" />, tint: "#1261FF" },

  "Machine Learning": { node: <Brain className={`${size} text-blue`} strokeWidth={2} />, tint: "#1261FF" },
  "Generative AI": { node: <Sparkles className={`${size} text-blue`} strokeWidth={2} />, tint: "#1261FF" },
  "AI / ML": { node: <Brain className={`${size} text-blue`} strokeWidth={2} />, tint: "#1261FF" },
  LangGraph: { node: <Brain className={`${size} text-[#1C3C3C]`} strokeWidth={2} />, tint: "#1C3C3C" },
  Gemini: { node: <Sparkles className={`${size} text-[#4285F4]`} strokeWidth={2} />, tint: "#4285F4" },
  "ML Kit": { node: <Brain className={`${size} text-[#4285F4]`} strokeWidth={2} />, tint: "#4285F4" },
  "scikit-learn": { node: <Brain className={`${size} text-[#F7931E]`} strokeWidth={2} />, tint: "#F7931E" },
  statsmodels: { node: <Layers className={`${size} text-blue`} strokeWidth={2} />, tint: "#1261FF" },
  OOP: { node: <Boxes className={`${size} text-blue`} strokeWidth={2} />, tint: "#1261FF" },
  "Data Structures": { node: <Cpu className={`${size} text-blue`} strokeWidth={2} />, tint: "#1261FF" },
  "File Handling": { node: <FileCode2 className={`${size} text-blue`} strokeWidth={2} />, tint: "#1261FF" },
  BullMQ: { node: <Layers className={`${size} text-[#DC382D]`} strokeWidth={2} />, tint: "#DC382D" },
  pptxgenjs: { node: <FileCode2 className={`${size} text-[#D24726]`} strokeWidth={2} />, tint: "#D24726" },
};

/** Falls back to a blue lettermark so an unmapped name still renders cleanly. */
export function techMark(name: string): TechMark {
  return (
    registry[name] ?? {
      node: <LetterMark text={name.slice(0, 2)} className={size} />,
      tint: "#1261FF",
    }
  );
}

export function hasMark(name: string) {
  return name in registry;
}
