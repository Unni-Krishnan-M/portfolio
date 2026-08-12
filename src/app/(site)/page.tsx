import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Statement from "@/components/sections/Statement";
import Toolkit from "@/components/sections/Toolkit";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import PortalSection from "@/components/core/PortalSection";
import Gateway from "@/components/core/Gateway";
import Marquee from "@/components/core/Marquee";
import { DataStream } from "@/components/core/Environment";

/**
 * Section order, and where the depth transitions sit.
 *
 * The three "going inside" devices are deliberately different from each other so
 * the trip down the page never repeats itself:
 *   Gateway variant="portal"  — fly through a rounded window
 *   Statement                 — fly through oversized type
 *   Gateway variant="grid"    — fly down a perspective corridor
 *
 * Projects is NOT wrapped in a PortalSection: it pins its own horizontal track,
 * and `clip-path` on an ancestor would break ScrollTrigger's fixed pin.
 */
export default function Home() {
  return (
    <>
      <Hero />

      <Gateway index="02" label="About" variant="portal" />

      <PortalSection inset={9} radius={4} scale={0.88}>
        <About />
      </PortalSection>

      <Marquee className="border-y border-line/70" />

      {/* fly through the words */}
      <Statement />

      <PortalSection inset={7} radius={3} scale={0.92}>
        <Toolkit />
      </PortalSection>

      {/* fly down the corridor into the work */}
      <Gateway index="04" label="Projects" variant="grid" />

      <Projects />

      <Marquee reverse className="border-y border-line/70" />

      <PortalSection inset={8} radius={3.5} scale={0.9}>
        <Experience />
      </PortalSection>

      <PortalSection inset={7} radius={3} scale={0.92}>
        <Achievements />
      </PortalSection>

      <DataStream />

      <PortalSection inset={6} radius={2.5} scale={0.94}>
        <Contact />
        <Footer />
      </PortalSection>
    </>
  );
}
