"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState } from "react";

import { Aurora } from "@/components/fx/aurora";
import { useLenis } from "@/components/providers/smooth-scroll";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { SignatureMark } from "@/components/ui/signature-mark";
import { Tick } from "@/components/ui/tick";
import { DraftScene } from "@/components/visuals/workflow/draft-scene";
import { NegotiateScene } from "@/components/visuals/workflow/negotiate-scene";
import { PrepareScene } from "@/components/visuals/workflow/prepare-scene";
import { SignScene } from "@/components/visuals/workflow/sign-scene";
import { EASE } from "@/lib/motion";
import { useMedia, usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  {
    kicker: "Draft",
    title: "Start with a file, or a sentence.",
    body: "Upload a contract or describe the one you need. Zign AI writes the first draft, ready to edit.",
    Scene: DraftScene,
  },
  {
    kicker: "Prepare",
    title: "Fields find their own places.",
    body: "Zign works out who signs and in what order, places every field, and checks for anything missing.",
    Scene: PrepareScene,
  },
  {
    kicker: "Negotiate",
    title: "Redlines in the open, not in an inbox.",
    body: "Share a review link. Suggestions land on the page, everyone votes, and you decide what is applied.",
    Scene: NegotiateScene,
  },
  {
    kicker: "Sign",
    title: "A signature that holds up.",
    body: "Signers sign from any device, no account needed. The finished PDF is sealed with a certificate anyone can check.",
    Scene: SignScene,
  },
] as const;

/** How far the reader scrolls through the pinned story, in viewports. */
const TRACK_VH = 200;

export function Workflow() {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-title"
      className="relative scroll-mt-16 py-14 lg:py-16"
    >
      <Container>
        <SectionHead
          id="workflow-title"
          n="1"
          label="How it works"
          title="From first draft to final signature."
          lede="One agreement, drafted, prepared, negotiated and signed as you scroll."
        />
      </Container>
      <SheetStory />
      <Container>
        <ChaptersStacked />
      </Container>
    </section>
  );
}

/* ── Wide screens: one document, scrubbed by the scroll ──────────────── */

