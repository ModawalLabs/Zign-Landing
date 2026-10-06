"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Fragment, useRef } from "react";

import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

const VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

/**
 * A headline that rises line by line from behind its own baseline. Lines
 * are given, not measured, so the break falls where the writer put it; a
 * line that wraps on a narrow screen simply rises as one taller block.
 */
export function RevealLines({
  as: Tag = "h2",
  id,
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.085,
  immediate = false,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Play on mount rather than on entering the viewport (the hero). */
  immediate?: boolean;
}) {
  const reduce = usePrefersReducedMotion();
  const MotionTag = motion[Tag];
  /* The heading is what's observed, not the lines: a line starts below its
     own clip-path, and IntersectionObserver honours an ancestor's clip, so
     a line watching itself would never be seen. */
  return (
    <MotionTag
      id={id}
      className={className}
      initial={reduce ? false : "hidden"}
      {...(immediate
        ? { animate: "shown" }
        : { whileInView: "shown", viewport: VIEW })}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          className={cn(
            "block [clip-path:inset(-0.3em_-0.6em_-0.24em_-0.6em)]",
            lineClassName,
          )}
        >
          <motion.span
            className="block will-change-transform"
            variants={{
              hidden: { y: "135%", rotate: 1.2 },
              shown: {
                y: "0%",
                rotate: 0,
                transition: {
                  duration: 1.15,
                  ease: EASE,
                  delay: delay + i * stagger,
                },
              },
            }}
            style={{ transformOrigin: "0% 100%" }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** A block that settles into place: a short rise out of a soft focus. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  blur = true,
  immediate = false,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  immediate?: boolean;
  as?: "div" | "p" | "li" | "span";
}) {
  const reduce = usePrefersReducedMotion();
  const MotionTag = motion[as];
  const to = { opacity: 1, y: 0, filter: "blur(0px)" };
  return (
    <MotionTag
      className={className}
      initial={
        reduce
          ? false
          : { opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" }
      }
      {...(immediate ? { animate: to } : { whileInView: to, viewport: VIEW })}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/** A hairline that draws itself across the page as it comes into view. */
export function RevealRule({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "night";
}) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={cn(
        "h-px w-full origin-left",
        tone === "night" ? "bg-night-line" : "bg-line",
        className,
      )}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEW}
      transition={{ duration: 1.4, ease: EASE }}
    />
  );
}

/**
 * A paragraph that is read into being: each word comes up from a faint
 * grey as the reader scrolls past it, so the sentence keeps pace with the
 * eye rather than arriving all at once.
 */
export function ScrollWords({
  text,
  className,
  emphasis = [],
}: {
  text: string;
  className?: string;
  /** Words (exact tokens) to set in the italic serif. */
  emphasis?: string[];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "end 0.45"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <Word
            progress={scrollYProgress}
            range={[i / words.length, (i + 1.6) / words.length]}
            italic={emphasis.includes(word)}
          >
            {word}
          </Word>{" "}
        </Fragment>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  italic,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  italic: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={italic ? "font-serif italic" : undefined}
    >
      {children}
    </motion.span>
  );
}
