"use client";

import { AnimatePresence, motion } from "motion/react";

import { Tick } from "@/components/ui/tick";
import { useBeats } from "@/lib/use-beats";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

const PEOPLE = [
  {
    initials: "PN",
    name: "Priya Nair",
    role: "Viewer",
    tone: "bg-desk text-muted",
  },
  {
    initials: "AK",
    name: "Aisha Khan",
    role: "Commenter",
    tone: "bg-ink text-paper",
  },
  {
    initials: "YD",
    name: "Yusuf Demir",
    role: "Editor",
    tone: "bg-indigo/65 text-night",
  },
];

const VOTERS = ["Yusuf Demir", "Aisha Khan", "You"];

/** Chapter 3: a suggestion arrives, the parties vote, the owner applies it. */
export function NegotiateScene({ play }: { play: boolean }) {
  const reduce = usePrefersReducedMotion();
  const beat = useBeats(
    play,
    [400, 1200, 1900, 2600, 3300, 4100, 4600],
    reduce,
  );
  // 1 suggestion lands · 2–4 votes · 5 agreed · 6 apply pressed · 7 applied
  const votes = Math.max(0, Math.min(beat - 1, 3));
  const agreed = beat >= 5;
  const applied = beat >= 7;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[12px] text-muted">Shared for review</span>
        {PEOPLE.map((p) => (
          <span
            key={p.name}
            className="flex items-center gap-1.5 rounded-full border border-line bg-card py-0.5 pr-2.5 pl-0.5 text-[11.5px]"
          >
            <span
              className={cn(
                "grid size-5 place-items-center rounded-full text-[8px] font-semibold",
                p.tone,
              )}
            >
              {p.initials}
            </span>
            <span className="text-ink-soft">{p.name.split(" ")[0]}</span>
            <span className="text-subtle">{p.role}</span>
          </span>
        ))}
      </div>

      {/* The sheet stays white: paper on a dark desk. */}
      <div className="rounded-t-[4px] bg-sheet px-6 py-6 text-paper-ink shadow-paper sm:px-9">
        <p className="font-serif text-[12.5px] font-semibold text-paper-ink">
          4. Holiday
        </p>
        <p className="mt-1.5 text-[12.5px] leading-[1.75] text-paper-soft">
          4.1 The Employee is entitled to{" "}
          <motion.span
            initial={false}
            animate={
              applied
                ? { opacity: 0, maxWidth: 0, marginRight: 0 }
                : { opacity: 1, maxWidth: 160, marginRight: 4 }
            }
            transition={{ duration: 0.5, ease: EASE }}
            className={cn(
              "inline-block overflow-hidden align-bottom whitespace-nowrap transition-colors duration-500",
              beat >= 1 && "redline-del",
            )}
          >
            twenty-five (25)
          </motion.span>
          {beat >= 1 && (
            <motion.span
              initial={{ opacity: 0, filter: "blur(3px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: EASE }}
              className={cn(
                "rounded-[2px] px-[1px] transition-[color,background-color,box-shadow] duration-700",
                applied ? "text-paper-soft" : "redline-ins",
              )}
            >
              twenty-eight (28)
            </motion.span>
          )}{" "}
          days&rsquo; holiday per year, in addition to public holidays.
        </p>
      </div>

      <motion.div
        initial={false}
        animate={beat >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={cn(
          "rounded-2xl border bg-card p-4 shadow-panel transition-colors duration-700 sm:p-5",
          agreed ? "border-signed/35" : "border-line",
        )}
      >
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-full bg-indigo/65 text-[9.5px] font-semibold text-night">
            YD
          </span>
          <span className="leading-tight">
            <span className="block text-[12.5px] font-medium text-ink">
              Yusuf Demir
            </span>
            <span className="block text-[11px] text-muted">
              suggested a change
            </span>
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={applied ? "applied" : agreed ? "agreed" : "open"}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={cn(
                "ml-auto rounded-full border px-2 py-0.5 text-[10.5px] font-medium",
                agreed
                  ? "border-signed/30 bg-signed/[0.1] text-signed"
                  : "border-line text-muted",
              )}
              data-tabular
            >
              {applied
                ? "Applied"
                : agreed
                  ? "Agreed by all"
                  : `${votes} of 3 agree`}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {VOTERS.map((v, i) => (
            <span
              key={v}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-colors duration-500",
                votes > i
                  ? "border-signed/30 bg-signed/[0.1] text-signed"
                  : "border-dashed border-line text-subtle",
              )}
            >
              {votes > i && <Tick className="size-2.5" />}
              {v}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-line-soft pt-4">
          <span className="rounded-md border border-line px-2.5 py-1 text-[11.5px] text-ink-soft">
            Counter
          </span>
          <span className="rounded-md border border-line px-2.5 py-1 text-[11.5px] text-ink-soft">
            Object
          </span>
          <motion.span
            animate={beat === 6 ? { scale: [1, 0.95, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={cn(
              "ml-auto rounded-md px-3 py-1 text-[11.5px] font-medium transition-colors duration-500",
              agreed && !applied ? "bg-ink text-paper" : "bg-desk text-subtle",
            )}
          >
            {applied ? "Change applied" : "Apply agreed change"}
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}
