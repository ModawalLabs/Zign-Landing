"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";

import { Clause } from "@/components/ui/clause";
import { Container } from "@/components/ui/container";
import { Reveal, RevealRule } from "@/components/ui/reveal";
import { site } from "@/config/site";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    q: "Is a signature made with Zign legally binding?",
    a: "Electronic signatures are recognised for most agreements in the UK, the EU and the US, under laws such as the Electronic Communications Act 2000, eIDAS and the ESIGN Act. Zign records each signer's consent, any identity check and every event on the document, so a signature can be evidenced. Some documents, such as certain deeds, still need ink; if you are unsure, ask your lawyer.",
  },
  {
    q: "Do the people I send to need an account?",
    a: "No. Signers and reviewers open a link that carries exactly the access you gave them: sign, view, comment or edit. Signers can ask Zign AI about the document as they read it, and nothing needs installing.",
  },
  {
    q: "What does a credit pay for?",
    a: "One credit signs one document. Credits bought as a package never expire, and both paid options include every Zign AI feature. Your usage page shows where each credit went.",
  },
  {
    q: "Can I bring documents I already have?",
    a: "Yes. Upload a PDF, a Word document or a scan, and Zign reads it the same way it reads a draft it wrote. Anything you send often can be saved as a template.",
  },
  {
    q: "What does Zign AI remember?",
    a: "Only what is useful to your work, such as who a company's contracts contact is or who countersigns. Everything it remembers is listed in settings, where you can pin a fact or have it forgotten.",
  },
  {
    q: "How can I check a document has not been changed?",
    a: "Open Verify and drop in the signed PDF, its certificate, or both. Zign recomputes the SHA-256 hash and the HMAC seal and tells you whether the copy is exactly the one that was signed.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative scroll-mt-16 py-16 lg:py-20"
    >
      <Container>
        <RevealRule />
        <div className="grid gap-14 pt-5 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <Reveal blur={false} y={6}>
                <Clause n="8">Questions</Clause>
              </Reveal>
              <Reveal delay={0.08}>
                <h2
                  id="faq-title"
                  className="mt-8 text-display text-[clamp(2rem,3.5vw,2.95rem)] leading-[1.06] tracking-[-0.026em] md:mt-10"
                >
                  Questions, answered.
                </h2>
              </Reveal>
              {site.links.contact && (
                <Reveal delay={0.2}>
                  <p className="mt-8 text-[15px] text-muted">
                    Something else?{" "}
                    <a
                      href={site.links.contact}
                      className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
                    >
                      Write to us
                    </a>
                    .
                  </p>
                </Reveal>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 lg:pt-8">
            <ul className="border-t border-line">
              {QUESTIONS.map((item, i) => {
                const isOpen = open === i;
                const buttonId = `${base}-q-${i}`;
                const panelId = `${base}-a-${i}`;
                return (
                  <Reveal
                    as="li"
                    key={item.q}
                    delay={i * 0.04}
                    className="border-b border-line"
                  >
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                      >
                        <span
                          className={cn(
                            "text-display text-[1.3rem] leading-snug tracking-[-0.012em] transition-colors duration-300 sm:text-[1.45rem]",
                            isOpen
                              ? "text-ink"
                              : "text-ink-soft group-hover:text-ink",
                          )}
                        >
                          {item.q}
                        </span>
                        <span
                          aria-hidden
                          className={cn(
                            "relative mt-1.5 grid size-7 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                            isOpen
                              ? "border-ink bg-ink text-paper"
                              : "border-line text-ink group-hover:border-ink/40",
                          )}
                        >
                          <span className="absolute h-px w-2.5 bg-current" />
                          <motion.span
                            className="absolute h-2.5 w-px bg-current"
                            animate={{ scaleY: isOpen ? 0 : 1 }}
                            transition={{ duration: 0.35, ease: EASE }}
                          />
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[62ch] pr-12 pb-7 text-[16px] leading-[1.7] text-pretty text-muted">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
