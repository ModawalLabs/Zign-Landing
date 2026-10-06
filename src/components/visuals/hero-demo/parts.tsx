"use client";

import { AnimatePresence, motion } from "motion/react";
import { forwardRef } from "react";

import { SignatureMark } from "@/components/ui/signature-mark";
import { Tick } from "@/components/ui/tick";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { S, type DemoState } from "./timeline";

const appear = {
  initial: { opacity: 0, y: 10, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, transition: { duration: 0.2 } },
  transition: { duration: 0.6, ease: EASE },
} as const;

/* ── Copilot ──────────────────────────────────────────────────────────── */

export const Thread = forwardRef<
  HTMLSpanElement,
  { state: DemoState; latestOnly?: boolean }
>(function Thread({ state, latestOnly = false }, chipRef) {
  const { step } = state;

  const items: {
    key: string;
    at: number;
    until?: number;
    node: React.ReactNode;
  }[] = [
    {
      key: "ask",
      at: S.ask,
      node: (
        <Mine>
          Prepare this for Hannah at Halden. I&rsquo;ll countersign after her.
        </Mine>
      ),
    },
    {
      key: "reading",
      at: S.read,
      until: S.placed,
      node: <Thinking>Reading four clauses</Thinking>,
    },
    {
      key: "placed",
      at: S.placed,
      node: (
        <Reply>
          Six fields placed for two signers. Hannah Brooks signs first, then
          you.
        </Reply>
      ),
    },
    {
      key: "flag",
      at: S.flag,
      node: (
        <Reply>
          One thing before it goes. Clause 3 keeps information confidential for{" "}
          <b className="font-semibold text-ink">one year</b>; your other partner
          NDAs use three.
          {step < S.amended && (
            <span className="mt-2.5 flex flex-wrap gap-1.5">
              <Chip ref={chipRef} pressed={step >= S.press}>
                Make it three years
              </Chip>
              <Chip>Leave it at one</Chip>
            </span>
          )}
        </Reply>
      ),
    },
    {
      key: "choice",
      at: S.amended,
      node: <Mine>Make it three years</Mine>,
    },
    {
      key: "amended",
      at: S.amended,
      node: (
        <Reply done="Change made">
          Clause 3 now reads three (3) years. Ready to send.
        </Reply>
      ),
    },
    {
      key: "sent",
      at: S.sent,
      node: (
        <Reply>Sent to Hannah. I&rsquo;ll tell you the moment she signs.</Reply>
      ),
    },
    {
      key: "signed",
      at: S.signed,
      node: (
        <Reply done="Hannah signed">
          Your turn. One signature and it&rsquo;s settled.
        </Reply>
      ),
    },
  ];

  const visible = items.filter(
    (m) => step >= m.at && (m.until === undefined || step < m.until),
  );
  const shown = latestOnly ? visible.slice(-2) : visible;

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col justify-end gap-4 overflow-hidden",
        !latestOnly &&
          "[mask-image:linear-gradient(to_bottom,transparent,#000_18%)]",
      )}
    >
      <AnimatePresence initial={false} mode="sync">
        {shown.map((m) => (
          <motion.div key={m.key} layout="position" {...appear}>
            {m.node}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

export function CopilotHeader() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-6 place-items-center rounded-md bg-indigo/10">
        <SignatureMark size={15} strokeWidth={9} className="text-indigo" />
      </span>
      <span className="text-[12.5px] font-semibold text-ink">Zign AI</span>
      <span className="size-1.5 rounded-full bg-indigo/70" />
    </div>
  );
}

export function Composer() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-card py-2 pr-2 pl-3.5 shadow-subtle">
      <span className="flex-1 text-[12px] text-subtle">
        Ask about this agreement
      </span>
      <span className="grid size-7 place-items-center rounded-full bg-desk text-muted">
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden>
          <path
            d="M8 13V3m0 0L4 7m4-4 4 4"
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

function Mine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[88%] rounded-[14px] rounded-br-[4px] bg-ink px-3 py-2 text-[12px] leading-[1.5] text-paper">
        {children}
      </p>
    </div>
  );
}

function Reply({
  children,
  done,
}: {
  children: React.ReactNode;
  done?: string;
}) {
  return (
    <div className="text-[12px] leading-[1.6] text-ink-soft">
      {done && (
        <p className="mb-1 flex items-center gap-1.5 text-[9.5px] font-medium tracking-[0.09em] text-indigo uppercase">
          <Tick className="size-2.5" />
          {done}
        </p>
      )}
      {children}
    </div>
  );
}

