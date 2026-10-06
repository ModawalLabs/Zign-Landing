"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import {
  ByUseInstrument,
  DelegateInstrument,
  HorizonInstrument,
  PackagesInstrument,
  PendingInstrument,
  VerifyInstrument,
} from "@/components/visuals/instruments";
import { cn } from "@/lib/utils";

const ROWS = [
  {
    title: "Expiring",
    line: "Nothing lapses quietly.",
    body: "Term dates and signing windows are read from the documents themselves and laid out across the next thirty days.",
    Instrument: HorizonInstrument,
  },
  {
    title: "Delegation",
    line: "Hand the pen to someone you trust.",
    body: "A signer can pass their signature to a delegate from the signing link. The hand-off is recorded with everything else.",
    Instrument: DelegateInstrument,
  },
  {
    title: "Packages",
    line: "Several documents, one signing.",
    body: "Bundle an MSA, its addendum and a schedule. Each signer moves through them in order, and you watch every signature arrive.",
    Instrument: PackagesInstrument,
  },
  {
    title: "Templates",
    line: "Your best contracts, reused.",
    body: "Save any agreement as a template. The ones your team reaches for rise to the top.",
    Instrument: ByUseInstrument,
  },
  {
    title: "Verify",
    line: "Check any signed copy.",
    body: "Drop a signed PDF or its certificate into Verify. The hash and seal are recomputed, and any change since signing shows.",
    Instrument: VerifyInstrument,
  },
  {
    title: "Pending",
    line: "See who is holding it up.",
    body: "One list of what waits on you and what waits on others, with the dates that matter beside each.",
    Instrument: PendingInstrument,
  },
] as const;

/**
 * No cards: an index down the left that follows the reader, and the six
 * instruments drawn straight on the page, each on its own rule.
 */
export function Capabilities() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = ROWS.map((_, i) => document.getElementById(`cap-${i}`)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) setActive(Number(e.target.id.slice(4)));
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="relative py-16 lg:py-20"
    >
      <Container>
        <SectionHead
          id="capabilities-title"
          n="5"
          label="Around the signature"
          title="Everything an agreement needs after it's sent."
          lede="Signing is one moment in a contract's life. Zign looks after the weeks either side of it."
        />

        <div className="mt-10 grid gap-x-10 md:mt-12 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <ol className="sticky top-28 space-y-1">
              {ROWS.map((r, i) => {
                const on = i === active;
                return (
                  <li key={r.title}>
                    <a
                      href={`#cap-${i}`}
                      aria-current={on ? "true" : undefined}
                      className={cn(
                        "group flex items-center gap-3 py-1.5 text-[14px] transition-colors duration-300",
                        on ? "text-ink" : "text-muted hover:text-ink",
                      )}
                    >
                      <span
                        className={cn(
                          "h-px transition-all duration-500 ease-(--ease-settle)",
                          on ? "w-6 bg-indigo" : "w-3 bg-line group-hover:w-4",
                        )}
                      />
                      <span className="font-mono text-[11px] text-subtle">
                        5.{i + 1}
                      </span>
                      {r.title}
                    </a>
                  </li>
                );
              })}
            </ol>
          </aside>

          <div className="lg:col-span-9">
            {ROWS.map(({ title, line, body, Instrument }, i) => (
              <article
                key={title}
                id={`cap-${i}`}
                className="grid scroll-mt-28 gap-y-7 border-t border-line py-10 last:border-b lg:grid-cols-12 lg:gap-x-8 lg:py-12"
              >
                <Reveal className="lg:col-span-5">
                  <p className="flex items-center gap-2.5 text-eyebrow text-muted">
                    <span className="text-indigo">5.{i + 1}</span>
                    {title}
                  </p>
                  <h3 className="mt-4 text-title">{line}</h3>
                  <p className="mt-2 max-w-[40ch] text-[15px] leading-[1.6] text-pretty text-muted">
                    {body}
                  </p>
                </Reveal>
                <Reveal delay={0.1} className="relative lg:col-span-7">
                  {/* A pool of light under the drawing. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgb(138_151_240/0.08),transparent)]"
                  />
                  <Instrument />
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
