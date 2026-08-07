import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/core/SmoothScroll";
import CustomCursor from "@/components/core/CustomCursor";
import Preloader from "@/components/core/Preloader";
import Navigation from "@/components/core/Navigation";
import ScrollRail from "@/components/core/ScrollRail";
import Environment from "@/components/core/Environment";
import { profile, education } from "@/data/profile";

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

const SITE = "https://unni-krishnan.vercel.app";

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

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "AI & Data Science Student · Python Developer",
  email: `mailto:${profile.email}`,
  url: SITE,
  sameAs: [profile.github, profile.linkedin],
  address: { "@type": "PostalAddress", addressLocality: "Tirunelveli", addressCountry: "IN" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: education.college,
    parentOrganization: { "@type": "CollegeOrUniversity", name: education.university },
  },
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Python",
    "FastAPI",
    "Next.js",
    "React",
    "Java",
    "Spring Boot",
    "MongoDB",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable}`}>
      <body className="relative antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[500] focus:rounded-full focus:bg-blue focus:px-5 focus:py-2.5 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>

        <Preloader />
        <SmoothScroll />
        <CustomCursor />
        <Environment />
        <Navigation />
        <ScrollRail />

        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