function Thinking({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[12px] text-muted">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="breathe size-1 rounded-full bg-indigo"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </span>
      {children}
    </p>
  );
}

const Chip = forwardRef<
  HTMLSpanElement,
  { children: React.ReactNode; pressed?: boolean }
>(function Chip({ children, pressed = false }, ref) {
  return (
    <motion.span
      ref={ref}
      animate={pressed ? { scale: [1, 0.94, 1] } : { scale: 1 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] transition-colors duration-300",
        pressed
          ? "border-indigo bg-indigo text-night"
          : "border-line bg-card text-ink-soft",
      )}
    >
      {children}
    </motion.span>
  );
});

/* ── Signing panel ────────────────────────────────────────────────────── */

export function SigningPanel({ state }: { state: DemoState }) {
  const { step } = state;
  const known = step >= S.placed;
  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <div>
        <PanelHeading
          title="Signing order"
          aside={known ? "2 signers" : undefined}
        />
        <div className="mt-3 space-y-2.5">
          {known ? (
            <>
              <Signer
                initials="HB"
                name="Hannah Brooks"
                org="Halden & Co."
                tone={0}
                status={
                  step >= S.signed
                    ? { label: "Signed", kind: "signed" }
                    : step >= S.sent
                      ? { label: "Opened", kind: "live" }
                      : { label: "First", kind: "idle" }
                }
                delay={0}
              />
              <Signer
                initials="ME"
                name="Maya Ellison"
                org="You"
                tone={1}
                status={
                  step >= S.signed
                    ? { label: "Your turn", kind: "live" }
                    : { label: "Second", kind: "idle" }
                }
                delay={0.1}
              />
            </>
          ) : (
            <>
              <Ghost />
              <Ghost />
            </>
          )}
        </div>
      </div>

      <div>
        <PanelHeading
          title="Checks"
          aside={
            step >= S.amended ? "4 of 4" : step >= S.flag ? "3 of 4" : undefined
          }
        />
        <ul className="mt-3 space-y-2 text-[11.5px]">
          <Check
            label="Parties named"
            state={known ? "pass" : step >= S.read ? "busy" : "wait"}
          />
          <Check
            label="Signature blocks"
            state={known ? "pass" : step >= S.read ? "busy" : "wait"}
          />
          <Check
            label="Governing law"
            state={known ? "pass" : step >= S.read ? "busy" : "wait"}
          />
          <Check
            label="Confidentiality term"
            note={
              step >= S.amended
                ? "3 years"
                : step >= S.flag
                  ? "1 year"
                  : undefined
            }
            state={
              step >= S.amended
                ? "pass"
                : step >= S.flag
                  ? "flag"
                  : step >= S.read
                    ? "busy"
                    : "wait"
            }
          />
        </ul>
      </div>

      <div className="mt-auto">
        <PanelHeading title="Record" />
        <ol className="relative mt-3 space-y-2.5 border-l border-line-soft pl-3.5">
          <AnimatePresence initial={false}>
            {[
              { at: S.placed, text: "Prepared with Zign AI" },
              { at: S.amended, text: "Clause 3 amended" },
              { at: S.sent, text: "Sent to Hannah Brooks" },
              { at: S.signed, text: "Signed by Hannah Brooks" },
            ]
              .filter((e) => step >= e.at)
              .map((e) => (
                <motion.li
                  key={e.text}
                  {...appear}
                  className="relative flex items-baseline justify-between gap-3 text-[11px] text-ink-soft"
                >
                  <span className="absolute top-[5px] -left-[17.5px] size-[6px] rounded-full border border-indigo bg-card" />
                  {e.text}
                  <span
                    className="font-mono text-[9.5px] text-subtle"
                    data-tabular
                  >
                    {state.time}
                  </span>
                </motion.li>
              ))}
          </AnimatePresence>
        </ol>
      </div>
    </div>
  );
}