function SheetStory() {
  const trackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [chapter, setChapter] = useState(0);
  const { scrollYProgress: p } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(p, "change", (v) => {
    const i = Math.min(3, Math.max(0, Math.floor(v * 4)));
    setChapter((c) => (c === i ? c : i));
  });

  /* Scroll to a point a little way into a chapter. */
  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const y = top + (i / 4 + 0.08) * span;
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const c = CHAPTERS[chapter];

  return (
    <div
      ref={trackRef}
      className="relative mt-6 hidden lg:block"
      style={{ height: `${TRACK_VH}vh` }}
    >
      {/* Where each chapter sits on the track, for links and the probes:
          centred in the viewport, each lands mid-chapter at any track length. */}
      {CHAPTERS.map((ch, i) => (
        <div
          key={ch.kicker}
          id={`chapter-${i}`}
          aria-hidden
          className="absolute left-0 h-px w-px"
          style={{ top: `calc(50vh + (100% - 100vh) * ${(i + 0.5) / 4})` }}
        />
      ))}

      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <Container className="grid w-full grid-cols-12 items-center gap-x-10">
          <div className="col-span-4">
            <div className="relative min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.article
                  key={chapter}
                  aria-current="step"
                  initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className="flex items-center gap-3 text-eyebrow text-muted">
                    <span className="text-indigo">0{chapter + 1}</span>
                    {c.kicker}
                  </p>
                  <h3 className="mt-5 text-display text-[2.125rem] leading-[1.1] tracking-[-0.024em] text-balance">
                    {c.title}
                  </h3>
                  <p className="mt-4 max-w-[40ch] text-[16px] leading-[1.65] text-pretty text-muted">
                    {c.body}
                  </p>
                </motion.article>
              </AnimatePresence>
            </div>

            <ol
              aria-label="Steps"
              className="relative mt-10 border-l border-line"
            >
              <motion.span
                aria-hidden
                className="absolute top-0 -left-px h-full w-px origin-top bg-indigo"
                style={{ scaleY: p }}
              />
              {CHAPTERS.map((ch, i) => (
                <li key={ch.kicker}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={chapter === i ? "step" : undefined}
                    className={cn(
                      "flex items-center gap-3 py-2 pl-6 text-[13.5px] transition-colors duration-300",
                      chapter === i ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    <span
                      className="font-mono text-[11px] text-subtle"
                      data-tabular
                    >
                      0{i + 1}
                    </span>
                    {ch.kicker}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="col-span-8">
            <Stage p={p} />
          </div>
        </Container>
      </div>
    </div>
  );
}

/* ── The sheet and everything that happens to it ─────────────────────── */

function Stage({ p }: { p: MotionValue<number> }) {
  const reduce = usePrefersReducedMotion();

  /* Each chapter's own progress, 0 to 1. */
  const t0 = useTransform(p, [0, 0.25], [0, 1]);
  const t1 = useTransform(p, [0.25, 0.5], [0, 1]);
  const t2 = useTransform(p, [0.5, 0.75], [0, 1]);
  const t3 = useTransform(p, [0.75, 1], [0, 1]);

  /* The sheet turns from a slight angle to flat as the story runs, and
     leans a little toward the pointer. */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.6 });
  const turn = useTransform(p, [0, 1], [-9, 0]);
  const rotateY = useTransform([turn, sx], ([a, b]: number[]) => a + b * 4);
  const rotateX = useTransform(sy, (v) => -v * 4);
  const lift = useTransform(t3, [0.6, 1], [0, -12]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  /* Draft: the request is already on the desk when the blank sheet is. */
  const promptO = useTransform(p, [0, 0.2, 0.25], [1, 1, 0]);
  const promptY = useTransform(p, [0.2, 0.25], [0, -8]);
  const titleO = useTransform(t0, [0.04, 0.14], [0, 1]);
  /* The signature blocks belong to a finished draft: they arrive last. */
  const blocksO = useTransform(t0, [0.82, 0.96], [0, 1]);

  /* Prepare */
  const signersO = useTransform(p, [0.25, 0.29, 0.49, 0.52], [0, 1, 1, 0]);
  const signersX = useTransform(t1, [0, 0.16], [12, 0]);
  const checksO = useTransform(p, [0.44, 0.48, 0.49, 0.52], [0, 1, 1, 0]);

  /* Negotiate */
  const reviewO = useTransform(p, [0.5, 0.54, 0.74, 0.77], [0, 1, 1, 0]);
  const reviewY = useTransform(t2, [0, 0.16], [-10, 0]);
  const strike = useTransform(t2, [0.16, 0.34], [0, 1]);
  const insO = useTransform(t2, [0.32, 0.44], [0, 1]);
  /* The insertion takes no room until it is written, so the clause reads
     as one sentence before the redline. */
  const insW = useTransform(t2, [0.3, 0.44], [0, 72]);
  const votesO = useTransform(p, [0.53, 0.57, 0.74, 0.78], [0, 1, 1, 0]);
  const agreedO = useTransform(t2, [0.86, 0.94], [0, 1]);
  const countO = useTransform(t2, [0.86, 0.94], [1, 0]);

  /* Sign */
  const signature = useTransform(
    t3,
    [0.1, 0.52],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const dateO = useTransform(t3, [0.54, 0.62], [0, 1]);
  const sealO = useTransform(t3, [0.68, 0.78], [0, 1]);
  const sealS = useTransform(t3, [0.68, 0.86], [1.7, 1]);
  const sealR = useTransform(t3, [0.68, 0.86], [-16, -7]);
  const ribbonO = useTransform(t3, [0.86, 0.95], [0, 1]);
  const ribbonY = useTransform(t3, [0.86, 0.95], [8, 0]);

  return (
    <div
      className="relative mx-auto flex h-[640px] w-full max-w-[760px] items-center justify-center"
      style={{ perspective: 1600 }}
      onPointerMove={reduce ? undefined : onMove}
      onPointerLeave={onLeave}
    >
      {/* The light the sheet stands in. It reaches past the stage and
          fades to nothing on its own, so there is no box to see. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-24 -inset-y-16 -z-10 [mask-image:radial-gradient(ellipse_at_center,#000_26%,transparent_70%)]"
      >
        <Aurora strength={0.8} />
        <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_15%,transparent_58%)]" />
      </div>

      {/* The sheet */}
      <motion.div
        style={{ rotateY, rotateX, y: lift, transformStyle: "preserve-3d" }}
        className="relative w-[480px] rounded-[4px] bg-sheet px-11 pt-10 pb-9 text-[10.5px] leading-[1.62] text-paper-soft shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_30px_70px_-20px_rgb(0_0_0/0.8),0_80px_140px_-40px_rgb(56_75_199/0.35)]"
      >
        <motion.div style={{ opacity: titleO }}>
          <p className="text-center font-serif text-[19px] leading-tight font-semibold tracking-[-0.01em] text-paper-ink">
            Consulting Agreement
          </p>
          <p className="mt-1.5 text-center text-[9.5px] text-paper-muted">
            Fernhill Studio Ltd and Arbor Studio
          </p>
        </motion.div>

        <div className="mt-5 space-y-3.5">
          <ClauseLine t={t0} k={0} title="1. Services">
            Arbor Studio will provide brand and product design services as set
            out in Schedule 1.
          </ClauseLine>
          <ClauseLine t={t0} k={1} title="2. Fees">
            £8,000 per month, invoiced monthly in arrears and payable within 30
            days.
          </ClauseLine>
          <ClauseLine t={t0} k={2} title="3. Term">
            <span className="relative inline-block">
              Three months
              <motion.span
                aria-hidden
                className="absolute inset-x-0 top-[55%] h-px origin-left bg-paper-subtle"
                style={{ scaleX: strike }}
              />
            </span>{" "}
            <motion.span
              className="redline-ins inline-block overflow-hidden px-[1px] align-bottom whitespace-nowrap"
              style={{ opacity: insO, maxWidth: insW }}
            >
              Six months
            </motion.span>{" "}
            from the Start Date, extendable by agreement in writing.
          </ClauseLine>
          <ClauseLine t={t0} k={3} title="4. Intellectual property">
            All work product is assigned to Fernhill Studio Ltd on payment.
          </ClauseLine>
        </div>

        <motion.div
          className="mt-7 grid grid-cols-2 gap-7"
          style={{ opacity: blocksO }}
        >
          <div>
            <p className="text-[7.5px] font-medium tracking-[0.12em] text-paper-muted uppercase">
              For Arbor Studio
            </p>
            <div className="relative mt-2 h-[46px] border-b border-paper-line">
              <Field t={t1} k={0} tone={0} label="Signature · Hannah">
                <motion.span
                  className="absolute bottom-[3px] left-2 font-script text-[30px] leading-none whitespace-nowrap text-indigo-ink"
                  style={{ clipPath: signature }}
                >
                  Hannah Brooks
                </motion.span>
              </Field>
            </div>
            <div className="mt-2.5 grid grid-cols-[34px_1fr] items-center gap-y-1.5 text-[9.5px]">
              <span className="text-paper-muted">Name</span>
              <div className="relative h-[19px] border-b border-paper-line">
                <Field t={t1} k={1} tone={0}>
                  <span className="absolute inset-y-0 left-1.5 flex items-center text-paper-ink">
                    Hannah Brooks
                  </span>
                </Field>
              </div>
              <span className="text-paper-muted">Date</span>
              <div className="relative h-[19px] border-b border-paper-line">
                <Field t={t1} k={2} tone={0}>
                  <motion.span
                    className="absolute inset-y-0 left-1.5 flex items-center font-mono text-[9px] text-paper-ink"
                    style={{ opacity: dateO }}
                    data-tabular
                  >
                    7 Oct 2026
                  </motion.span>
                </Field>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[7.5px] font-medium tracking-[0.12em] text-paper-muted uppercase">
              For Fernhill Studio Ltd
            </p>
            <div className="relative mt-2 h-[46px] border-b border-paper-line">
              <Field t={t1} k={3} tone={1} label="Signature · Maya" />
            </div>
            <div className="mt-2.5 grid grid-cols-[34px_1fr] items-center gap-y-1.5 text-[9.5px]">
              <span className="text-paper-muted">Name</span>
              <div className="relative h-[19px] border-b border-paper-line">
                <Field t={t1} k={4} tone={1}>
                  <span className="absolute inset-y-0 left-1.5 flex items-center text-paper-ink">
                    Maya Ellison
                  </span>
                </Field>
              </div>
              <span className="text-paper-muted">Date</span>
              <div className="relative h-[19px] border-b border-paper-line">
                <Field t={t1} k={5} tone={1} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* The seal, stamped on at the end. */}
        <motion.span
          aria-hidden
          className="seal absolute top-7 right-7 grid size-16 place-items-center rounded-full bg-sheet"
          style={{ opacity: sealO, scale: sealS, rotate: sealR }}
        >
          <SignatureMark size={36} className="text-indigo-ink" />
        </motion.span>
      </motion.div>

      {/* ── Around the sheet ─────────────────────────────────────────── */}

      <Floater
        style={{ opacity: promptO, y: promptY }}
        className="top-[6%] left-[-60px] w-[230px]"
      >
        <p className="flex items-center gap-2 text-[10px] font-medium tracking-[0.08em] text-indigo uppercase">
          <SignatureMark size={14} strokeWidth={9} className="text-indigo" />
          You asked
        </p>
        <p className="mt-2 text-[12.5px] leading-[1.5] text-ink">
          Draft a consulting agreement with Arbor Studio: three months at £8,000
          a month, IP assigned to us.
        </p>
      </Floater>

      <Floater
        style={{ opacity: signersO, x: signersX }}
        className="top-[8%] right-[-60px] w-[230px]"
      >
        <p className="text-[10px] font-medium tracking-[0.08em] text-muted uppercase">
          Signing order
        </p>
        <div className="mt-2.5 space-y-2">
          <Person
            initials="HB"
            name="Hannah Brooks"
            note="Arbor Studio"
            tone={0}
          />
          <Person
            initials="ME"
            name="Maya Ellison"
            note="You, second"
            tone={1}
          />
        </div>
      </Floater>

      <Floater
        style={{ opacity: checksO }}
        className="right-[-60px] bottom-[10%] w-[230px]"
      >
        <p className="flex items-center justify-between text-[10px] font-medium tracking-[0.08em] text-muted uppercase">
          Checkpoint
          <span className="font-mono text-signed">4 of 4</span>
        </p>
        <ul className="mt-2.5 space-y-1.5 text-[12px] text-ink-soft">
          {[
            "Parties and addresses",
            "Governing law",
            "Payment terms",
            "Signature blocks",
          ].map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="grid size-3.5 place-items-center rounded-full bg-signed text-night">
                <Tick className="size-2" />
              </span>
              {s}
            </li>
          ))}
        </ul>
      </Floater>

      <Floater
        style={{ opacity: reviewO, y: reviewY }}
        className="top-[6%] left-[-60px] w-[230px]"
      >
        <p className="text-[10px] font-medium tracking-[0.08em] text-muted uppercase">
          Shared for review
        </p>
        <div className="mt-2.5 space-y-2">
          <Person initials="PN" name="Priya Nair" note="Viewer" tone={2} />
          <Person initials="AK" name="Aisha Khan" note="Commenter" tone={1} />
          <Person initials="YD" name="Yusuf Demir" note="Editor" tone={0} />
        </div>
      </Floater>

      <Floater
        style={{ opacity: votesO }}
        className="right-[-60px] bottom-[12%] w-[230px]"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-full bg-indigo text-[9.5px] font-semibold text-night">
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
        </div>
        <p className="mt-2.5 text-[12px] text-ink-soft">
          Clause 3: <span className="text-subtle line-through">three</span>{" "}
          <span className="text-indigo">six</span> months.
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <Vote t={t2} k={0}>
            Yusuf
          </Vote>
          <Vote t={t2} k={1}>
            Aisha
          </Vote>
          <Vote t={t2} k={2}>
            You
          </Vote>
        </div>
        <div className="relative mt-3 h-5 text-[11px]">
          <motion.span
            className="absolute inset-0 font-mono text-muted"
            style={{ opacity: countO }}
          >
            Votes arriving
          </motion.span>
          <motion.span
            className="absolute inset-0 flex items-center gap-1.5 font-medium text-signed"
            style={{ opacity: agreedO }}
          >
            <Tick className="size-3" /> Agreed by all, applied
          </motion.span>
        </div>
      </Floater>

      <Floater
        style={{ opacity: ribbonO, y: ribbonY }}
        className="bottom-[8%] left-[-60px] w-[230px]"
      >
        <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink">
          <span className="grid size-5 place-items-center rounded-full bg-signed text-night">
            <Tick className="size-2.5" />
          </span>
          Sealed and certified
        </p>
        <p className="mt-2 font-mono text-[10.5px] text-muted" data-tabular>
          SHA-256 <span className="text-ink-soft">9f2c41ab 7d03e5c8</span>
        </p>
        <p className="mt-1 font-mono text-[10.5px] text-muted">
          HMAC seal <span className="text-signed">valid</span>
        </p>
      </Floater>
    </div>
  );
}

/** A clause whose text is written onto the sheet as the chapter runs. */
function ClauseLine({
  t,
  k,
  title,
  children,
}: {
  t: MotionValue<number>;
  k: number;
  title: string;
  children: React.ReactNode;
}) {
  const start = 0.16 + k * 0.19;
  const titleO = useTransform(t, [start, start + 0.05], [0, 1]);
  const clip = useTransform(
    t,
    [start + 0.03, start + 0.17],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  return (
    <div>
      <motion.p
        className="font-serif text-[11.5px] font-semibold text-paper-ink"
        style={{ opacity: titleO }}
      >
        {title}
      </motion.p>
      <motion.p className="mt-0.5" style={{ clipPath: clip }}>
        {children}
      </motion.p>
    </div>
  );
}

const FIELD_TONE = {
  0: "border-indigo-ink/55 bg-indigo-ink/[0.045] text-indigo-ink",
  1: "border-paper-ink/35 bg-paper-ink/[0.025] text-paper-soft",
} as const;

/** A field box placed on the sheet during Prepare. */
function Field({
  t,
  k,
  tone,
  label,
  children,
}: {
  t: MotionValue<number>;
  k: number;
  tone: 0 | 1;
  label?: string;
  children?: React.ReactNode;
}) {
  const start = 0.2 + k * 0.08;
  const opacity = useTransform(t, [start, start + 0.1], [0, 1]);
  const scale = useTransform(t, [start, start + 0.1], [0.92, 1]);
  return (
    <motion.div
      className={cn(
        "absolute -inset-x-1 -top-0.5 -bottom-px rounded-[3px] border border-dashed",
        FIELD_TONE[tone],
      )}
      style={{ opacity, scale }}
    >
      {label && (
        <span className="absolute -top-[7px] left-1.5 bg-sheet px-1 text-[7px] leading-[12px] font-semibold tracking-[0.06em] uppercase">
          {label}
        </span>
      )}
      {children}
    </motion.div>
  );
}

/** A vote that lands during Negotiate. */
function Vote({
  t,
  k,
  children,
}: {
  t: MotionValue<number>;
  k: number;
  children: React.ReactNode;
}) {
  const start = 0.48 + k * 0.12;
  const on = useTransform(t, [start, start + 0.08], [0, 1]);
  const bg = useTransform(
    on,
    [0, 1],
    ["rgb(82 168 139 / 0)", "rgb(82 168 139 / 0.12)"],
  );
  const color = useTransform(on, [0, 1], ["#7b7e8a", "#52a88b"]);
  const border = useTransform(on, [0, 1], ["#262830", "rgb(82 168 139 / 0.4)"]);
  return (
    <motion.span
      className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]"
      style={{ backgroundColor: bg, color, borderColor: border }}
    >
      <motion.span style={{ opacity: on }}>
        <Tick className="size-2.5" />
      </motion.span>
      {children}
    </motion.span>
  );
}

const PERSON_TONE = {
  0: "bg-indigo text-night",
  1: "bg-ink text-paper",
  2: "bg-desk text-muted",
} as const;

function Person({
  initials,
  name,
  note,
  tone,
}: {
  initials: string;
  name: string;
  note: string;
  tone: 0 | 1 | 2;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full text-[8.5px] font-semibold",
          PERSON_TONE[tone],
        )}
      >
        {initials}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[12px] font-medium text-ink">
          {name}
        </span>
        <span className="block truncate text-[10.5px] text-muted">{note}</span>
      </span>
    </div>
  );
}

