"use client";

import { motion } from "motion/react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const WAVE =
  "M 40 65 C 55 30, 75 30, 85 55 C 95 80, 110 80, 120 55 C 130 30, 145 25, 155 50 C 162 65, 168 60, 172 52";

/**
 * Zign's signature wave, the brand's own glyph. With `draw` it signs itself
 * once on arrival: the stroke, then the three trailing dots of the pen
 * lifting off the page.
 */
export function SignatureMark({
  size = 24,
  draw = false,
  delay = 0,
  duration = 1.1,
  strokeWidth = 7,
  className,
}: {
  size?: number;
  draw?: boolean;
  delay?: number;
  /** How long the stroke takes, in seconds. */
  duration?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const dots = [
    { cx: 178, cy: 47, r: 3.2 },
    { cx: 186, cy: 43, r: 2.4 },
    { cx: 192, cy: 41, r: 1.7 },
  ];
  return (
    <svg
      viewBox="34 18 165 66"
      width={size}
      height={(size * 66) / 165}
      fill="none"
      aria-hidden
      className={cn("shrink-0 overflow-visible", className)}
    >
      <motion.path
        d={WAVE}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={draw ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration, delay, ease: [0.45, 0, 0.25, 1] }}
      />
      {dots.map((d, i) => (
        <motion.circle
          key={d.cx}
          {...d}
          fill="currentColor"
          initial={draw ? { opacity: 0, scale: 0.4 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: delay + duration - 0.05 + i * 0.08,
            ease: EASE,
          }}
        />
      ))}
    </svg>
  );
}

export function Wordmark({
  className,
  draw = false,
  tone = "ink",
}: {
  className?: string;
  draw?: boolean;
  tone?: "ink" | "paper";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <SignatureMark
        size={26}
        draw={draw}
        className={tone === "ink" ? "text-indigo" : "text-indigo-lift"}
      />
      <span
        className={cn(
          "font-serif text-[19px] leading-none font-semibold tracking-[-0.01em]",
          tone === "ink" ? "text-ink" : "text-night-text",
        )}
      >
        Zign
      </span>
    </span>
  );
}
