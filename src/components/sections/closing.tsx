"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { Aurora } from "@/components/fx/aurora";
import { Magnetic } from "@/components/fx/magnetic";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { SignatureMark } from "@/components/ui/signature-mark";
import { site } from "@/config/site";
import { EASE } from "@/lib/motion";

export function Closing() {
  const lineRef = useRef<HTMLDivElement>(null);
  const signed = useInView(lineRef, { once: true, amount: 0.8 });

  return (
    <section
      aria-labelledby="closing-title"
      className="relative isolate overflow-hidden py-24 lg:py-32"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <Aurora strength={1.15} />
        <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_55%,#000_10%,transparent_70%)]" />
        {/* The weather rises out of the page above and settles into the
            night of the footer below; neither edge shows. */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-paper to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-night" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo/30 to-transparent" />
      </div>

      <Container className="text-center">
        <RevealLines
          id="closing-title"
          lines={[
            "Your next agreement,",
            <em key="em" className="text-ink-sweep font-serif italic">
              already settled.
            </em>,
          ]}
          className="mx-auto text-display text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[0.98] tracking-[-0.034em]"
        />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-7 max-w-[46ch] text-lede text-pretty text-muted">
            Upload one you have, or ask for one you need. Zign has it out for
            signature within minutes.
          </p>
        </Reveal>
        <Reveal
          delay={0.3}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <Magnetic>
            <ButtonLink href={site.links.start} size="lg" arrow>
              Start free
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink href="#pricing" size="lg" variant="outline">
              See pricing
            </ButtonLink>
          </Magnetic>
        </Reveal>

        {/* A sign-here line the brand's own mark signs. */}
        <div ref={lineRef} aria-hidden className="mx-auto mt-14 max-w-[520px]">
          <div className="relative flex h-24 items-end">
            <motion.span
              className="absolute bottom-3 left-0 rounded-[4px] bg-indigo px-2 py-1 text-[10.5px] font-semibold tracking-[0.08em] text-night uppercase"
              initial={{ opacity: 0, x: -8 }}
              animate={signed ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
            >
              Sign here
            </motion.span>
            {signed && (
              <SignatureMark
                size={240}
                draw
                delay={0.5}
                strokeWidth={4.5}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 text-indigo"
              />
            )}
          </div>
          <motion.div
            className="h-px origin-left bg-ink/25"
            initial={{ scaleX: 0 }}
            animate={signed ? { scaleX: 1 } : {}}
            transition={{ duration: 1, ease: EASE }}
          />
          <div className="mt-2 flex justify-between font-mono text-[11px] text-subtle">
            <span>Signature</span>
            <span>Zign</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
