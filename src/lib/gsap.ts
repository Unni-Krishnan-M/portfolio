"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

let registered = false;

if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, useGSAP);
  // Keep transforms crisp; avoid layout thrash on scroll-driven scenes.
  gsap.config({ nullTargetWarn: false });
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  registered = true;
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, useGSAP };
