import { Clause } from "@/components/ui/clause";
import { Container } from "@/components/ui/container";
import { Reveal, RevealRule, ScrollWords } from "@/components/ui/reveal";

export function Statement() {
  return (
    <section
      aria-label="Why Zign"
      className="relative overflow-hidden py-16 lg:py-20"
    >
      {/* A ruled sheet behind the words, fading toward the margins. */}
      <div
        aria-hidden
        className="ruled pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_80%_at_68%_50%,#000,transparent_80%)] opacity-80"
      />
      <Container className="relative">
        <RevealRule />
        <div className="grid gap-y-8 pt-5 lg:grid-cols-12">
          <Reveal blur={false} y={6} className="lg:col-span-3">
            <Clause n="1">The problem</Clause>
          </Reveal>
          <div className="lg:col-span-9 lg:pt-8">
            <ScrollWords
              className="text-display text-[clamp(1.6rem,3.1vw,2.7rem)] leading-[1.2] tracking-[-0.022em] text-balance"
              emphasis={["waiting.", "moving,"]}
              text="A contract spends most of its life waiting. Waiting to be read, waiting on a redline, waiting in an inbox for one last signature. Zign keeps it moving, and keeps the record of every step it took."
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
