"use client";

import Section from "@/components/core/Section";
import SectionHeader from "@/components/core/SectionHeader";
import { DataStream } from "@/components/core/Environment";
import CertWall from "./achievements/CertWall";
import HackathonTimeline from "./achievements/HackathonTimeline";
import SportsReveal from "./achievements/SportsReveal";

/**
 * Composition only — each sub-block renders its own heading, so this file
 * deliberately adds none.
 */
export default function Achievements() {
  return (
    <Section id="achievements">
      <SectionHeader
        index="06"
        label="ACHIEVEMENTS"
        title={
          <>
            Knowledge
            <br />
            <span className="text-blue">In Progress.</span>
          </>
        }
        blurb="Certificates are only proof that I sat still long enough to finish something. What they actually record is the order I picked things up in."
      />

      <div className="mt-20">
        <CertWall />
      </div>

      <DataStream className="my-10 opacity-60" />

      <div className="grid gap-20 xl:grid-cols-[1.05fr_0.95fr] xl:gap-14">
        <HackathonTimeline />
        <SportsReveal />
      </div>
    </Section>
  );
}
