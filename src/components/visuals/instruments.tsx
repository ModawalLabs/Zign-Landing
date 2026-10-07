"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/*
 * Small drawings in the product's instrument hand: hairline strokes, ink for
 * what is settled, indigo for what is yours or in motion, a status colour
 * only where it names a real state. Each draws itself once on arrival.
 */

function useDrawn<T extends Element>() {
  const ref = useRef<T>(null);
  const drawn = useInView(ref, { once: true, amount: 0.6 });
  return [ref, drawn] as const;
}

/* Packages: one notch per signer asked, filled as they sign. */
export function PackagesInstrument() {
  const [ref, drawn] = useDrawn<HTMLDivElement>();
  const rows = [
    { name: "Master services agreement", signed: 3, of: 3 },
    { name: "Data processing addendum", signed: 2, of: 3 },
    { name: "Security schedule", signed: 1, of: 3 },
  ];
  return (
    <div ref={ref} className="space-y-3.5">
      {rows.map((r, i) => (
        <div key={r.name} className="flex items-center gap-4">
          <span className="w-5 font-mono text-[11px] text-subtle" data-tabular>
            {i + 1}
          </span>
          <span className="flex-1 truncate text-[13px] text-ink-soft">
            {r.name}
          </span>
          <span className="flex gap-1">
            {Array.from({ length: r.of }).map((_, j) => (
              <motion.span
                key={j}
                className={cn(
                  "h-3.5 w-1.5 rounded-full",
                  j < r.signed ? "bg-indigo" : "border border-line",
                )}
                initial={{ opacity: 0, scaleY: 0.3 }}
                animate={drawn ? { opacity: 1, scaleY: 1 } : {}}
                transition={{
                  duration: 0.5,
                  ease: EASE,
                  delay: 0.2 + i * 0.15 + j * 0.08,
                }}
              />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Expiry: the next thirty days as a strip, today an indigo rule. */
export function HorizonInstrument() {
  const [ref, drawn] = useDrawn<HTMLDivElement>();
  const pins = [
    { lane: 0, at: 8, kind: "mine" },
    { lane: 0, at: 39, kind: "mine" },
    { lane: 1, at: 27, kind: "theirs" },
    { lane: 1, at: 41, kind: "theirs" },
    { lane: 2, at: 37, kind: "term" },
    { lane: 2, at: 74, kind: "term" },
    { lane: 2, at: 92, kind: "term" },
  ] as const;
  return (
    <div ref={ref} className="relative">
      <div className="relative h-[92px]">
        <motion.span
          className="absolute inset-y-0 left-[6%] w-[24%] bg-indigo/[0.06]"
          initial={{ opacity: 0 }}
          animate={drawn ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        {[0, 1, 2].map((lane) => (
          <motion.span
            key={lane}
            className="absolute right-0 left-0 h-px origin-left bg-line"
            style={{ top: 16 + lane * 30 }}
            initial={{ scaleX: 0 }}
            animate={drawn ? { scaleX: 1 } : {}}
            transition={{ duration: 1, ease: EASE, delay: lane * 0.08 }}
          />
        ))}
        <motion.span
          className="absolute inset-y-0 left-[6%] w-px origin-top bg-indigo"
          initial={{ scaleY: 0 }}
          animate={drawn ? { scaleY: 1 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        />
        {pins.map((p, i) => (
          <motion.span
            key={i}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2",
              p.kind === "mine" &&
                "size-2.5 rounded-full bg-indigo ring-4 ring-indigo/15",
              p.kind === "theirs" &&
                "size-2.5 rounded-full border-[1.5px] border-ink-soft bg-paper",
              p.kind === "term" && "size-2 rotate-45 bg-ink-soft",
            )}
            style={{ left: `${p.at}%`, top: 16 + p.lane * 30 }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={drawn ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, ease: EASE, delay: 0.6 + i * 0.07 }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10.5px] text-subtle">
        <span className="text-indigo">Today</span>
        <span>+10d</span>
        <span>+20d</span>
        <span>+30d</span>
      </div>
    </div>
  );
}

/* Delegation: a signer hands the pen to someone they trust. */
export function DelegateInstrument() {
  const [ref, drawn] = useDrawn<HTMLDivElement>();
  return (
    <div ref={ref} className="relative">
      <div className="flex items-center justify-between gap-3">
        <Avatar
          initials="HB"
          name="Hannah Brooks"
          note="Asked to sign"
          tone="indigo"
        />
        <svg
          viewBox="0 0 120 24"
          className="h-6 flex-1"
          fill="none"
          aria-hidden
        >
          <motion.path
            d="M2 12h110m-6-6 6 6-6 6"
            stroke="currentColor"
            className="text-indigo"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3 4"
            initial={{ pathLength: 0 }}
            animate={drawn ? { pathLength: 1 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          />
        </svg>
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={drawn ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 1 }}
        >
          <Avatar
            initials="JO"
            name="James Ortiz"
            note="Signs for her"
            tone="ink"
          />
        </motion.div>
      </div>
      <motion.p
        className="mt-5 border-t border-line pt-3 text-[12.5px] text-muted"
        initial={{ opacity: 0, y: 6 }}
        animate={drawn ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 1.3 }}
      >
        Delegation recorded on the document&rsquo;s trail.
      </motion.p>
    </div>
  );
}

function Avatar({
  initials,
  name,
  note,
  tone,
}: {
  initials: string;
  name: string;
  note: string;
  tone: "indigo" | "ink";
}) {
  return (
    <span className="flex flex-col items-center gap-1.5 text-center">
      <span
        className={cn(
          "grid size-10 place-items-center rounded-full text-[12px] font-semibold",
          tone === "indigo" ? "bg-indigo text-night" : "bg-ink text-paper",
        )}
      >
        {initials}
      </span>
      <span className="text-[12.5px] leading-tight font-medium text-ink">
        {name}
      </span>
      <span className="text-[11px] leading-tight text-muted">{note}</span>
    </span>
  );
}