/** A piece of the product's UI standing beside the sheet. */
function Floater({
  style,
  className,
  children,
}: {
  style: React.ComponentProps<typeof motion.div>["style"];
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      aria-hidden
      style={style}
      className={cn(
        "pointer-events-none absolute rounded-2xl border border-line bg-card/90 p-3.5 shadow-float backdrop-blur-md",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/* ── Narrow screens: each chapter carries its own scene ──────────────── */

function ChaptersStacked() {
  return (
    <div className="mt-10 space-y-12 lg:hidden">
      {CHAPTERS.map((c, i) => (
        <StackedChapter key={c.kicker} chapter={c} index={i} />
      ))}
    </div>
  );
}

function StackedChapter({
  chapter,
  index,
}: {
  chapter: (typeof CHAPTERS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = !useMedia("(min-width: 64rem)");
  const inView = useInView(ref, { amount: 0.45 });
  const { Scene } = chapter;
  return (
    <article>
      <Reveal>
        <p className="flex items-center gap-3 text-eyebrow text-muted">
          <span className="text-indigo">0{index + 1}</span>
          {chapter.kicker}
        </p>
        <h3 className="mt-4 text-display text-[1.85rem] leading-[1.1] tracking-[-0.022em] text-balance">
          {chapter.title}
        </h3>
        <p className="mt-4 text-[16px] leading-[1.65] text-pretty text-muted">
          {chapter.body}
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div
          ref={ref}
          className="glass-frame relative mt-6 h-[440px] overflow-hidden rounded-[18px] p-4 sm:h-[500px] sm:p-6"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <Aurora strength={0.55} />
            <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_25%,transparent_80%)] opacity-80" />
          </div>
          <div className="relative h-full">
            <Scene play={narrow && inView} />
          </div>
        </div>
      </Reveal>
    </article>
  );
}
