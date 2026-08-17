import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { profile } from "@/data/profile";
import { SITE } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-jb",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Unni Krishnan M | AI & Data Science | Developer Portfolio",
    template: "%s | Unni Krishnan M",
  },
  description:
    "Portfolio of Unni Krishnan M — AI & Data Science student, Python developer, full-stack builder and ML enthusiast. Building intelligent systems with FastAPI, Next.js and machine learning.",
  keywords: [
    "Unni Krishnan",
    "Unni Krishnan M",
    "AI Developer",
    "Python Developer",
    "AI Data Science",
    "Machine Learning",
    "Full Stack Developer",
    "FastAPI",
    "Next.js",
    "React",
    "Java",
    "Ramco Institute of Technology",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: SITE,
    siteName: `${profile.name} — Portfolio`,
    title: "Unni Krishnan M | AI & Data Science | Developer Portfolio",
    description:
      "AI & Data Science student building full-stack applications, AI systems and experimental products.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unni Krishnan M | AI & Data Science Developer",
    description:
      "AI & Data Science student building full-stack applications, AI systems and experimental products.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE },
};

export const viewport: Viewport = {
  themeColor: "#f7faff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/**
 * Document shell only — fonts, metadata and <body>. The portfolio's visual
 * chrome lives in (site)/layout.tsx so that /admin/<key> can render without it.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable}`}>
      <body className="relative antialiased">{children}</body>
    </html>
  );
}
