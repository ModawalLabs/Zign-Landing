"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Aurora } from "@/components/fx/aurora";
import { Magnetic } from "@/components/fx/magnetic";
import { ButtonLink } from "@/components/ui/button";
import { ChevronLink } from "@/components/ui/chevron-link";
import { Container } from "@/components/ui/container";
import { SignatureMark } from "@/components/ui/signature-mark";
import { site } from "@/config/site";
import { useMedia, usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

import { AT, clockAt, Desk, FINAL_TIME } from "./desk";

/** An entrance delay, in seconds. */
const at = (s: number) => ({ animationDelay: `${s}s` });

/* The pools of light drifting over the sky: colour, place, size, and the
   orbit each one takes, how long it takes and where in it it starts (so no
   two move together). Deep, not bright: the page's own indigo and violet,
   with one warmer pool low down. */
const POOLS = [
  {
    color: "#1a1e8f",
    at: "left-[-18%] top-[-30%]",
    size: "size-[80vw]",
    path: "sky-a",
    time: "46s",
    delay: "-9s",
  },
  {
    color: "#6a44e8",
    at: "left-[30%] top-[-20%]",
    size: "size-[62vw]",
    path: "sky-b",
    time: "38s",
    delay: "-24s",
  },
  {
    color: "#8f3f9c",
    at: "right-[-22%] top-[10%]",
    size: "size-[70vw]",
    path: "sky-c",
    time: "52s",
    delay: "-31s",
  },
  {
    color: "#c75a86",
    at: "left-[-6%] bottom-[-40%]",
    size: "size-[48vw]",
    path: "sky-d",
    time: "42s",
    delay: "-14s",
  },
  {
    color: "#3a35cc",
    at: "right-[6%] bottom-[-50%]",
    size: "size-[58vw]",
    path: "sky-b",
    time: "58s",
    delay: "-40s",
  },
];

/* Folds of light laid across the sky, the way light lies on silk: each a
   soft crease, a shadow over a highlight, drifting and tilting a degree
   or two. Where it sits, which drift, how long, where it starts, and how
   strong its highlight and its shadow are. */
const FOLDS = [
  {
    at: "top-[-6%] h-[56%]",
    path: "fold-a",
    time: "44s",
    delay: "-7s",
    light: 0.1,
    shade: 0.2,
  },
  {
    at: "top-[28%] h-[60%]",
    path: "fold-b",
    time: "55s",
    delay: "-26s",
    light: 0.08,
    shade: 0.24,
  },
  {
    at: "top-[58%] h-[54%]",
    path: "fold-c",
    time: "38s",
    delay: "-18s",
    light: 0.07,
    shade: 0.18,
  },
];

/* The three steps, in the order the way reaches them. */
const STEPS = [
  {
    title: "Open the link.",
    body: "It opens in your browser, on any device. Nothing to install.",
  },
  {
    title: "Ask Zign AI.",
    body: "It explains what you’re agreeing to in plain words.",
  },
  {
    title: "Zign it.",
    body: "One click to sign, and it’s done.",
  },
] as const;

/** How far the reader scrolls through the pinned opening, in viewports. */
const TRACK_VH = 420;

/** The seconds a timed run takes, and how long it rests when done. */
const RUN_S = 11;
const REST_S = 2.6;

/**
 * The home page's opening and its proof, as one scene. The brand's verb
 * over a deep field of its colour, the app's window rising beneath it;
 * then, as the reader scrolls, the words lift away, the window takes the
 * screen and Hannah's mutual NDA goes from a link to zigned, with the
 * steps and the clock in a strip above it. Wide screens pin the scene and
 * scrub it by the scroll; narrow ones stack it and run the window on a
 * clock of its own.
 */
export function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const wide = useMedia("(min-width: 64rem)");
  const seen = useInView(deskRef, { amount: 0.4 });
  const [paused, setPaused] = useState(false);

  const { scrollYProgress: p } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  /* Three sources for the way from link to zigned: the scroll on wide
     screens, a clock on narrow ones, and "finished" under reduced motion. */
  const scrolled = useTransform(p, [0.36, 0.96], [0, 1]);
  const timed = useMotionValue(0);
  const finished = useMotionValue(1);
  useEffect(() => {
    if (reduce || wide || !seen) return;
    const run = animate(timed, [0, 1], {
      duration: RUN_S,
      ease: "linear",
      repeat: Infinity,
      repeatDelay: REST_S,
    });
    return () => run.stop();
  }, [wide, seen, reduce, timed]);
  const mode = reduce ? "finished" : wide ? "scrolled" : "timed";
  const progress = reduce ? finished : wide ? scrolled : timed;

  /* The wide-screen choreography. Until the screen is known to be wide
     (never on the server), CSS holds the same opening pose, so nothing
     jumps when the script arrives. */
  const live = wide && !reduce;
  const skyOpacity = useTransform(p, [0.08, 0.3], [1, 0]);
  const wordsY = useTransform(p, [0, 0.22], [0, -140]);
  const wordsOpacity = useTransform(p, [0.02, 0.18], [1, 0]);
  const deskY = useTransform(p, [0, 0.3], ["38vh", "0vh"]);
  const deskScale = useTransform(p, [0, 0.3], [0.92, 0.8]);
  const stripOpacity = useTransform(p, [0.28, 0.38], [0, 1]);
  const stripY = useTransform(p, [0.28, 0.38], [16, 0]);
  const [skyShown, setSkyShown] = useState(true);
  /* Once the words have faded they are gone, not just invisible: their
     keys can no longer be clicked or tabbed to mid-story. */
  const [wordsGone, setWordsGone] = useState(false);
  useMotionValueEvent(p, "change", (v) => {
    setSkyShown(v < 0.3);
    setWordsGone(v >= 0.18);
  });
  const still = reduce || paused || !skyShown;

  /* A soft light follows the pointer across the sky. */
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.35);
  const lx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.8 });
  const ly = useSpring(py, { stiffness: 60, damping: 20, mass: 0.8 });
  const lightX = useTransform(lx, (v) => `${v * 100}%`);
  const lightY = useTransform(ly, (v) => `${v * 100}%`);
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  return (
    <div
      ref={trackRef}
      className="relative"
      style={wide ? { height: `${TRACK_VH}vh` } : undefined}
    >
      <section
        id="top"
        aria-labelledby="hero-title"
        className="relative isolate overflow-hidden lg:sticky lg:top-0 lg:h-screen"
        onPointerMove={reduce ? undefined : onMove}
      >
        {/* The ground: the page's own weather, faint, under the sky. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
          <Aurora strength={0.5} />
        </div>

        {/* The sky: full on the first screen, gone by the time the story
            begins. On narrow screens it is the first screen only. */}
        <motion.div
          aria-hidden
          className="sky absolute inset-x-0 top-0 -z-10 h-[100svh] overflow-hidden lg:h-full"
          data-still={still || undefined}
          style={live ? { opacity: skyOpacity } : undefined}
        >
          {POOLS.map((pool) => (
            <i
              key={pool.path + pool.time}
              className={`${pool.at} ${pool.size}`}
              style={
                {
                  background: `radial-gradient(closest-side, ${pool.color}, transparent)`,
                  "--sky-path": pool.path,
                  "--sky-time": pool.time,
                  "--sky-delay": pool.delay,
                } as React.CSSProperties
              }
            />
          ))}
          {FOLDS.map((fold) => (
            <b
              key={fold.path}
              className={fold.at}
              style={
                {
                  "--fold-path": fold.path,
                  "--fold-time": fold.time,
                  "--fold-delay": fold.delay,
                  "--fold-light": fold.light,
                  "--fold-shade": fold.shade,
                } as React.CSSProperties
              }
            />
          ))}
          {!reduce && (
            <motion.span
              className="absolute size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.14),transparent)]"
              style={{ left: lightX, top: lightY }}
            />
          )}
          <span className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-paper lg:hidden" />
        </motion.div>

        <Container className="relative lg:h-full">
          {/* The words. */}
          <motion.div
            className="pt-36 text-center text-white md:pt-40 lg:absolute lg:inset-x-10 lg:top-[13vh] lg:pt-0"
            style={live ? { y: wordsY, opacity: wordsOpacity } : undefined}
            inert={live && wordsGone}
          >
            {/* The mark alone, signing itself above the words. */}
            <p className="hero-fade flex justify-center" style={at(0.05)}>
              <SignatureMark
                size={72}
                strokeWidth={8}
                draw
                delay={0.1}
                className="text-white"
              />
              <span className="sr-only">Zign</span>
            </p>
            <h1
              id="hero-title"
              className="mt-3 text-headline text-[clamp(3.4rem,8.6vw,7.75rem)] leading-[1] tracking-[-0.035em]"
            >
              <span className="hero-line">
                <span className="hero-rise" style={at(0.12)}>
                  Don&rsquo;t sign it.
                </span>
              </span>
              <span className="hero-line">
                <span className="hero-rise" style={at(0.22)}>
                  Zign it.
                </span>
              </span>
            </h1>
            <p
              className="hero-fade mx-auto mt-8 max-w-[36ch] text-[clamp(1.125rem,1.7vw,1.5rem)] leading-[1.25] font-semibold tracking-[-0.01em] text-pretty text-white/85"
              style={at(0.4)}
            >
              The easiest way to sign anything, with anyone, in under a minute.
              Your marriage certificate, your next deal, the contract for the
              build.
            </p>
            <div
              className="hero-fade mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4"
              style={at(0.5)}
            >
              <Magnetic>
                <ButtonLink href={site.links.start} size="lg">
                  Start free
                </ButtonLink>
              </Magnetic>
              <ChevronLink href="/product" tone="white">
                Explore the product
              </ChevronLink>
            </div>
          </motion.div>

          {/* The stage: the strip (title, clock, steps) and the window. On
              wide screens the strip sits above the window in the pinned
              viewport; on narrow ones everything stacks. On wide screens
              it lies over the words, and nothing in it is clickable, so
              clicks pass straight through it to the keys beneath. */}
          <div
            key={mode}
            className="pointer-events-none relative mt-16 grid gap-y-10 pb-28 lg:absolute lg:inset-x-10 lg:top-[7vh] lg:mt-0 lg:gap-y-7 lg:pb-0"
          >
            <motion.div
              className={cn(
                "order-1 text-center lg:grid lg:grid-cols-12 lg:items-end lg:text-left",
                !live && "lg:opacity-0",
              )}
              style={live ? { opacity: stripOpacity, y: stripY } : undefined}
            >
              <div className="lg:col-span-8">
                <h2 className="text-headline text-[clamp(2.25rem,3.4vw,3rem)] tracking-[-0.035em]">
                  Signed in <span className="text-zign">under a minute.</span>
                </h2>
                <p className="mt-3 max-w-[36ch] text-[clamp(1.0625rem,1.3vw,1.1875rem)] leading-[1.35] font-semibold tracking-[-0.01em] text-pretty text-muted max-lg:mx-auto">
                  Hannah&rsquo;s mutual NDA, from opening the link to zigned.
                </p>
              </div>
              <div className="mt-6 lg:col-span-4 lg:mt-0 lg:text-right">
                <Clock progress={progress} />
              </div>
            </motion.div>

            <motion.div
              className={cn("order-3 lg:order-2", !live && "lg:opacity-0")}
              style={live ? { opacity: stripOpacity, y: stripY } : undefined}
            >
              <Steps progress={progress} />
            </motion.div>

            <div
              ref={deskRef}
              data-desk
              className={cn(
                "order-2 lg:order-3",
                !live && "lg:translate-y-[38vh] lg:scale-[0.92]",
              )}
            >
              <motion.div
                className="origin-top"
                style={live ? { y: deskY, scale: deskScale } : undefined}
              >
                <Desk progress={progress} />
              </motion.div>
            </div>
          </div>
        </Container>

        {/* The sky moves on its own, so it can be stopped (WCAG 2.2.2). */}
        {!reduce && (skyShown || !live) && (
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
            aria-label={paused ? "Play the background" : "Pause the background"}
            className="absolute top-[calc(100svh-4.5rem)] right-5 z-10 grid size-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25 sm:right-8 lg:top-auto lg:bottom-8"
          >
            <svg viewBox="0 0 12 12" width="11" height="11" fill="currentColor">
              {paused ? (
                <path d="M3.2 1.8v8.4L10 6 3.2 1.8Z" />
              ) : (
                <>
                  <rect x="2.6" y="2" width="2.4" height="8" rx="0.6" />
                  <rect x="7" y="2" width="2.4" height="8" rx="0.6" />
                </>
              )}
            </svg>
          </button>
        )}
      </section>
    </div>
  );
}

