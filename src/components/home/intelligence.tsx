"use client";

import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Orb, type OrbMood } from "@/components/home/orb";
import { AutoplayToggle } from "@/components/ui/autoplay-toggle";
import { Container } from "@/components/ui/container";
import { LitWords } from "@/components/ui/lit-words";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

/* What Zign AI is asked, in turn, about the mutual NDA the hero signs:
   what it says while it works, what it answers, and what it found. */
const PROMPTS = [
  {
    ask: "Prepare this NDA for signing",
    working: "Finding the signers",
    answer:
      "I found 2 signers and placed 6 fields. Maya signs first, then Hannah.",
    tags: ["2 signers", "6 fields", "Signing order set"],
  },
  {
    ask: "What am I agreeing to?",
    working: "Reading the clauses",
    answer:
      "To keep Fernhill’s information confidential for three years, and use it only for the partnership.",
    tags: ["Three years", "No exclusivity", "No fees"],
  },
  {
    ask: "What’s still blank?",
    working: "Checking every field",
    answer:
      "Three things are still empty. I can ask Hannah for hers when it goes out.",
    tags: ["Effective Date", "Registered address", "Job title"],
  },
] as const;

/* What it says before it is asked anything. */
const GREETING = "Hi, I’m Zign AI, your agreement copilot.";

/* A question of the reader's own. Zign AI answers from their agreements,
   so the honest answer here is how to start. */
const YOURS = {
  working: "Reading your question",
  answer:
    "I answer from your own agreements. Start free, add one, and ask me anything about it.",
} as const;

const POINTS = [
  {
    icon: <ReadIcon />,
    title: "Understands the content.",
    body: "Zign reads the agreement and finds who signs, where, and in what order.",
  },
  {
    icon: <FlowIcon />,
    title: "Prepares the workflow.",
    body: "Signers, fields and the signing order, set up for you and checked before it goes.",
  },
  {
    icon: <ControlIcon />,
    title: "You stay in control.",
    body: "AI-assisted signer and field detection, with every suggestion yours to keep, move or remove.",
  },
];

/**
 * Zign AI, the agreement copilot. Its presence is an orb of the hero's
 * colours that listens while a question is typed, turns faster while it
 * reads, and speaks the answer; the questions take turns on their own,
 * and the reader can pick one or type their own. Then the three things
 * it does, set out beneath.
 */
