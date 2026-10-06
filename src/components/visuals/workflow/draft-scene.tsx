"use client";

import { AnimatePresence, motion } from "motion/react";

import { SignatureMark } from "@/components/ui/signature-mark";
import { useBeats, useTyped } from "@/lib/use-beats";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

const PROMPT =
  "Draft a consulting agreement with Arbor Studio: three months at £8,000 a month, IP assigned to us.";

const CLAUSES = [
  {
    title: "1. Services",
    body: "Arbor Studio will provide brand and product design services as set out in Schedule 1.",
  },
  {
    title: "2. Fees",
    body: "£8,000 per month, invoiced monthly in arrears and payable within 30 days.",
  },
  {
    title: "3. Term",
    body: "Three months from the Start Date, extendable by agreement in writing.",
  },
  {
    title: "4. Intellectual property",
    body: "All work product is assigned to Fernhill Studio Ltd on payment.",
  },
];

/** Chapter 1: a sentence typed into the composer becomes a first draft. */
export function DraftScene({ play }: { play: boolean }) {
  const reduce = usePrefersReducedMotion();
  const typed = useTyped(PROMPT, play, { cps: 46, reduce });
  const typedAll = typed.length === PROMPT.length;
  const beat = useBeats(
    play && typedAll,
    [250, 800, 1300, 1800, 2300, 2800],
    reduce,
  );

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {["Upload a document", "Show templates", "Create new document"].map(
          (chip, i) => (
            <span
              key={chip}
              className={cn(
                "rounded-full border px-3 py-1 text-[12px] transition-colors duration-500",
                i === 2 && play
                  ? "border-indigo/30 bg-indigo-wash text-indigo"
                  : "border-line bg-card text-muted",
              )}
            >
              {chip}
            </span>
          ),
        )}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-line bg-card p-3.5 pl-4 shadow-panel">
        <SignatureMark size={18} strokeWidth={9} className="mt-1 text-indigo" />
        <p className="min-h-[2.9em] flex-1 text-[13.5px] leading-[1.45] text-ink">
          {typed}
          {!typedAll && play && (
            <span className="caret ml-px inline-block h-[1.05em] w-px translate-y-[2px] bg-ink" />
          )}
          {!play && (
            <span className="text-subtle">What do you need drawn up?</span>
          )}
        </p>
        <motion.span
          animate={beat === 1 ? { scale: [1, 0.88, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-300",
            typedAll ? "bg-ink text-paper" : "bg-desk text-subtle",
          )}
        >
          <svg
            viewBox="0 0 16 16"
            width="13"
            height="13"
            fill="none"
            aria-hidden
          >
            <path
              d="M8 13V3m0 0L4 7m4-4 4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </div>

      {/* The sheet stays white: paper on a dark desk. */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-t-[4px] bg-sheet px-7 pt-7 text-paper-ink shadow-paper sm:px-10 sm:pt-9">
        <AnimatePresence mode="wait">
          {beat < 2 ? (
            <motion.div
              key="blank"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 pt-1"
            >
              <div className="type-line mx-auto h-3 w-1/2" />
              <div className="h-3" />
              {[92, 84, 88, 60, 0, 90, 76].map((w, i) =>
                w ? (
                  <div
                    key={i}
                    className="type-line h-2"
                    style={{ width: `${w}%` }}
                  />
                ) : (
                  <div key={i} className="h-2" />
                ),
              )}
              {beat >= 1 && (
                <p className="flex items-center gap-2 pt-3 text-[12px] text-indigo-ink">
                  <span className="breathe size-1.5 rounded-full bg-indigo-ink" />
                  Drafting
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="draft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-center font-serif text-[19px] font-semibold tracking-[-0.01em] text-paper-ink">
                Consulting Agreement
              </p>
              <p className="mt-1.5 text-center text-[11px] text-paper-muted">
                Fernhill Studio Ltd and Arbor Studio
              </p>
              <div className="mt-6 space-y-4">
                {CLAUSES.map((c, i) => (
                  <div
                    key={c.title}
                    className={beat >= 3 + i ? "" : "invisible"}
                  >
                    <p className="font-serif text-[12.5px] font-semibold text-paper-ink">
                      {c.title}
                    </p>
                    {beat >= 3 + i && (
                      <motion.p
                        className="mt-1 text-[11.5px] leading-[1.6] text-paper-soft"
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        animate={{ clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                      >
                        {c.body}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-sheet to-transparent" />
      </div>
    </div>
  );
}
