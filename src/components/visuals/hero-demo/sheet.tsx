"use client";

import { AnimatePresence, motion } from "motion/react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { S, type DemoState } from "./timeline";

/**
 * The NDA on its sheet. Everything the story does to the document happens
 * here: the read, the six fields, the amended term, the signature.
 */
export function Sheet({
  state,
  crop = false,
}: {
  state: DemoState;
  /** Show only the clause that changes and the signature block. */
  crop?: boolean;
}) {
  const { step } = state;
  return (
    <div
      className={cn(
        "relative mx-auto bg-sheet text-[10.5px] leading-[1.62] text-paper-soft shadow-paper",
        crop
          ? "w-[400px] rounded-t-[3px] px-9 pt-7"
          : "min-h-[760px] w-[520px] rounded-t-[3px] px-12 pt-11 pb-10",
      )}
    >
      <AnimatePresence>
        {step === S.read && (
          <motion.div
            key="scan"
            aria-hidden
            className="pointer-events-none absolute inset-x-0 z-10 h-28"
            initial={{ top: "-14%", opacity: 0 }}
            animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.45, ease: [0.45, 0, 0.3, 1] }}
            style={{
              background:
                "linear-gradient(to bottom, rgb(56 75 199 / 0) 0%, rgb(56 75 199 / 0.07) 82%, rgb(56 75 199 / 0.55) 99%, rgb(56 75 199 / 0) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {!crop && (
        <>
          <p className="text-center font-serif text-[19px] leading-tight font-semibold tracking-[-0.01em] text-paper-ink">
            Mutual Non-Disclosure Agreement
          </p>
          <p className="mt-4">
            This Agreement is made on the Effective Date between{" "}
            <b className="font-semibold text-paper-ink">Fernhill Studio Ltd</b>{" "}
            (&ldquo;Fernhill&rdquo;) and{" "}
            <b className="font-semibold text-paper-ink">Halden &amp; Co. LLP</b>{" "}
            (&ldquo;Halden&rdquo;), each a &ldquo;Party&rdquo;.
          </p>
          <Clause n="1" title="Purpose">
            The Parties wish to explore a design partnership (the
            &ldquo;Purpose&rdquo;) and will share information with each other in
            order to do so.
          </Clause>
          <Clause n="2" title="Confidential Information">
            Any information disclosed by one Party to the other, in any form,
            that is marked confidential or would reasonably be understood to be
            so.
          </Clause>
        </>
      )}

      <Clause n="3" title="Term" first={crop}>
        Each Party shall keep the other&rsquo;s Confidential Information secret
        for <Term step={step} /> from the date it is disclosed, and use it only
        for the Purpose.
      </Clause>
      <Clause n="4" title="Governing law">
        This Agreement is governed by the laws of England and Wales.
      </Clause>

      <div
        className={cn("grid grid-cols-2 gap-8", crop ? "mt-6 pb-7" : "mt-7")}
      >
        <SignatureBlock
          party="Halden & Co. LLP"
          name="Hannah Brooks"
          tone={0}
          state={state}
          signs
          delay={0}
        />
        <SignatureBlock
          party="Fernhill Studio Ltd"
          name="Maya Ellison"
          tone={1}
          state={state}
          delay={0.18}
        />
      </div>
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
    <div className={first ? "" : "mt-4"}>
      <p className="font-serif text-[11.5px] font-semibold text-paper-ink">
        {n}. {title}
      </p>
      <p className="mt-1">{children}</p>
    </div>
  );
}

/** Clause 3's term: flagged while Zign asks, then struck and replaced. */
function Term({ step }: { step: number }) {
  const flagged = step >= S.flag && step < S.amended;
  const amended = step >= S.amended;
  return (
    <span className="relative">
      <span
        className={cn(
          "relative rounded-[2px] px-[1px] transition-[background-color,box-shadow,color] duration-500",
          flagged &&
            "bg-pending-ink/12 shadow-[inset_0_-1px_0_rgb(160_99_28/0.55)]",
          amended && "text-paper-subtle",
        )}
      >
        one (1) year
        {amended && (
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-[55%] h-px origin-left bg-paper-subtle"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
          />
        )}
      </span>
      {amended && (
        <motion.span
          className="redline-ins ml-1 inline-block px-[1px]"
          initial={{ opacity: 0, y: 3, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
        >
          three (3) years
        </motion.span>
      )}
    </span>
  );
}

const TONE = {
  0: {
    box: "border-indigo-ink/55 bg-indigo-ink/[0.045]",
    chip: "text-indigo-ink",
  },
  1: {
    box: "border-paper-ink/35 bg-paper-ink/[0.025]",
    chip: "text-paper-soft",
  },
} as const;

function SignatureBlock({
  party,
  name,
  tone,
  state,
  signs = false,
  delay,
}: {
  party: string;
  name: string;
  tone: 0 | 1;
  state: DemoState;
  signs?: boolean;
  delay: number;
}) {
  const placed = state.step >= S.fields;
  const signed = signs && state.step >= S.signed;
  return (
    <div>
      <p className="text-[7.5px] font-medium tracking-[0.12em] text-paper-muted uppercase">
        For {party}
      </p>
      <Slot className="mt-2 h-[46px]">
        <FieldBox
          show={placed}
          tone={tone}
          label={`Signature · ${name.split(" ")[0]}`}
          delay={delay}
          filled={signed}
        >
          {signed && (
            <motion.span
              className="absolute bottom-[3px] left-2 font-script text-[30px] leading-none whitespace-nowrap text-indigo-ink"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.5, ease: [0.5, 0, 0.3, 1] }}
            >
              {name}
            </motion.span>
          )}
        </FieldBox>
      </Slot>
      <div className="mt-2.5 grid grid-cols-[34px_1fr] items-center gap-y-1.5 text-[9.5px]">
        <span className="text-paper-muted">Name</span>
        <Slot className="h-[19px]">
          <FieldBox show={placed} tone={tone} delay={delay + 0.08} filled>
            <span className="absolute inset-y-0 left-1.5 flex items-center text-paper-ink">
              {name}
            </span>
          </FieldBox>
        </Slot>
        <span className="text-paper-muted">Date</span>
        <Slot className="h-[19px]">
          <FieldBox
            show={placed}
            tone={tone}
            delay={delay + 0.16}
            filled={signed}
          >
            {signed && state.date && (
              <motion.span
                className="absolute inset-y-0 left-1.5 flex items-center font-mono text-[9px] text-paper-ink"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                data-tabular
              >
                {state.date}
              </motion.span>
            )}
          </FieldBox>
        </Slot>
      </div>
    </div>
  );
}

/** The printed line a field sits on before anything is placed. */
function Slot({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative border-b border-paper-line", className)}>
      {children}
    </div>
  );
}

function FieldBox({
  show,
  tone,
  label,
  delay,
  filled = false,
  children,
}: {
  show: boolean;
  tone: 0 | 1;
  label?: string;
  delay: number;
  filled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn(
            "absolute -inset-x-1 -top-0.5 -bottom-px rounded-[3px] border transition-[border-style,background-color] duration-500",
            TONE[tone].box,
            filled ? "border-solid" : "border-dashed",
          )}
          initial={{ opacity: 0, scale: 0.94, filter: "blur(2px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.55, ease: EASE, delay }}
        >
          {label && (
            <span
              className={cn(
                "absolute -top-[7px] left-1.5 bg-sheet px-1 text-[7px] leading-[12px] font-semibold tracking-[0.06em] uppercase",
                TONE[tone].chip,
              )}
            >
              {label}
            </span>
          )}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
