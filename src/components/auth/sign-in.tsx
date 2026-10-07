"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { AppleMark, GoogleMark } from "@/components/auth/brand-marks";
import { Aurora } from "@/components/fx/aurora";
import { AutoplayToggle } from "@/components/ui/autoplay-toggle";
import { Button } from "@/components/ui/button";
import { SignatureMark, WAVE, Wordmark } from "@/components/ui/signature-mark";
import { Tick } from "@/components/ui/tick";
import { EASE } from "@/lib/motion";
import { useMedia, usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

export type SignInMode = "signin" | "signup";

const COPY = {
  signin: {
    title: "Welcome back.",
    lede: "Sign in to pick up every agreement where you left it.",
  },
  signup: {
    title: "Start your free month.",
    lede: "Draft, negotiate and sign with Zign AI, free for 30 days.",
  },
} as const;

/* Enough of an address to look like one. Nothing is checked further,
   since nothing is sent: this page is the design of sign-in, not yet the
   working thing. */
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/** An entrance delay, in seconds. */
const at = (s: number) => ({ animationDelay: `${s}s` });

/**
 * Sign in, and the sign-up side of it. The form stands on the page's own
 * ground; beside it, on wide screens, the desk: a pile of documents, each
 * waiting for the reader's signature. As an address is typed the
 * signature is written on whichever is on top, and once the address looks
 * complete that sheet is sealed.
 */
export function SignIn({ mode }: { mode: SignInMode }) {
  const copy = COPY[mode];
  const emailId = useId();
  const [email, setEmail] = useState("");
  const typed = email.trim();
  const progress = Math.min(1, typed.length / 18);
  const sealed = looksLikeEmail(typed);
  const year = new Date().getFullYear();

  return (
    <div className="relative isolate grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="relative flex min-h-svh flex-col px-5 pt-5 pb-6 sm:px-10 lg:px-14 lg:pt-7">
        {/* On narrow screens the desk is gone; a little of its light stays. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70svh] [mask-image:linear-gradient(to_bottom,#000_30%,transparent)] lg:hidden"
        >
          <Aurora strength={0.55} />
        </div>

        <header className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Zign, home"
            className="-ml-1 rounded-full px-1 py-1"
          >
            <Wordmark />
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13.5px] text-muted transition-colors duration-300 hover:bg-white/[0.06] hover:text-ink"
          >
            <svg
              viewBox="0 0 16 16"
              width="12"
              height="12"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 ease-(--ease-settle) group-hover:-translate-x-0.5"
            >
              <path
                d="M13 8H3m0 0 4.5-4.5M3 8l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to site
          </Link>
        </header>

        <main
          id="main"
          className="flex flex-1 items-center justify-center py-14"
        >
          <div className="w-full max-w-[400px]">
            <h1
              className="rise-in text-display text-[clamp(2.4rem,4vw,3rem)] leading-[1.04] tracking-[-0.03em] text-balance"
              style={at(0.08)}
            >
              {copy.title}
            </h1>
            <p
              className="rise-in mt-4 text-[16px] leading-[1.6] text-pretty text-muted"
              style={at(0.2)}
            >
              {copy.lede}
            </p>

            <div className="rise-in mt-9 space-y-3" style={at(0.3)}>
              <Provider mark={<GoogleMark />}>Continue with Google</Provider>
              <Provider mark={<AppleMark className="-mt-0.5" />}>
                Continue with Apple
              </Provider>
            </div>

            <div
              className="rise-in my-7 flex items-center gap-4"
              style={at(0.36)}
            >
              <span aria-hidden className="h-px flex-1 bg-line" />
              <span className="font-mono text-[11px] tracking-[0.08em] text-subtle uppercase">
                or
              </span>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>

            <form
              className="rise-in"
              style={at(0.42)}
              noValidate
              onSubmit={(e) => e.preventDefault()}
            >
              <label
                htmlFor={emailId}
                className="text-[13px] font-medium text-ink-soft"
              >
                Email
              </label>
              <div className="relative mt-2">
                <input
                  id={emailId}
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-line bg-card/60 pr-12 pl-4 text-[15px] text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] transition-[border-color,background-color,box-shadow] duration-300 ease-(--ease-settle) placeholder:text-subtle hover:border-[#33363f] focus:border-indigo/60 focus:bg-card focus:shadow-[0_0_0_4px_rgb(138_151_240/0.14)] focus-visible:outline-none [&:-webkit-autofill]:shadow-[inset_0_0_0_100px_#15161b] [&:-webkit-autofill]:[-webkit-text-fill-color:#eceef4]"
                />
                <AnimatePresence>
                  {sealed && (
                    <motion.span
                      aria-hidden
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="absolute top-1/2 right-4 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-signed text-night"
                    >
                      <Tick className="size-2.5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <Button
                type="submit"
                size="lg"
                arrow
                className="mt-4 h-12 w-full"
              >
                Continue with email
              </Button>
            </form>
          </div>
        </main>

        <footer className="flex flex-col gap-2 border-t border-line pt-5 text-[12.5px] leading-[1.5] text-subtle sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p>
            Signing something you were sent? Open the link in your email;
            signers never need an account.
          </p>
          <p className="shrink-0">&copy; {year} Zign</p>
        </footer>
      </div>

      <Desk progress={progress} sealed={sealed} />
    </div>
  );
}

/** A sign-in provider's key: its mark at the left, the words centred. */
function Provider({
  mark,
  children,
}: {
  mark: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="relative flex h-12 w-full items-center justify-center rounded-full border border-line bg-card/50 px-12 text-[14.5px] font-medium tracking-[-0.005em] text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] transition-[background-color,border-color] duration-300 ease-(--ease-settle) hover:border-[#3a3d47] hover:bg-card"
    >
      <span
        aria-hidden
        className="absolute left-5 grid size-5 place-items-center"
      >
        {mark}
      </span>
      {children}
    </button>
  );
}

/* ── The desk ─────────────────────────────────────────────────────────── */

/** How long each document stays on top of the pile, in milliseconds. */
const DWELL = 6500;

type Doc = {
  id: string;
  /** Its name in the switcher under the pile. */
  label: string;
  /** How the sheet lies on the desk, in degrees. */
  tilt: number;
  /** The party who has already signed. */
  signed: { party: string; label: string; name: string; date: string };
  /** Whose block the reader signs. */
  you: string;
  /** What Zign AI says before and after the reader signs. */
  note: { waiting: string; sealed: string };
  Body: () => React.ReactNode;
  /** A certificate's double rule around the sheet. */
  framed?: boolean;
};

/* Three kinds of paper, in the order they take the top of the pile: a
   personal certificate, a business agreement and an employment offer.
   Everyone and everything on them is fictional. */
const DOCS: Doc[] = [
  {
    id: "marriage",
    label: "Marriage",
    tilt: 1.5,
    signed: {
      party: "Registrar",
      label: "Signature · Ruth",
      name: "Ruth Hale",
      date: "7 Oct 2026",
    },
    you: "Witness",
    note: {
      waiting: "Ruth signed as registrar. Witness it, and it’s settled.",
      sealed: "Witnessed. Sealed and certified.",
    },
    Body: MarriageBody,
    framed: true,
  },
  {
    id: "nda",
    label: "NDA",
    tilt: -2,
    signed: {
      party: "For Halden & Co. LLP",
      label: "Signature · Hannah",
      name: "Hannah Brooks",
      date: "7 Oct 2026",
    },
    you: "For Fernhill Studio Ltd",
    note: {
      waiting: "Hannah signed. Your turn: one signature and it’s settled.",
      sealed: "Both signatures in. Sealed and certified.",
    },
    Body: NdaBody,
  },
  {
    id: "offer",
    label: "Offer letter",
    tilt: -1,
    signed: {
      party: "For Arbor Studio",
      label: "Signature · James",
      name: "James Ortiz",
      date: "7 Oct 2026",
    },
    you: "Accepted by",
    note: {
      waiting: "James signed the offer. Accept it, and it’s settled.",
      sealed: "Offer accepted. Sealed and certified.",
    },
    Body: OfferBody,
  },
];

/**
 * The desk beside the form: the night surface, its weather, and a pile of
 * documents that take turns on top until the reader starts to sign. From
 * the first keystroke the one on top is theirs. The turns pause under the
 * pointer and on focus, can be stopped, and never run under reduced
 * motion (WCAG 2.2.2).
 */
function Desk({ progress, sealed }: { progress: number; sealed: boolean }) {
  const reduce = usePrefersReducedMotion();
  const wide = useMedia("(min-width: 64rem)");
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const running =
    wide && !reduce && !stopped && !hovered && !focused && progress === 0;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => setActive((a) => (a + 1) % DOCS.length),
      DWELL,
    );
    return () => window.clearTimeout(id);
  }, [running, active]);

  const doc = DOCS[active];

  return (
    <aside
      aria-label="Example documents"
      className="hidden p-3 lg:sticky lg:top-0 lg:block lg:h-svh"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="grain relative isolate h-full overflow-hidden rounded-[28px] bg-night shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)]">
        <Aurora className="-z-10" />
        <div className="dot-grid-night absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_45%,#000_20%,transparent_75%)] opacity-70" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-lift/40 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center px-14 pb-28">
          <div className="flex w-full max-w-[430px] flex-col items-center [@media(max-height:820px)]:scale-[0.88]">
            <div aria-hidden className="relative w-full">
              <div className="rise-in" style={at(0.25)}>
                <div className="float-slower relative">
                  {/* The rest of the pile, just showing. */}
                  <div className="absolute inset-0 translate-x-4 translate-y-3 rotate-[4deg] rounded-[6px] bg-[#cfd3dd] opacity-50 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]" />
                  <div className="absolute inset-0 -translate-x-3 translate-y-2 -rotate-[4.5deg] rounded-[6px] bg-[#e6e8ee] opacity-70 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]" />
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={doc.id}
                      initial={{
                        opacity: 0,
                        y: 28,
                        scale: 0.97,
                        rotate: doc.tilt + 3,
                      }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotate: doc.tilt }}
                      exit={{
                        opacity: 0,
                        x: -36,
                        y: -24,
                        scale: 0.98,
                        rotate: doc.tilt - 5,
                      }}
                      transition={{ duration: 0.8, ease: EASE }}
                    >
                      <Sheet doc={doc} progress={progress} sealed={sealed} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              {/* Above the sheet's top edge, clear of its title. */}
              <div
                className="rise-in absolute -right-9 bottom-[calc(100%-16px)] w-[248px]"
                style={at(0.65)}
              >
                <Note doc={doc} sealed={sealed} />
              </div>
            </div>

            <div
              className="rise-in mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
              style={at(0.75)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            >
              <div
                role="group"
                aria-label="Choose an example"
                className="flex items-center gap-5"
              >
                {DOCS.map((d, i) => (
                  <button
                    key={d.id}
                    type="button"
                    aria-pressed={i === active}
                    onClick={() => setActive(i)}
                    className={cn(
                      "relative pb-2 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors duration-300",
                      i === active
                        ? "text-night-text"
                        : "text-night-muted hover:text-night-text",
                    )}
                  >
                    <span className="text-indigo-lift">0{i + 1}</span> {d.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-night-line"
                    >
                      {i === active && (
                        <motion.span
                          key={`${active}-${running}`}
                          className="block h-full origin-left bg-indigo-lift"
                          initial={{ scaleX: running ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: running ? DWELL / 1000 : 0,
                            ease: "linear",
                          }}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              {!reduce && (
                <AutoplayToggle
                  tone="night"
                  stopped={stopped}
                  onToggle={() => setStopped((s) => !s)}
                />
              )}
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-10 bottom-9 flex items-end justify-between gap-6"
        >
          <p className="text-display text-[2.1rem] leading-[1.02] tracking-[-0.03em] text-night-text">
            Agreements,
            <br />
            <em className="text-ink-sweep font-serif italic">settled.</em>
          </p>
          <p className="pb-1.5 text-eyebrow text-night-muted">
            The agreement copilot
          </p>
        </div>
      </div>
    </aside>
  );
}

/**
 * One sheet: the document's own body, then the two signature blocks, the
 * one already signed and the reader's. Every sheet is the same size, so
 * the pile never changes shape as they take turns.
 */
function Sheet({
  doc,
  progress,
  sealed,
}: {
  doc: Doc;
  progress: number;
  sealed: boolean;
}) {
  /* The date is written in only when the sheet is signed, on the reader's
     own machine, so it is always today's. */
  const date = sealed
    ? new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;
  const { Body, signed } = doc;

  return (
    <div className="relative flex h-[456px] flex-col rounded-[6px] bg-sheet px-9 pt-9 pb-8 text-paper-soft shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_30px_70px_-20px_rgb(0_0_0/0.8),0_80px_140px_-40px_rgb(56_75_199/0.4)]">
      {doc.framed && (
        <>
          <span className="pointer-events-none absolute inset-3 rounded-[3px] border border-paper-line" />
          <span className="pointer-events-none absolute inset-[17px] rounded-[2px] border border-paper-line/60" />
        </>
      )}

      <Body />

      <div className="mt-auto grid grid-cols-2 gap-6 pt-6">
        <Block
          party={signed.party}
          label={signed.label}
          done
          name={signed.name}
          date={signed.date}
        >
          <span className="absolute bottom-[3px] left-2 font-script text-[28px] leading-none whitespace-nowrap text-indigo-ink">
            {signed.name}
          </span>
        </Block>
        <Block party={doc.you} label="Signature · You" date={date}>
          <span
            className={cn(
              "absolute bottom-2 left-2 rounded-[3px] bg-indigo-ink px-1.5 py-0.5 text-[7.5px] font-semibold tracking-[0.08em] text-white uppercase transition-opacity duration-300",
              progress > 0 && "opacity-0",
            )}
          >
            Sign here
          </span>
          <svg
            viewBox="34 18 165 66"
            width="112"
            height="45"
            fill="none"
            className="absolute bottom-0.5 left-2 overflow-visible text-indigo-ink"
          >
            <motion.path
              d={WAVE}
              stroke="currentColor"
              strokeWidth={5.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: progress, opacity: progress > 0 ? 1 : 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            />
            {[
              [178, 47, 3.4],
              [186, 43, 2.6],
              [192, 41, 1.9],
            ].map(([cx, cy, r], i) => (
              <motion.circle
                key={cx}
                cx={cx}
                cy={cy}
                r={r}
                fill="currentColor"
                initial={false}
                animate={{ opacity: progress >= 1 ? 1 : 0 }}
                transition={{
                  duration: 0.3,
                  delay: progress >= 1 ? i * 0.08 : 0,
                }}
              />
            ))}
          </svg>
        </Block>
      </div>

      {/* The seal, stamped on once both signatures are in. */}
      <AnimatePresence>
        {sealed && (
          <motion.span
            className="seal absolute right-8 bottom-[158px] grid size-14 place-items-center rounded-full bg-sheet"
            initial={{ opacity: 0, scale: 1.6, rotate: -16 }}
            animate={{ opacity: 1, scale: 1, rotate: -7 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <SignatureMark size={32} className="text-indigo-ink" />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Lines of type, seen from a distance. */
function Lines({
  widths,
  className,
}: {
  widths: string[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-[7px] text-[10.5px]", className)}>
      {widths.map((w, i) => (
        <div key={i} className="type-line" style={{ width: w }} />
      ))}
    </div>
  );
}

const NDA_CLAUSES: [string, string[]][] = [
  ["1. Purpose", ["100%", "78%"]],
  ["2. Confidential Information", ["100%", "94%", "52%"]],
  ["3. Term", ["100%", "64%"]],
];

function NdaBody() {
  return (
    <>
      <p className="text-center font-serif text-[18px] leading-tight font-semibold tracking-[-0.01em] text-paper-ink">
        Mutual Non-Disclosure Agreement
      </p>
      <p className="mt-1.5 text-center text-[9.5px] text-paper-muted">
        Fernhill Studio Ltd and Halden &amp; Co. LLP
      </p>
      <div className="mt-6 space-y-3.5">
        {NDA_CLAUSES.map(([title, widths]) => (
          <div key={title}>
            <p className="font-serif text-[11px] font-semibold text-paper-ink">
              {title}
            </p>
            <Lines widths={widths} className="mt-1.5" />
          </div>
        ))}
      </div>
    </>
  );
}

function MarriageBody() {
  return (
    <div className="flex flex-col items-center text-center">
      <div aria-hidden className="flex items-center gap-2">
        <span className="h-px w-10 bg-paper-line" />
        <span className="size-1.5 rotate-45 bg-indigo-ink/60" />
        <span className="h-px w-10 bg-paper-line" />
      </div>
      <p className="mt-3 text-[7.5px] font-medium tracking-[0.32em] text-paper-muted uppercase">
        Certificate of
      </p>
      <p className="mt-1 font-serif text-[30px] leading-none font-medium tracking-[-0.01em] text-paper-ink italic">
        Marriage
      </p>
      <p className="mt-3.5 font-serif text-[10px] text-paper-muted italic">
        This is to certify that
      </p>
      <p className="mt-1.5 font-serif text-[14.5px] font-semibold text-paper-ink">
        Clara Bennett
      </p>
      <p className="my-0.5 font-serif text-[10px] text-paper-muted italic">
        and
      </p>
      <p className="font-serif text-[14.5px] font-semibold text-paper-ink">
        Samuel Okafor
      </p>
      <p className="mt-2.5 max-w-[34ch] text-[9.5px] leading-[1.6] text-paper-muted">
        were joined in marriage on the twelfth of September, 2026, in London.
      </p>
      <dl className="mt-3.5 grid w-full grid-cols-3 border-y border-paper-line py-2">
        {[
          ["Register", "MC-2026-04817"],
          ["Place", "London"],
          ["Date", "12 Sep 2026"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[7px] tracking-[0.12em] text-paper-subtle uppercase">
              {k}
            </dt>
            <dd
              className="mt-0.5 font-mono text-[8.5px] text-paper-ink"
              data-tabular
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const OFFER_TERMS = [
  ["Role", "Senior Product Designer"],
  ["Start date", "3 November 2026"],
  ["Salary", "£84,000 a year"],
  ["Location", "London, hybrid"],
];

function OfferBody() {
  return (
    <>
      <div className="flex items-center justify-between border-b border-paper-line pb-3">
        <p className="flex items-center gap-2">
          <span className="grid size-5 place-items-center rounded-[4px] bg-indigo-ink text-[7.5px] font-semibold tracking-[0.04em] text-white">
            AS
          </span>
          <span className="font-serif text-[12px] font-semibold text-paper-ink">
            Arbor Studio
          </span>
        </p>
        <p className="font-mono text-[8.5px] text-paper-muted" data-tabular>
          7 Oct 2026
        </p>
      </div>
      <p className="mt-5 font-serif text-[18px] leading-tight font-semibold tracking-[-0.01em] text-paper-ink">
        Offer of Employment
      </p>
      <p className="mt-1.5 text-[9.5px] text-paper-muted">
        We are delighted to offer you the role below.
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
        {OFFER_TERMS.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[7px] tracking-[0.12em] text-paper-subtle uppercase">
              {k}
            </dt>
            <dd className="mt-0.5 text-[10px] text-paper-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <Lines widths={["100%", "86%"]} className="mt-4" />
    </>
  );
}

/** One party's signature block: the field, then the name and date. */
function Block({
  party,
  label,
  done = false,
  name,
  date,
  children,
}: {
  party: string;
  label: string;
  done?: boolean;
  name?: string;
  date: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[7.5px] font-medium tracking-[0.12em] text-paper-muted uppercase">
        {party}
      </p>
      <div
        className={cn(
          "relative mt-2.5 h-[48px] rounded-[3px] border border-dashed",
          done
            ? "border-paper-ink/25 bg-paper-ink/[0.02]"
            : "border-indigo-ink/55 bg-indigo-ink/[0.045]",
        )}
      >
        <span
          className={cn(
            "absolute -top-[7px] left-1.5 bg-sheet px-1 text-[7px] leading-[12px] font-semibold tracking-[0.06em] uppercase",
            done ? "text-paper-muted" : "text-indigo-ink",
          )}
        >
          {label}
        </span>
        {children}
      </div>
      <div className="mt-2.5 grid grid-cols-[34px_1fr] items-center gap-y-1.5 text-[9.5px]">
        <span className="text-paper-muted">Name</span>
        <span className="h-[19px] border-b border-paper-line pl-1.5 leading-[19px] text-paper-ink">
          {name}
        </span>
        <span className="text-paper-muted">Date</span>
        <span
          className="h-[19px] border-b border-paper-line pl-1.5 font-mono text-[9px] leading-[19px] text-paper-ink"
          data-tabular
        >
          {date}
        </span>
      </div>
    </div>
  );
}

/** Zign AI's note beside the pile: one line per document, and one once
    it is sealed. */
function Note({ doc, sealed }: { doc: Doc; sealed: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-card/90 p-3.5 shadow-float backdrop-blur-md">
      <p className="flex items-center gap-2 text-[10px] font-medium tracking-[0.08em] text-indigo uppercase">
        <SignatureMark size={14} strokeWidth={9} className="text-indigo" />
        Zign AI
      </p>
      <div className="mt-2 min-h-[38px] text-[12.5px] leading-[1.5] text-ink">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`${doc.id}-${sealed}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={sealed ? "flex items-start gap-2" : undefined}
          >
            {sealed && (
              <span className="mt-[3px] grid size-4 shrink-0 place-items-center rounded-full bg-signed text-night">
                <Tick className="size-2.5" />
              </span>
            )}
            {sealed ? doc.note.sealed : doc.note.waiting}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
