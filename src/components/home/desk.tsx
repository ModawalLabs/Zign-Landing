"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* Hannah's mutual NDA, from the link to zigned, as one number from 0 to 1.
   Each thing in the window reads its own stretch of it. The people and
   firms are fictional. */
const NDA = {
  title: "Mutual NDA, Halden & Co.",
  from: { name: "Maya Ellison", org: "Fernhill Studio", initials: "ME" },
  you: { name: "Hannah Brooks", org: "Halden & Co.", initials: "HB" },
} as const;

const QUESTION = "What am I agreeing to?";
const ANSWER =
  "To keep what Fernhill shares with you confidential for three years, and to use it only for the design partnership. Nothing else: no exclusivity, no fees, no notice period.";

/* Where each beat lands on the way from 0 to 1. */
export const AT = {
  press1: 0.1, // the Open key is pressed
  open: 0.14, // the agreement is opened
  ask: 0.24, // the composer is picked up
  question: 0.28,
  typing: [0.32, 0.52] as const,
  press2: 0.62, // Zign it is pressed
  signing: [0.64, 0.78] as const,
  done: 0.8,
} as const;

/* The clock against the way: 0:09 once the agreement is open, 0:30 by the
   end of the answer, 0:38 when it is zigned. */
const CLOCK_X = [0, 0.06, 0.2, 0.22, 0.56, 0.6, 0.8, 1] as const;
const CLOCK_Y = [0, 0, 9, 9, 30, 30, 38, 38] as const;
export const FINAL_TIME = "0:38";

/** The clock's reading at a point on the way, as "m:ss". */
export function clockAt(p: number) {
  let i = 1;
  while (i < CLOCK_X.length - 1 && p > CLOCK_X[i]) i++;
  const t = (p - CLOCK_X[i - 1]) / (CLOCK_X[i] - CLOCK_X[i - 1]);
  const s = Math.round(
    CLOCK_Y[i - 1] +
      (CLOCK_Y[i] - CLOCK_Y[i - 1]) * Math.min(1, Math.max(0, t)),
  );
  return `0:${String(s).padStart(2, "0")}`;
}

/** True once the way has passed `at`. */
function useReached(progress: MotionValue<number>, at: number) {
  const [on, setOn] = useState(() => progress.get() >= at);
  useMotionValueEvent(progress, "change", (v) => {
    const next = v >= at;
    setOn((prev) => (prev === next ? prev : next));
  });
  return on;
}

/* The window is drawn at one fixed size and scaled to fit, so every
   hairline and gap holds its proportion at any width. Below lg it is a
   compact, portrait arrangement rather than a shrunken desktop. */
const FULL = { w: 1240, h: 700 };
const COMPACT = { w: 460, h: 640 };

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The Zign app in a window, going from a link to a zigned mutual NDA as
 * `progress` runs from 0 to 1. It is driven, never timed: the scroll (or,
 * on small screens, a clock) owns the number, so the story can be
 * scrubbed, paused or shown finished.
 */
export function Desk({ progress }: { progress: MotionValue<number> }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ width: number; compact: boolean } | null>(
    null,
  );

  useIsoLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () =>
      setBox({
        width: el.clientWidth,
        compact: !window.matchMedia("(min-width: 64rem)").matches,
      });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const size = box?.compact ? COMPACT : FULL;
  const scale = box ? box.width / size.w : 1;

  return (
    <div
      ref={frameRef}
      aria-hidden
      className={cn(
        "glass-frame relative mx-auto overflow-hidden rounded-[14px] bg-card lg:rounded-[18px]",
        "aspect-[460/640] max-w-[460px] lg:aspect-[1240/700] lg:max-w-none",
      )}
    >
      {box && (
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: size.w,
            height: size.h,
            transform: `scale(${scale})`,
          }}
        >
          {box.compact ? (
            <CompactLayout progress={progress} />
          ) : (
            <FullLayout progress={progress} />
          )}
        </div>
      )}
    </div>
  );
}

/* ── Layouts ─────────────────────────────────────────────────────────── */

function FullLayout({ progress }: { progress: MotionValue<number> }) {
  const opened = useReached(progress, AT.open);
  const done = useReached(progress, AT.done);
  return (
    <div className="relative flex h-full flex-col">
      <WindowBar progress={progress} done={done} />
      <div className="grid min-h-0 flex-1 grid-cols-[300px_1fr_276px]">
        <aside className="flex min-h-0 flex-col border-r border-line-soft bg-band px-5 pt-4 pb-5">
          <CopilotHeader />
          <Thread progress={progress} className="mt-5 flex-1" />
          <Composer progress={progress} />
        </aside>
        <div className="relative min-h-0 overflow-hidden bg-desk pt-7">
          <Sheet progress={progress} done={done} />
        </div>
        <aside className="min-h-0 border-l border-line-soft bg-card">
          <SigningPanel progress={progress} done={done} />
        </aside>
      </div>
      <Link progress={progress} opened={opened} />
    </div>
  );
}

