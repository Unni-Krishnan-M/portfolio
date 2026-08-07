import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Toolkit from "@/components/sections/Toolkit";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import PortalSection from "@/components/core/PortalSection";
import Gateway from "@/components/core/Gateway";
import { DataStream } from "@/components/core/Environment";

/**
 * Section order, and where the "going inside" portals sit.
 *
 * Projects is deliberately NOT wrapped in a portal — it pins its own horizontal
 * track, and `clip-path` on an ancestor would break ScrollTrigger's fixed pin.
 */
export default function Home() {
  return (
    <>
      <Hero />

      {/* the fly-through out of the hero */}
      <Gateway index="02" label="About" />

      <PortalSection inset={9} radius={4} scale={0.88}>
        <About />
      </PortalSection>

      <PortalSection inset={7} radius={3} scale={0.92}>
        <Toolkit />
      </PortalSection>

      <DataStream />

      <Projects />

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
