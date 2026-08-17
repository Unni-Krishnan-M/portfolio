import SmoothScroll from "@/components/core/SmoothScroll";
import CustomCursor from "@/components/core/CustomCursor";
import Preloader from "@/components/core/Preloader";
import Navigation from "@/components/core/Navigation";
import ScrollRail from "@/components/core/ScrollRail";
import Environment from "@/components/core/Environment";
import WarpOverlay from "@/components/core/WarpOverlay";
import { profile, education } from "@/data/profile";
import { SITE } from "@/lib/site";

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

/**
 * The portfolio's global chrome. It lives in this route group rather than the
 * root layout so the content studio at /admin/<key> does not inherit it — the
 * floating nav, scroll rail, smooth-scroll hijack and custom cursor all fight a
 * form-heavy editor.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
      <WarpOverlay />
      <Navigation />
      <ScrollRail />

      <main className="relative z-10">{children}</main>
    </>
  );
}