function PanelHeading({ title, aside }: { title: string; aside?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line-soft pb-2">
      <span className="text-[9.5px] font-medium tracking-[0.09em] text-muted uppercase">
        {title}
      </span>
      {aside && (
        <motion.span
          key={aside}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[9.5px] text-subtle"
          data-tabular
        >
          {aside}
        </motion.span>
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
  delay,
}: {
  initials: string;
  name: string;
  org: string;
  tone: 0 | 1;
  status: { label: string; kind: "idle" | "live" | "signed" };
  delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-2.5"
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      <span
        className={cn(
          "grid size-7 shrink-0 place-items-center rounded-full text-[9.5px] font-semibold",
          tone === 0 ? "bg-indigo text-night" : "bg-ink text-paper",
        )}
      >
        {initials}
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-[12px] font-medium text-ink">
          {name}
        </span>
        <span className="block truncate text-[10.5px] text-muted">{org}</span>
      </span>
      <motion.span
        key={status.label}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
          status.kind === "signed" && "bg-signed/10 text-signed",
          status.kind === "live" && "bg-indigo/10 text-indigo",
          status.kind === "idle" && "bg-desk text-muted",
        )}
      >
        {status.kind === "signed" && <Tick className="size-2.5" />}
        {status.kind === "live" && (
          <span className="breathe size-1.5 rounded-full bg-indigo" />
        )}
        {status.label}
      </motion.span>
    </motion.div>
  );
}

function Ghost() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="size-7 rounded-full bg-desk" />
      <span className="flex-1 space-y-1.5">
        <span className="block h-2 w-24 rounded-full bg-desk" />
        <span className="block h-1.5 w-14 rounded-full bg-line-soft" />
      </span>
    </div>
  );
}

function Check({
  label,
  note,
  state,
}: {
  label: string;
  note?: string;
  state: "wait" | "busy" | "pass" | "flag";
}) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="relative grid size-4 place-items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={state}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={cn(
              "absolute inset-0 grid place-items-center rounded-full",
              state === "wait" && "border border-line",
              state === "busy" && "border border-indigo/40",
              state === "pass" && "bg-signed text-night",
              state === "flag" && "bg-pending text-night",
            )}
          >
            {state === "pass" && <Tick className="size-2" />}
            {state === "flag" && (
              <span className="text-[9px] leading-none font-bold">!</span>
            )}
            {state === "busy" && (
              <span className="breathe size-1.5 rounded-full bg-indigo" />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      <span
        className={cn(
          "flex-1",
          state === "wait" ? "text-subtle" : "text-ink-soft",
        )}
      >
        {label}
      </span>
      {note && (
        <motion.span
          key={note}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "font-mono text-[10px]",
            state === "flag" ? "text-pending" : "text-subtle",
          )}
          data-tabular
        >
          {note}
        </motion.span>
      )}
    </li>
  );
}

/* ── Window bar ───────────────────────────────────────────────────────── */

export const WindowBar = forwardRef<
  HTMLSpanElement,
  { state: DemoState; compact?: boolean }
>(function WindowBar({ state, compact = false }, sendRef) {
  const { step } = state;
  const status =
    step >= S.signed
      ? { label: "1 of 2 signed", tone: "indigo" }
      : step >= S.sent
        ? { label: "Out for signature", tone: "indigo" }
        : { label: "Draft", tone: "muted" };
  return (
    <div className="flex h-[52px] shrink-0 items-center gap-3 border-b border-line-soft bg-card px-4">
      {!compact && (
        <span className="flex items-center gap-1 text-[12px] text-muted">
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="none"
            aria-hidden
          >
            <path
              d="M10 3 5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Documents
        </span>
      )}
      {!compact && <span className="h-4 w-px bg-line" />}
      <span className="truncate font-serif text-[14px] font-semibold text-ink">
        Mutual NDA, Halden &amp; Co.
      </span>
      <motion.span
        key={status.label}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium",
          status.tone === "indigo"
            ? "bg-indigo/10 text-indigo"
            : "bg-desk text-muted",
        )}
        data-tabular
      >
        {status.label}
      </motion.span>

      {!compact && (
        <div className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-md px-2 py-1 font-mono text-[11px] text-muted">
            <span aria-hidden>&minus;</span>
            100%
            <span aria-hidden>+</span>
          </span>
          <span className="h-4 w-px bg-line" />
          <motion.span
            ref={sendRef}
            animate={step === S.sent ? { scale: [1, 0.95, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[12px] font-medium transition-colors duration-500",
              step >= S.sent
                ? "border border-line bg-card text-ink-soft"
                : "key-ink bg-ink text-paper",
            )}
          >
            {step >= S.sent ? (
              <>
                <Tick className="size-3 text-signed" /> Sent
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 16 16"
                  width="12"
                  height="12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M14 2 7 9m7-7-4.5 12L7 9 2 6.5 14 2Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
                Send for signing
              </>
            )}
          </motion.span>
        </div>
      )}
    </div>
  );
});