/** The step the way is on. */
function useStep(progress: MotionValue<number>) {
  const at = (v: number) => (v >= AT.press2 ? 2 : v >= AT.ask ? 1 : 0);
  const [step, setStep] = useState(() => at(progress.get()));
  useMotionValueEvent(progress, "change", (v) => {
    const s = at(v);
    setStep((prev) => (prev === s ? prev : s));
  });
  return step;
}

/** The three steps: a column on narrow screens, a row above the window
    on wide ones. */
function Steps({ progress }: { progress: MotionValue<number> }) {
  const step = useStep(progress);
  return (
    <ol className="grid gap-6 lg:grid-cols-3 lg:gap-x-8">
      {STEPS.map((s, i) => {
        const on = i === step;
        const past = i < step;
        return (
          <li
            key={s.title}
            aria-current={on ? "step" : undefined}
            className="flex gap-4"
          >
            <span
              className={cn(
                "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full font-mono text-[12px] transition-colors duration-500",
                on
                  ? "bg-indigo text-night"
                  : past
                    ? "bg-signed-ink text-white"
                    : "bg-white/[0.08] text-muted",
              )}
              data-tabular
            >
              {past ? (
                <svg viewBox="0 0 12 12" width="11" height="11" fill="none">
                  <path
                    d="m2.5 6.2 2.3 2.3 4.7-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <div>
              {/* A step still to come is set quieter, never fainter. */}
              <h3
                className={cn(
                  "text-[18px] font-semibold tracking-[-0.02em] transition-colors duration-500",
                  on || past ? "text-ink" : "text-muted",
                )}
              >
                {s.title}
              </h3>
              <p
                className={cn(
                  "mt-1 max-w-[30ch] text-[14.5px] leading-[1.5] text-pretty transition-colors duration-500",
                  on || past ? "text-muted" : "text-subtle",
                )}
              >
                {s.body}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** The clock, reading the way. */
function Clock({ progress }: { progress: MotionValue<number> }) {
  const [time, setTime] = useState(() => clockAt(progress.get()));
  useMotionValueEvent(progress, "change", (v) => {
    const t = clockAt(v);
    setTime((prev) => (prev === t ? prev : t));
  });
  const done = time === FINAL_TIME;
  return (
    <p
      className={cn(
        "inline-block text-headline text-[clamp(3.5rem,5.6vw,5rem)] leading-[0.95] tracking-[-0.045em] transition-colors duration-500",
        done ? "text-indigo-lift" : "text-ink",
      )}
      data-tabular
    >
      {time}
    </p>
  );
}
