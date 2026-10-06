"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { Aurora } from "@/components/fx/aurora";
import { TiltCard } from "@/components/fx/tilt";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Scramble } from "@/components/ui/scramble";
import { SectionHead } from "@/components/ui/section-head";
import { SignatureMark } from "@/components/ui/signature-mark";
import { Tick } from "@/components/ui/tick";
import { EASE } from "@/lib/motion";

const GUARANTEES = [
  {
    title: "Consent before anything",
    body: "Every signer agrees to sign electronically before they see a page, and that agreement is recorded.",
  },
  {
    title: "Identity, when it matters",
    body: "Ask any signer to verify who they are; their signature is not accepted until they have.",
  },
  {
    title: "Sealed on completion",
    body: "The finished PDF is hashed with SHA‑256 and its certificate signed with HMAC‑SHA256.",
  },
  {
    title: "Checkable by anyone",
    body: "Verify recomputes the hash and the seal, so a changed copy cannot pass for the original.",
  },
  {
    title: "Links that lapse",
    body: "Signing links carry an expiry and stop working after it. Review links open with only the access you chose.",
  },
];

const TRAIL = [
  ["14:01", "Sent for signing by Maya Ellison"],
  ["14:01", "Hannah Brooks consented to sign electronically"],
  ["14:02", "Hannah Brooks verified her identity"],
  ["14:02", "Signed by Hannah Brooks"],
  ["14:06", "Signed by Maya Ellison"],
  ["14:06", "Sealed and certificate issued"],
];

export function Record() {
  return (
    <section
      id="record"
      aria-labelledby="record-title"
      className="relative isolate scroll-mt-16 py-16 lg:py-20"
    >
      {/* The light the certificate floats in. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[22%] bottom-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_80%,transparent)]"
      >
        <Aurora strength={0.3} />
      </div>
      <Container>
        <SectionHead
          id="record-title"
          n="6"
          label="Security and evidence"
          title="Every signature leaves a record."
          lede="An agreement is only as good as your ability to prove it. Every step of a signing is evidenced, sealed and checkable long after the fact."
        />

        <div className="mt-10 grid gap-12 md:mt-12 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-6">
            <Certificate />
          </div>
          <ol className="lg:col-span-5 lg:col-start-8">
            {GUARANTEES.map((g, i) => (
              <Reveal
                as="li"
                key={g.title}
                delay={i * 0.05}
                className="grid grid-cols-[40px_1fr] border-t border-line py-5 last:border-b"
              >
                <span
                  className="pt-1 font-mono text-[12px] text-indigo"
                  data-tabular
                >
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-title">{g.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-pretty text-muted">
                    {g.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/**
 * The certificate of completion: a white sheet floating over the dark,
 * leaning toward the pointer, with a holographic seal and a foil sheen.
 * It fills itself in as it comes into view.
 */
function Certificate() {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true, amount: 0.35 });
  const show = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: shown ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, ease: EASE, delay },
  });

  return (
    <div ref={ref} className="lg:sticky lg:top-24">
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={shown ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <div className="float-slower">
          <TiltCard max={7} className="rounded-[8px]">
            <div className="foil spotlight relative rounded-[8px] bg-sheet p-7 text-paper-ink shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_30px_60px_-20px_rgb(0_0_0/0.75),0_90px_140px_-40px_rgb(56_75_199/0.4)] sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-eyebrow text-paper-muted">
                    Certificate of completion
                  </p>
                  <p className="mt-3 text-display text-[1.6rem] leading-tight tracking-[-0.015em] sm:text-[1.85rem]">
                    Mutual Non-Disclosure Agreement
                  </p>
                </div>
                <span className="seal grid size-12 shrink-0 place-items-center rounded-full bg-sheet">
                  <SignatureMark
                    size={28}
                    draw={shown}
                    className="text-indigo-ink"
                  />
                </span>
              </div>

              <dl className="mt-7 grid grid-cols-2 gap-4 border-y border-paper-line py-5 text-[13px] sm:grid-cols-3">
                <div>
                  <dt className="text-paper-muted">Certificate</dt>
                  <dd className="mt-1 font-mono text-[12px]" data-tabular>
                    ZGN-7Q4M-2KX9
                  </dd>
                </div>
                <div>
                  <dt className="text-paper-muted">Signers</dt>
                  <dd className="mt-1">2 of 2</dd>
                </div>
                <div>
                  <dt className="text-paper-muted">Status</dt>
                  <dd className="mt-1 flex items-center gap-1.5 font-medium text-signed-ink">
                    <Tick className="size-3" /> Completed
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <p className="text-eyebrow text-paper-muted">Trail</p>
                <ol className="relative mt-4 space-y-3 pl-5">
                  <motion.span
                    aria-hidden
                    className="absolute top-1.5 bottom-1.5 left-[3px] w-px origin-top bg-paper-line"
                    initial={{ scaleY: 0 }}
                    animate={shown ? { scaleY: 1 } : {}}
                    transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
                  />
                  {TRAIL.map(([time, text], i) => (
                    <motion.li
                      key={text}
                      {...show(0.5 + i * 0.16)}
                      className="relative flex items-baseline gap-4 text-[13.5px]"
                    >
                      <span
                        className={
                          i === TRAIL.length - 1
                            ? "absolute top-[5px] -left-5 size-[7px] rounded-full bg-indigo-ink"
                            : "absolute top-[5px] -left-5 size-[7px] rounded-full border border-paper-soft/50 bg-sheet"
                        }
                      />
                      <span
                        className="w-11 shrink-0 font-mono text-[11.5px] text-paper-subtle"
                        data-tabular
                      >
                        {time}
                      </span>
                      <span className="text-paper-soft">{text}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>

              <motion.div
                {...show(1.6)}
                className="mt-7 space-y-2 rounded-lg bg-sheet-band px-4 py-3.5 font-mono text-[11.5px]"
                data-tabular
              >
                <p className="flex gap-3">
                  <span className="w-[74px] shrink-0 text-paper-subtle">
                    SHA-256
                  </span>
                  <span className="min-w-0 truncate text-paper-soft">
                    <Scramble
                      active={shown}
                      text="9f2c41ab 7d03e5c8 0b6f22d1 e07d4a19"
                    />
                  </span>
                </p>
                <p className="flex gap-3">
                  <span className="w-[74px] shrink-0 text-paper-subtle">
                    Seal
                  </span>
                  <span className="flex items-center gap-1.5 text-signed-ink">
                    HMAC-SHA256 <Tick className="size-3" />
                  </span>
                </p>
              </motion.div>
            </div>
          </TiltCard>
        </div>
      </motion.div>
    </div>
  );
}
