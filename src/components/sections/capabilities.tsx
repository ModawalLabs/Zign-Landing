import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import {
  DelegateInstrument,
  HorizonInstrument,
  PackagesInstrument,
} from "@/components/visuals/instruments";

const ITEMS = [
  {
    title: "Expiring",
    line: "Nothing lapses quietly.",
    body: "Term dates and signing windows, read from the documents and laid out across the next 30 days.",
    Instrument: HorizonInstrument,
  },
  {
    title: "Delegation",
    line: "Hand the pen to someone you trust.",
    body: "A signer can pass their signature to a delegate. The hand-off is recorded with everything else.",
    Instrument: DelegateInstrument,
  },
  {
    title: "Packages",
    line: "Several documents, one signing.",
    body: "Bundle an agreement with its addenda; each signer moves through them in order.",
    Instrument: PackagesInstrument,
  },
] as const;

/**
 * No cards: three columns on one surface, divided by hairlines, each with
 * its instrument drawn straight on the page beneath its words.
 */
export function Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="relative py-14 lg:py-16"
    >
      <Container>
        <SectionHead
          id="capabilities-title"
          n="4"
          label="Around the signature"
          title="Everything an agreement needs after it's sent."
          lede="Zign looks after the weeks either side of the signature."
        />

        <div className="mt-8 grid divide-y divide-line border-y border-line md:mt-10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {ITEMS.map(({ title, line, body, Instrument }, i) => (
            <Reveal key={title} delay={i * 0.08} className="relative">
              <article
                id={`cap-${i}`}
                className="flex h-full flex-col py-8 lg:px-8 lg:py-9"
              >
                <p className="flex items-center gap-2.5 text-eyebrow text-muted">
                  <span className="text-indigo">4.{i + 1}</span>
                  {title}
                </p>
                <h3 className="mt-4 text-title">{line}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-pretty text-muted">
                  {body}
                </p>
                <div className="relative mt-auto pt-8">
                  {/* A pool of light under the drawing. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-x-6 -inset-y-2 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgb(138_151_240/0.08),transparent)]"
                  />
                  <Instrument />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
