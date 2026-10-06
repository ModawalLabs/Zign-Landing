"use client";

import { motion } from "motion/react";

import { Scramble } from "@/components/ui/scramble";
import { SignatureMark } from "@/components/ui/signature-mark";
import { Tick } from "@/components/ui/tick";
import { useBeats } from "@/lib/use-beats";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

/** Chapter 4: consent, identity, the signature, then the seal. */
export function SignScene({ play }: { play: boolean }) {
  const reduce = usePrefersReducedMotion();
  const beat = useBeats(play, [500, 1100, 2000, 2500, 4100], reduce);
  // 1 consent · 2 verifying · 3 verified · 4 signing · 5 sealed

  const steps = [
    {
      title: "Consent",
      note: "Agreed to sign electronically",
      state: beat >= 1 ? "done" : "wait",
    },
    {
      title: "Identity",
      note:
        beat >= 3
          ? "Verified before signing"
          : beat >= 2
            ? "Checking"
            : "Required by sender",
      state: beat >= 3 ? "done" : beat >= 2 ? "busy" : "wait",
    },
    {
      title: "Signature",
      note: beat >= 5 ? "Signed" : "Draw, type or upload",
      state: beat >= 5 ? "done" : beat >= 4 ? "busy" : "wait",
    },
  ] as const;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-panel">
      <div className="flex items-center gap-3 border-b border-line-soft px-4 py-3 sm:px-5">
        <span className="grid size-7 place-items-center rounded-lg bg-indigo/10">
          <SignatureMark size={16} strokeWidth={9} className="text-indigo" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-serif text-[14px] font-semibold text-ink">
            Mutual NDA
          </span>
          <span className="block truncate text-[11px] text-muted">
            from Fernhill Studio
          </span>
        </span>
        <span className="ml-auto text-right text-[11px] leading-tight text-muted">
          Signing as
          <span className="block text-[12px] font-medium text-ink">
            Hannah Brooks
          </span>
        </span>
      </div>

      <ol className="relative space-y-5 px-4 pt-5 sm:px-6">
        <span
          aria-hidden
          className="absolute top-8 bottom-3 left-[27px] w-px bg-line-soft sm:left-[35px]"
        />
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex items-start gap-3.5">
            <StepDot state={s.state} n={i + 1} />
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[13px] font-medium text-ink">{s.title}</p>
              <motion.p
                key={s.note}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "text-[12px]",
                  s.state === "done" ? "text-signed" : "text-muted",
                )}
              >
                {s.note}
              </motion.p>
              {s.title === "Signature" && (
                <div className="relative mt-3 h-[76px] rounded-xl border border-dashed border-indigo/40 bg-indigo/[0.03]">
                  <span className="absolute inset-x-5 bottom-4 h-px bg-line" />
                  <span className="absolute bottom-[18px] left-5 text-[11px] text-subtle">
                    &times;
                  </span>
                  {beat >= 4 && (
                    <motion.span
                      className="absolute bottom-3 left-9 font-script text-[44px] leading-none text-indigo"
                      initial={{ clipPath: "inset(0 100% 0 0)" }}
                      animate={{ clipPath: "inset(0 0% 0 0)" }}
                      transition={{ duration: 1.5, ease: [0.5, 0, 0.3, 1] }}
                    >
                      Hannah Brooks
                    </motion.span>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <motion.div
        initial={false}
        animate={beat >= 5 ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mx-4 mt-auto mb-4 rounded-xl border border-line-soft bg-band p-3.5 sm:mx-6 sm:mb-5"
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "grid size-5 place-items-center rounded-full transition-colors duration-500",
              beat >= 5 ? "bg-signed text-night" : "bg-desk text-subtle",
            )}
          >
            <Tick className="size-2.5" />
          </span>
          <span className="text-[12.5px] font-medium text-ink">
            Certificate of completion
          </span>
          <span className="ml-auto font-mono text-[10.5px] text-subtle">
            HMAC sealed
          </span>
        </div>
        <p
          className="mt-2 truncate font-mono text-[10.5px] text-muted"
          data-tabular
        >
          SHA-256{" "}
          <Scramble
            active={beat >= 5}
            text="9f2c41ab 7d03e5c8 0b6f22d1 e07d4a19"
            className="text-ink-soft"
          />
        </p>
      </motion.div>
    </div>
  );
}

function StepDot({ state, n }: { state: "wait" | "busy" | "done"; n: number }) {
  return (
    <span
      className={cn(
        "relative z-10 grid size-6 shrink-0 place-items-center rounded-full text-[10.5px] font-medium transition-colors duration-500",
        state === "done" && "bg-signed text-night",
        state === "busy" && "border border-indigo bg-card text-indigo",
        state === "wait" && "border border-line bg-card text-subtle",
      )}
      data-tabular
    >
      {state === "done" ? (
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <Tick className="size-3" />
        </motion.span>
      ) : state === "busy" ? (
        <span className="breathe size-1.5 rounded-full bg-indigo" />
      ) : (
        n
      )}
    </span>
  );
}
