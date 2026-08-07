import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Toolkit from "@/components/sections/Toolkit";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { DataStream } from "@/components/core/Environment";

export default function Home() {
  return (
    <>
      <Hero />
      <DataStream />
      <About />
      <Toolkit />
      <DataStream />
      <Projects />
      <Experience />
      <Achievements />
      <DataStream />
      <Contact />
      <Footer />
    </>
  );
}