function CompactLayout({ progress }: { progress: MotionValue<number> }) {
  const opened = useReached(progress, AT.open);
  const done = useReached(progress, AT.done);
  return (
    <div className="relative flex h-full flex-col">
      <WindowBar progress={progress} done={done} compact />
      <div className="relative min-h-0 flex-1 overflow-hidden bg-desk pt-6">
        <Sheet progress={progress} done={done} crop />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-desk to-transparent" />
      </div>
      <div className="flex h-[250px] shrink-0 flex-col border-t border-line-soft bg-band px-5 pt-4 pb-4">
        <CopilotHeader />
        <Thread progress={progress} className="mt-4 flex-1" />
      </div>
      <Link progress={progress} opened={opened} />
    </div>
  );
}

/* ── The link that starts it ─────────────────────────────────────────── */

/** The message over the window: one card, one key. Opening drops it away. */
function Link({
  progress,
  opened,
}: {
  progress: MotionValue<number>;
  opened: boolean;
}) {
  const pressed = useReached(progress, AT.press1);
  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-night/70 backdrop-blur-sm"
      initial={false}
      animate={{ opacity: opened ? 0 : 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{ pointerEvents: "none" }}
    >
      <motion.div
        className="w-[380px] rounded-[18px] bg-card p-6 shadow-panel ring-1 ring-white/[0.08]"
        initial={false}
        animate={{ y: opened ? 40 : 0, scale: opened ? 0.96 : 1 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="flex items-center gap-3">
          <Avatar initials={NDA.from.initials} tone={1} size={36} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold">{NDA.from.name}</p>
            <p className="text-[12px] text-muted">
              sent you an agreement to sign
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-[12px] bg-band p-3 ring-1 ring-white/[0.06]">
          <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-sheet">
            <span className="block h-6 w-[17px] rounded-[2px] border border-paper-line bg-sheet-band" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold">
              Mutual Non-Disclosure Agreement
            </p>
            <p className="text-[11px] text-muted">
              1 signature needed · {NDA.from.org}
            </p>
          </div>
        </div>
        <motion.span
          className="key-ink mt-4 flex h-[42px] items-center justify-center rounded-full bg-ink text-[14px] font-semibold text-paper"
          animate={{ scale: pressed ? 0.95 : 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 28 }}
        >
          Open
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

/* ── Window chrome ───────────────────────────────────────────────────── */

function WindowBar({
  progress,
  done,
  compact = false,
}: {
  progress: MotionValue<number>;
  done: boolean;
  compact?: boolean;
}) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-line-soft bg-card px-4">
      <div className="flex min-w-0 items-center gap-3">
        {!compact && (
          <span className="flex items-center gap-1 text-[12.5px] text-muted">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
              <path
                d="M10 3.5 5.5 8l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Documents
          </span>
        )}
        <span className="truncate font-serif text-[15px] font-semibold tracking-[-0.01em]">
          {NDA.title}
        </span>
        <Status done={done} />
      </div>
      <div className="flex items-center gap-3">
        {!compact && (
          <span className="font-mono text-[11px] text-subtle" data-tabular>
            &minus; 100% +
          </span>
        )}
        <ZignKey progress={progress} done={done} />
      </div>
    </div>
  );
}

function Status({ done }: { done: boolean }) {
  return (
    <span
      className={cn(
        "hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline-block",
        done ? "bg-signed/15 text-signed" : "bg-indigo-wash text-indigo-lift",
      )}
    >
      {done ? "Zigned" : "Awaiting your signature"}
    </span>
  );
}

/** The one key in the window: "Zign it", pressed, then done. */
function ZignKey({
  progress,
  done,
}: {
  progress: MotionValue<number>;
  done: boolean;
}) {
  const pressed = useReached(progress, AT.press2);
  const signing = useReached(progress, AT.signing[0]);
  return (
    <motion.span
      className={cn(
        "relative flex h-9 items-center justify-center overflow-hidden rounded-full px-4 text-[13px] font-semibold whitespace-nowrap",
        done ? "bg-signed-ink text-white" : "key-ink bg-ink text-paper",
      )}
      animate={{ scale: pressed && !signing ? 0.94 : 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 28 }}
    >
      {/* The label rolls through the key: it slides, never fades. */}
      <AnimatePresence mode="popLayout" initial={false}>
        {done ? (
          <motion.span
            key="done"
            className="flex items-center gap-1.5"
            initial={{ y: 28 }}
            animate={{ y: 0 }}
            exit={{ y: -28, transition: { duration: 0.18, ease: EASE } }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Tick />
            <span>
              Zigned in <span data-tabular>{FINAL_TIME}</span>
            </span>
          </motion.span>
        ) : (
          <motion.span
            key="ready"
            initial={{ y: 28 }}
            animate={{ y: 0 }}
            exit={{ y: -28, transition: { duration: 0.18, ease: EASE } }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            Zign it
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

/* ── Zign AI ─────────────────────────────────────────────────────────── */

function CopilotHeader() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-7 place-items-center rounded-[8px] bg-indigo-wash text-indigo-lift">
        <Spark />
      </span>
      <span className="text-[13px] font-semibold">Zign AI</span>
      <span className="breathe size-1.5 rounded-full bg-indigo" />
    </div>
  );
}

/** One question, one answer, typed as the way runs through `typing`. */
function Thread({
  progress,
  className,
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  const asked = useReached(progress, AT.question);
  const chars = useTransform(progress, [...AT.typing], [0, ANSWER.length]);
  const [typed, setTyped] = useState(() => Math.round(chars.get()));
  useMotionValueEvent(chars, "change", (v) => setTyped(Math.round(v)));

  return (
    <div className={cn("flex min-h-0 flex-col justify-end gap-3", className)}>
      <motion.p
        className="ml-8 self-end rounded-[16px] rounded-br-[6px] bg-ink px-3.5 py-2 text-[13px] leading-[1.45] font-medium text-paper"
        initial={false}
        animate={{ opacity: asked ? 1 : 0, y: asked ? 0 : 8 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {QUESTION}
      </motion.p>
      <div
        className={cn(
          "min-h-[96px] rounded-[16px] rounded-bl-[6px] bg-white/[0.05] px-3.5 py-2.5 text-[13px] leading-[1.5] text-ink-soft ring-1 ring-white/[0.06] transition-opacity duration-500",
          typed > 0 ? "opacity-100" : "opacity-0",
        )}
      >
        {ANSWER.slice(0, typed)}
        {typed > 0 && typed < ANSWER.length && (
          <span className="caret ml-px inline-block h-[14px] w-[1.5px] translate-y-[2px] bg-indigo-lift" />
        )}
      </div>
    </div>
  );
}

/** The composer, lit while the question is being put. */
function Composer({ progress }: { progress: MotionValue<number> }) {
  const asking = useReached(progress, AT.ask);
  const asked = useReached(progress, AT.question);
  return (
    <div
      className={cn(
        "mt-4 flex h-11 items-center justify-between rounded-full border bg-card pr-1.5 pl-4 text-[12.5px] transition-colors duration-500",
        asking && !asked
          ? "border-indigo/60 text-ink shadow-[0_0_0_3px_rgb(138_151_240/0.15)]"
          : "border-line text-subtle",
      )}
    >
      {asking && !asked ? (
        <span>
          {QUESTION}
          <span className="caret ml-px inline-block h-[13px] w-[1.5px] translate-y-[2px] bg-indigo-lift" />
        </span>
      ) : (
        "Ask about this agreement"
      )}
      <span className="grid size-8 place-items-center rounded-full bg-white/[0.06] text-muted">
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
          <path
            d="M8 13V3m0 0L3.5 7.5M8 3l4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

/* ── The agreement ───────────────────────────────────────────────────── */

/** The NDA on its sheet: Maya has signed, Hannah's line waits. */
function Sheet({
  progress,
  done,
  crop = false,
}: {
  progress: MotionValue<number>;
  done: boolean;
  /** Show only the clause that matters and the signature blocks. */
  crop?: boolean;
}) {
  const clip = useTransform(
    progress,
    [AT.signing[0], AT.signing[1]],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const signing = useReached(progress, AT.signing[0]);
  return (
    <div
      className={cn(
        "relative mx-auto bg-sheet font-serif leading-[1.5] text-paper-soft shadow-paper",
        crop
          ? "w-[400px] rounded-t-[3px] px-9 pt-7 text-[10px]"
          : "min-h-[720px] w-[540px] rounded-t-[3px] px-11 pt-6 pb-10 text-justify text-[9px]",
      )}
    >
      {!crop && (
        <>
          <div className="flex justify-between border-b border-paper-line pb-2 font-mono text-[7px] tracking-[0.12em] text-paper-muted uppercase">
            <span>Ref. FS/NDA/014</span>
            <span>Private &amp; confidential</span>
          </div>
          <p className="mt-6 text-center text-[14px] leading-tight font-semibold tracking-[0.08em] text-paper-ink uppercase">
            Mutual non-disclosure agreement
          </p>
          <p className="mt-2 text-center italic">
            This agreement is dated the date of the last signature below.
          </p>
          <Heading className="mt-5">Parties</Heading>
          <Item n="(1)">
            <b className="font-semibold text-paper-ink">FERNHILL STUDIO LTD</b>,
            a company incorporated in England and Wales (<Def>Fernhill</Def>);
            and
          </Item>
          <Item n="(2)">
            <b className="font-semibold text-paper-ink">HALDEN &amp; CO. LLP</b>
            , a limited liability partnership registered in England and Wales (
            <Def>Halden</Def>),
          </Item>
          <p className="mt-1">
            each a <Def>Party</Def> and together the <Def>Parties</Def>.
          </p>
          <Heading className="mt-5">Agreed terms</Heading>
          <Clause n="1" title="Confidentiality">
            <Item n="1.1">
              Each Party shall keep the other&rsquo;s Confidential Information
              secret and shall not use it except for the Purpose: the
              Parties&rsquo; evaluation of a possible design partnership.
            </Item>
          </Clause>
        </>
      )}

      <Clause n="2" title="Duration" first={crop}>
        <Item n="2.1">
          The obligations in clause 1 shall continue for three (3) years from
          the date on which the Confidential Information is disclosed.
        </Item>
      </Clause>
      {!crop && (
        <Clause n="3" title="Governing law">
          <Item n="3.1">
            This agreement is governed by the law of England and Wales, whose
            courts have exclusive jurisdiction.
          </Item>
        </Clause>
      )}

      <div
        className={cn("grid grid-cols-2 gap-8", crop ? "mt-6 pb-7" : "mt-6")}
      >
        <Block
          party="Fernhill Studio Ltd"
          name={NDA.from.name}
          title="Director"
          signed
        />
        <Block
          party="Halden & Co. LLP"
          name={NDA.you.name}
          title="Member"
          clip={signing ? clip : undefined}
          signed={done}
        />
      </div>
    </div>
  );
}

function Heading({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-semibold tracking-[0.06em] text-paper-ink uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}

function Def({ children }: { children: React.ReactNode }) {
  return (
    <>
      &ldquo;<b className="font-semibold text-paper-ink">{children}</b>&rdquo;
    </>
  );
}

function Item({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mt-1 grid grid-cols-[22px_1fr]">
      <span className="text-paper-ink">{n}</span>
      <p>{children}</p>
    </div>
  );
}

function Clause({
  n,
  title,
  first = false,
  children,
}: {
  n: string;
  title: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={first ? "" : "mt-3"}>
      <Heading className="grid grid-cols-[22px_1fr]">
        <span>{n}.</span>
        <span>{title}</span>
      </Heading>
      {children}
    </div>
  );
}

/** A signature block. `clip` is set while the name is being written. */
function Block({
  party,
  name,
  title,
  clip,
  signed,
}: {
  party: string;
  name: string;
  title: string;
  clip?: MotionValue<string>;
  signed: boolean;
}) {
  const waiting = clip === undefined && !signed;
  return (
    <div className="font-sans">
      <p className="text-[8.5px] leading-[1.4] text-paper-muted">
        Signed for and on behalf of
      </p>
      <p className="text-[8.5px] leading-[1.4] font-semibold tracking-[0.05em] text-paper-ink uppercase">
        {party}
      </p>
      <div className="relative mt-3 h-[44px] border-b border-paper-line">
        {waiting && (
          <div className="absolute inset-x-[-4px] -top-0.5 -bottom-px rounded-[3px] border border-dashed border-indigo-ink/55 bg-indigo-ink/[0.045]">
            <span className="absolute -top-[7px] left-1.5 bg-sheet px-1 text-[7px] leading-[12px] font-semibold tracking-[0.06em] text-indigo-ink uppercase">
              Signature · {name.split(" ")[0]}
            </span>
          </div>
        )}
        {!waiting && (
          <motion.span
            className="absolute bottom-[3px] left-2 font-script text-[28px] leading-none whitespace-nowrap text-indigo-ink"
            style={clip ? { clipPath: clip } : undefined}
          >
            {name}
          </motion.span>
        )}
      </div>
      <div className="mt-2.5 grid grid-cols-[34px_1fr] items-center gap-y-1 text-[9px]">
        <span className="text-paper-muted">Name</span>
        <span className="border-b border-paper-line pb-0.5 text-paper-ink">
          {name}
        </span>
        <span className="text-paper-muted">Title</span>
        <span className="border-b border-paper-line pb-0.5 text-paper-ink">
          {title}
        </span>
      </div>
    </div>
  );
}

/* ── Signing order, checks and the record ────────────────────────────── */

function SigningPanel({
  progress,
  done,
}: {
  progress: MotionValue<number>;
  done: boolean;
}) {
  const opened = useReached(progress, AT.open);
  const asked = useReached(progress, AT.question);
  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <div>
        <PanelHeading title="Signing order" aside="2 signers" />
        <div className="mt-3 space-y-2.5">
          <Signer
            initials={NDA.from.initials}
            name={NDA.from.name}
            org={NDA.from.org}
            tone={1}
            status={{ label: "Signed", kind: "signed" }}
          />
          <Signer
            initials={NDA.you.initials}
            name={NDA.you.name}
            org="You"
            tone={0}
            status={
              done
                ? { label: "Signed", kind: "signed" }
                : { label: "Your turn", kind: "live" }
            }
          />
        </div>
      </div>

      <div>
        <PanelHeading title="Checks" aside="4 of 4" />
        <ul className="mt-3 space-y-2 text-[11.5px]">
          {[
            "Parties named",
            "Signature blocks",
            "Governing law",
            "Confidentiality term",
          ].map((label) => (
            <li key={label} className="flex items-center gap-2 text-ink-soft">
              <span className="grid size-[15px] place-items-center rounded-full bg-signed/15 text-signed">
                <Tick size={9} />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <PanelHeading title="Record" />
        <ol className="mt-3 space-y-2 text-[11.5px]">
          <RecordLine show={opened} time="0:00">
            Opened by {NDA.you.name}
          </RecordLine>
          <RecordLine show={asked} time="0:09">
            Asked Zign AI
          </RecordLine>
          <RecordLine show={done} time={FINAL_TIME}>
            Signed by {NDA.you.name}
          </RecordLine>
        </ol>
      </div>
    </div>
  );
}

function PanelHeading({ title, aside }: { title: string; aside?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <p className="text-eyebrow text-muted">{title}</p>
      {aside && (
        <span className="font-mono text-[10.5px] text-subtle" data-tabular>
          {aside}
        </span>
      )}
    </div>
  );
}

function Signer({
  initials,
  name,
  org,
  tone,
  status,
}: {
  initials: string;
  name: string;
  org: string;
  tone: 0 | 1;
  status: { label: string; kind: "signed" | "live" };
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar initials={initials} tone={tone} size={30} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium">{name}</p>
        <p className="text-[10.5px] text-muted">{org}</p>
      </div>
      <span
        className={cn(
          "inline-flex h-6 items-center gap-1 rounded-full px-2 text-[10.5px] font-medium",
          status.kind === "signed"
            ? "bg-signed/15 text-signed"
            : "bg-indigo-wash text-indigo-lift",
        )}
      >
        {status.kind === "signed" ? (
          <Tick size={9} />
        ) : (
          <span className="breathe size-1.5 rounded-full bg-indigo" />
        )}
        {status.label}
      </span>
    </div>
  );
}

function RecordLine({
  show,
  time,
  children,
}: {
  show: boolean;
  time: string;
  children: React.ReactNode;
}) {
  return (
    <motion.li
      className="flex items-center gap-2.5"
      initial={false}
      animate={{ opacity: show ? 1 : 0, x: show ? 0 : -6 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <span className="size-1.5 shrink-0 rounded-full border border-indigo" />
      <span className="flex-1 text-ink-soft">{children}</span>
      <span className="font-mono text-[10.5px] text-subtle" data-tabular>
        {time}
      </span>
    </motion.li>
  );
}

/* ── Small parts ─────────────────────────────────────────────────────── */

function Avatar({
  initials,
  tone,
  size,
}: {
  initials: string;
  tone: 0 | 1;
  size: number;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold",
        tone === 0
          ? "bg-indigo-wash text-indigo-lift"
          : "bg-white/[0.08] text-ink-soft",
      )}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </span>
  );
}

function Tick({ size = 11 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} fill="none">
      <path
        d="m2.5 6.2 2.3 2.3 4.7-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
      <path d="M8 1.5c.4 2.9 1.7 4.6 4.6 5.1v.8C9.7 7.9 8.4 9.6 8 12.5h-.8C6.8 9.6 5.5 7.9 2.6 7.4v-.8C5.5 6.1 6.8 4.4 7.2 1.5H8Z" />
    </svg>
  );
}