export function Intelligence() {
  return (
    <section
      id="zign-ai"
      aria-labelledby="zign-ai-title"
      className="relative pb-32 lg:pb-40"
    >
      <Container>
        {/* The words and the copilot side by side on a wide screen, the
            words first and the copilot beneath them on a narrow one. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-12 xl:gap-16">
          <div className="text-center lg:text-left">
            <Reveal y={14} blur={false}>
              <p className="text-[clamp(1.125rem,1.6vw,1.5rem)] font-semibold tracking-[-0.01em] text-indigo-lift">
                Zign AI
              </p>
            </Reveal>
            <RevealLines
              id="zign-ai-title"
              lines={["Sign with a Zing."]}
              delay={0.08}
              className="mt-2 text-headline text-[clamp(2.5rem,5.2vw,4.25rem)] tracking-[-0.035em] lg:text-[clamp(2.5rem,3.9vw,3.5rem)]"
            />
            <LitWords
              text="Your go-to agreement copilot, in one intelligent signing workflow. Zign understands the content, prepares the signing workflow, and helps you get it signed faster."
              until={0.68}
              className="mx-auto mt-5 max-w-[42ch] text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.35] font-semibold tracking-[-0.01em] text-pretty lg:mx-0 lg:max-w-[30ch]"
            />
          </div>

          <Stage />
        </div>

        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8 lg:mt-20">
          {POINTS.map((point, i) => (
            <Reveal
              as="li"
              key={point.title}
              delay={i * 0.08}
              y={20}
              blur={false}
            >
              <div className="border-t border-white/[0.1] pt-6">
                <span className="block text-ink-soft">{point.icon}</span>
                <h3 className="mt-5 text-[21px] font-semibold tracking-[-0.02em]">
                  {point.title}
                </h3>
                <p className="mt-2 max-w-[32ch] text-[16px] leading-[1.55] text-pretty text-muted">
                  {point.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ── The conversation ────────────────────────────────────────────────── */

/* Where a question is: waiting to be put, being typed into the bar, sent,
   being read, being answered word by word, or answered. */
type Phase = "idle" | "typing" | "sending" | "thinking" | "speaking" | "done";

type Run = {
  /** One of the prompts, or a question of the reader's own. */
  src: number | "yours";
  phase: Phase;
  /** Characters of the prompt typed into the bar so far. */
  typed: number;
  /** Words of the answer spoken so far. */
  spoken: number;
  /** Counts the questions put, so each one's words are new. */
  k: number;
  /** The reader's own question, when it is theirs. */
  question: string;
};

const START: Run = {
  src: 0,
  phase: "idle",
  typed: 0,
  spoken: 0,
  k: 0,
  question: "",
};

function wordsOf(run: Run) {
  return (run.src === "yours" ? YOURS : PROMPTS[run.src]).answer.split(" ");
}

/**
 * The next step of a run and how long until it, or nothing when the run
 * rests. Typing has a person's unevenness; once the reader has taken over,
 * nothing moves on to the next question by itself.
 */
function advance(run: Run, manual: boolean): [number, Run] | null {
  const prompt = run.src === "yours" ? null : PROMPTS[run.src];
  switch (run.phase) {
    case "idle":
      return manual || !prompt
        ? null
        : [700, { ...run, phase: "typing", typed: 0, spoken: 0, k: run.k + 1 }];
    case "typing": {
      if (!prompt) return null;
      if (run.typed < prompt.ask.length) {
        const pause = prompt.ask[run.typed] === " " ? 40 : 0;
        const ms = manual ? 20 + Math.random() * 22 : 34 + Math.random() * 48;
        return [ms + pause, { ...run, typed: run.typed + 1 }];
      }
      return [380, { ...run, phase: "sending" }];
    }
    case "sending":
      return [240, { ...run, phase: "thinking" }];
    case "thinking":
      return [1500, { ...run, phase: "speaking", spoken: 0 }];
    case "speaking":
      return run.spoken < wordsOf(run).length
        ? [85, { ...run, spoken: run.spoken + 1 }]
        : [500, { ...run, phase: "done" }];
    case "done": {
      if (manual) return null;
      const next = run.src === "yours" ? 0 : (run.src + 1) % PROMPTS.length;
      return [
        4600,
        {
          src: next,
          phase: "typing",
          typed: 0,
          spoken: 0,
          k: run.k + 1,
          question: "",
        },
      ];
    }
  }
}

function Stage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { amount: 0.3 });
  const [run, setRun] = useState<Run>(START);
  /* Held by the reader's Pause; taken over once they pick or type. */
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const [draft, setDraft] = useState("");
  const [keys, setKeys] = useState(0);
  const [focused, setFocused] = useState(false);
  const live = inView && !paused && !reduce;

  useEffect(() => {
    if (!live) return;
    const step = advance(run, manual);
    if (!step) return;
    const id = window.setTimeout(() => setRun(step[1]), step[0]);
    return () => window.clearTimeout(id);
  }, [live, run, manual]);

  /* Under reduced motion every question is simply answered. */
  const shown: Run = reduce ? { ...run, phase: "done" } : run;
  const prompt = shown.src === "yours" ? null : PROMPTS[shown.src];
  const ask = prompt ? prompt.ask : shown.question;
  const working = prompt ? prompt.working : YOURS.working;
  const words = wordsOf(shown);
  const asked =
    shown.phase === "thinking" ||
    shown.phase === "speaking" ||
    shown.phase === "done";
  const finished = shown.phase === "done";
  const spoken = finished
    ? words.length
    : shown.phase === "speaking"
      ? shown.spoken
      : 0;
  const typing = shown.phase === "typing" || shown.phase === "sending";
  const autoText = typing ? ask.slice(0, shown.typed) : "";

  const mood: OrbMood =
    draft || autoText
      ? "listening"
      : shown.phase === "thinking"
        ? "thinking"
        : shown.phase === "speaking"
          ? "speaking"
          : "idle";
  /* Every keystroke, typed or the reader's, and every word kicks the orb;
     a question sent and an answer begun each send a ring out. */
  const pulse = shown.k * 1000 + shown.typed + shown.spoken + keys;
  const ripple = asked ? shown.k * 2 + (spoken > 0 ? 1 : 0) : 0;

  const choose = (i: number) => {
    setManual(true);
    setPaused(false);
    setDraft("");
    setRun((r) => ({
      src: i,
      phase: "typing",
      typed: 0,
      spoken: 0,
      k: r.k + 1,
      question: "",
    }));
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const question = draft.trim();
    if (!question) return;
    setManual(true);
    setPaused(false);
    setDraft("");
    setRun((r) => ({
      src: "yours",
      phase: "thinking",
      typed: 0,
      spoken: 0,
      k: r.k + 1,
      question,
    }));
  };

  const ready = draft.trim().length > 0 || shown.phase === "sending";

  return (
    <Reveal y={32} blur={false} className="mt-14 lg:mt-0">
      <div
        ref={ref}
        className="relative isolate overflow-hidden rounded-[30px] bg-[#131317] ring-1 ring-white/[0.05] ring-inset"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70%] bg-[radial-gradient(50%_60%_at_50%_28%,rgb(106_68_232/0.16),transparent_75%)]"
        />

        {!reduce && (
          <AutoplayToggle
            stopped={paused}
            onToggle={() => {
              if (paused) setManual(false);
              setPaused(!paused);
            }}
            tone="night"
            className="absolute top-4 right-4 z-10"
          />
        )}

        <div className="flex flex-col items-center px-5 pt-16 pb-12 sm:px-10 lg:pt-20 lg:pb-14">
          <Orb
            mood={mood}
            pulse={pulse}
            ripple={ripple}
            live={live}
            className="w-[168px] sm:w-[208px]"
          />

          {/* What was asked and what Zign AI says. Read out only once the
              reader has asked; the questions taking turns stay quiet. */}
          <div
            aria-live={manual ? "polite" : "off"}
            className="mt-12 w-full max-w-[640px] text-center"
          >
            <p
              className={cn(
                "min-h-[1.5em] text-[15px] text-muted",
                !asked && "invisible",
              )}
            >
              <motion.span
                key={shown.k}
                className="inline-block max-w-full truncate align-top"
                initial={reduce ? false : { opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {asked ? ask : " "}
              </motion.span>
            </p>

            {/* Room for the longest answer (three lines on a phone, two
                wider), so nothing below moves as answers change; a shorter
                one sits in the middle of it. */}
            <div className="relative mt-3 flex min-h-[3.9em] items-center justify-center text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.3] sm:min-h-[2.6em] lg:text-[clamp(1.25rem,1.8vw,1.625rem)]">
              <p className="font-semibold tracking-[-0.02em] text-balance text-ink">
                {words.map((word, i) => (
                  <Word
                    key={`${shown.k}-${i}`}
                    on={i < spoken}
                    still={reduce}
                    last={i === words.length - 1}
                  >
                    {word}
                  </Word>
                ))}
              </p>
              {/* Before anything is asked, it introduces itself. */}
              <p
                className={cn(
                  "absolute inset-0 flex items-center justify-center font-semibold tracking-[-0.02em] text-balance text-muted transition-[opacity,filter,visibility] duration-500",
                  asked && "invisible opacity-0 blur-[6px]",
                )}
                aria-hidden={asked || undefined}
              >
                {GREETING}
              </p>
              {shown.phase === "thinking" && (
                <p className="absolute inset-0 flex items-center justify-center gap-2 text-[17px] font-medium">
                  <span className="text-indigo-lift">
                    <Spark size={13} />
                  </span>
                  <span className="think">{working}</span>
                </p>
              )}
            </div>

            <ul className="mt-4 flex min-h-8 flex-wrap justify-center gap-2">
              {prompt ? (
                prompt.tags.map((tag, i) => (
                  <motion.li
                    key={`${shown.k}-${tag}`}
                    className={cn(
                      "rounded-full bg-white/[0.06] px-3 py-1.5 text-[13px] text-ink-soft ring-1 ring-white/[0.08] ring-inset",
                      !finished && "invisible",
                    )}
                    initial={false}
                    animate={
                      finished ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                    }
                    transition={{
                      duration: reduce ? 0 : 0.5,
                      ease: EASE,
                      delay: finished && !reduce ? 0.1 + i * 0.08 : 0,
                    }}
                  >
                    {tag}
                  </motion.li>
                ))
              ) : (
                <li className={cn(!finished && "invisible")}>
                  <Link
                    href="/login?mode=signup"
                    className="key-ink inline-flex items-center rounded-full bg-ink px-4 py-1.5 text-[13.5px] font-semibold text-paper"
                  >
                    Start for free
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <form
            onSubmit={submit}
            className="mt-8 w-full max-w-[560px]"
            aria-label="Ask Zign AI"
          >
            <div
              data-on={focused || draft || typing || undefined}
              data-busy={shown.phase === "thinking" || undefined}
              data-still={!live || undefined}
              className="ai-edge relative flex h-14 items-center gap-3 rounded-full bg-[#1b1b21] pr-2 pl-5 ring-1 ring-white/[0.08] ring-inset focus-within:ring-white/[0.2]"
            >
              <span className="text-indigo-lift">
                <Spark size={15} />
              </span>
              <div className="relative min-w-0 flex-1">
                <input
                  type="text"
                  name="ask"
                  value={draft}
                  maxLength={140}
                  autoComplete="off"
                  enterKeyHint="send"
                  aria-label="Ask Zign AI about your agreement"
                  placeholder={
                    autoText && !focused ? "" : "Ask about your agreement"
                  }
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setKeys((k) => k + 1);
                  }}
                  onFocus={() => {
                    setFocused(true);
                    setManual(true);
                    /* The reader takes the bar: a prompt half typed steps
                       aside for them. */
                    if (typing) setRun((r) => ({ ...r, phase: "idle" }));
                  }}
                  onBlur={() => {
                    setFocused(false);
                    if (!draft && shown.phase === "idle") setManual(false);
                  }}
                  className="w-full bg-transparent text-[16px] text-ink placeholder:text-muted focus-visible:outline-none"
                />
                {autoText && !focused && !draft && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center overflow-hidden text-[16px] whitespace-nowrap text-ink"
                  >
                    {autoText}
                    <span className="caret ml-px inline-block h-[18px] w-[1.5px] bg-indigo-lift" />
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Ask"
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-full transition-[background-color,color,scale] duration-300",
                  ready ? "bg-ink text-paper" : "bg-white/[0.07] text-subtle",
                  shown.phase === "sending" && "scale-90",
                )}
              >
                <ArrowUp />
              </button>
            </div>
          </form>

          <div
            role="group"
            aria-label="Questions to try"
            className="mt-4 flex max-w-[560px] flex-wrap justify-center gap-2"
          >
            {PROMPTS.map((p, i) => {
              const current = shown.src === i && shown.phase !== "idle";
              return (
                <button
                  key={p.ask}
                  type="button"
                  onClick={() => choose(i)}
                  aria-current={current ? "true" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[13.5px] ring-1 transition-colors duration-300 ring-inset",
                    current
                      ? "bg-white/[0.09] text-ink ring-white/[0.16]"
                      : "text-muted ring-white/[0.08] hover:text-ink hover:ring-white/[0.18]",
                  )}
                >
                  {p.ask}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** A word of the answer, arriving out of a blur as it is spoken. */
function Word({
  on,
  still,
  last,
  children,
}: {
  on: boolean;
  still: boolean;
  last: boolean;
  children: string;
}) {
  return (
    <>
      <motion.span
        className={cn("inline-block", !on && "invisible")}
        initial={false}
        animate={
          on
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 6, filter: "blur(10px)" }
        }
        transition={{ duration: still ? 0 : 0.55, ease: EASE }}
      >
        {children}
      </motion.span>
      {last ? null : " "}
    </>
  );
}

/* ── Marks ───────────────────────────────────────────────────────────── */

function Spark({ size = 12 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 1.5c.4 2.9 1.7 4.6 4.6 5.1v.8C9.7 7.9 8.4 9.6 8 12.5h-.8C6.8 9.6 5.5 7.9 2.6 7.4v-.8C5.5 6.1 6.8 4.4 7.2 1.5H8Z" />
    </svg>
  );
}

function ArrowUp() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
      <path
        d="M8 13V3.5M3.8 7.5 8 3.3l4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Three drawings on one 48px grid at one weight. */
function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="56"
      height="56"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function ReadIcon() {
  return (
    <Icon>
      <rect x="9" y="5" width="30" height="38" rx="4" />
      <path d="M15 13h12M15 18h18M15 23h10" />
      <path d="M30 26c.5 3.4 2 5.3 5.4 5.9v.2C32 32.7 30.5 34.6 30 38h-.2c-.5-3.4-2-5.3-5.4-5.9v-.2c3.4-.6 4.9-2.5 5.4-5.9H30Z" />
    </Icon>
  );
}

function FlowIcon() {
  return (
    <Icon>
      <circle cx="11" cy="12" r="4.5" />
      <circle cx="11" cy="36" r="4.5" />
      <rect x="28" y="19" width="14" height="10" rx="3" />
      <path d="M15.5 12h4a4 4 0 0 1 4 4v4.5a3.5 3.5 0 0 0 3.5 3.5h1M15.5 36h4a4 4 0 0 0 4-4v-4.5A3.5 3.5 0 0 1 27 24" />
    </Icon>
  );
}

function ControlIcon() {
  return (
    <Icon>
      <path d="M8 14h32M8 24h32M8 34h32" />
      <circle cx="17" cy="14" r="3.5" fill="#0e0f12" />
      <circle cx="31" cy="24" r="3.5" fill="#0e0f12" />
      <circle cx="22" cy="34" r="3.5" fill="#0e0f12" />
    </Icon>
  );
}
