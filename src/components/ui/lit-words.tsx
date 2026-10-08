"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

/* A word not yet reached by the scroll, and a word that has been. The
   first is quieter, never fainter: it still reads at 4.5:1 on the page and
   on a tile. */
const UNLIT = "#7b7e8a";
const LIT = "#d4d6de";

/**
 * A sentence that lights up word by word as the reader scrolls past it,
 * the way Apple sets its copy: from a quieter grey to near white, from
 * the sentence entering the lower part of the screen to its last line
 * reaching the middle (or wherever `until` says, as a fraction of the
 * screen's height from the top). Under reduced motion it is simply lit.
 */
export function LitWords({
  text,
  until = 0.5,
  className,
}: {
  text: string;
  until?: number;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", `end ${until}`],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className={cn(className, reduce && "text-[#d4d6de]")}>
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          from={i / words.length}
          to={(i + 1) / words.length}
          still={reduce}
          last={i === words.length - 1}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  progress,
  from,
  to,
  still,
  last,
  children,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  still: boolean;
  last: boolean;
  children: string;
}) {
  const color = useTransform(progress, [from, to], [UNLIT, LIT]);
  return (
    <>
      <motion.span style={still ? undefined : { color }}>
        {children}
      </motion.span>
      {last ? null : " "}
    </>
  );
}
