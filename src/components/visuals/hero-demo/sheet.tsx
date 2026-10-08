"use client";

import { AnimatePresence, motion } from "motion/react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { S, type DemoState } from "./timeline";

/**
 * The NDA on its sheet, set the way a short-form mutual NDA is drafted in
 * England: a reference line, the parties, numbered terms with defined
 * words in bold, and execution blocks. Everything the story does to the
 * document happens here: the read, the six fields, the amended term, the
 * signature.
 */
export function Sheet({
  state,
  crop = false,
}: {
  state: DemoState;
  /** Show only the clause that changes and the signature blocks. */
  crop?: boolean;
}) {
  const { step } = state;
  return (
    <motion.div
      /* The document opens at its title and scrolls down as Zign reads it,
         the way a viewer does, so the clause it changes and the signature
         blocks are in view for the rest of the story. */
      initial={false}
      animate={{ y: !crop && step >= S.read ? -SCROLL : 0 }}
      transition={{ duration: 1.4, ease: [0.45, 0, 0.3, 1] }}
      className={cn(
        "relative mx-auto bg-sheet font-serif leading-[1.5] text-paper-soft shadow-paper",
        /* Set justified like the printed page, except in the narrow crop,
           where justifying would open gaps between the words. */
        crop
          ? "w-[400px] rounded-t-[3px] px-9 pt-7 text-[10px]"
          : "min-h-[760px] w-[560px] rounded-t-[3px] px-11 pt-6 pb-10 text-justify text-[9px]",
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
          <Clause n="1" title="Definitions">
            <Item n="1.1">
              <Def>Confidential Information</Def> means any information
              disclosed by or on behalf of one Party (the <Def>Discloser</Def>)
              to the other (the <Def>Recipient</Def>), in any form, that is
              marked as confidential or would reasonably be regarded as
              confidential.
            </Item>
            <Item n="1.2">
              <Def>Purpose</Def> means the Parties&rsquo; evaluation of a
              possible design partnership between them.
            </Item>
          </Clause>
          <Clause n="2" title="Confidentiality">
            <Item n="2.1">
              The Recipient shall keep the Discloser&rsquo;s Confidential
              Information secret and shall not use it except for the Purpose.
            </Item>
            <Item n="2.2">
              The Recipient may disclose Confidential Information to its
              employees and professional advisers who need to know it for the
              Purpose, provided they are bound by duties of confidentiality no
              less strict than this clause 2.
            </Item>
          </Clause>
        </>
      )}

      <Clause n="3" title="Duration" first={crop}>
        <Item n="3.1">
          The obligations in clause 2 shall continue for <Term step={step} />{" "}
          from the date on which the Confidential Information is disclosed.
        </Item>
      </Clause>
      {!crop && (
        <>
          <Clause n="4" title="Governing law and jurisdiction">
            <Item n="4.1">
              This agreement and any dispute arising out of it shall be governed
              by the law of England and Wales, and the courts of England and
              Wales shall have exclusive jurisdiction.
            </Item>
          </Clause>
          <p className="mt-3.5">
            This agreement has been entered into on the date stated at the
            beginning of it.
          </p>
        </>
      )}

      <div
        className={cn("grid grid-cols-2 gap-8", crop ? "mt-6 pb-7" : "mt-5")}
      >
        <SignatureBlock
          party="Halden & Co. LLP"
          name="Hannah Brooks"
          title="Member"
          tone={0}
          state={state}
          signs
          delay={0}
        />
        <SignatureBlock
          party="Fernhill Studio Ltd"
          name="Maya Ellison"
          title="Director"
          tone={1}
          state={state}
          delay={0.18}
        />
      </div>
    </motion.div>
  );
}

/* How far the sheet scrolls, in the composition's own pixels (it is drawn
   at one fixed size): enough to bring the signature blocks into view. */
const SCROLL = 128;

/** A heading in the drafting style: bold capitals, no number. */
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

/** A defined term where it is defined: bold, inside quotation marks. */
function Def({ children }: { children: React.ReactNode }) {
  return (
    <>
      &ldquo;<b className="font-semibold text-paper-ink">{children}</b>&rdquo;
    </>
  );
}

/** A numbered paragraph with its number hanging in the margin. */
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
  title,
  tone,
  state,
  signs = false,
  delay,
}: {
  party: string;
  name: string;
  /** The signatory's office, printed in the block. */
  title: string;
  tone: 0 | 1;
  state: DemoState;
  signs?: boolean;
  delay: number;
}) {
  const placed = state.step >= S.fields;
  const signed = signs && state.step >= S.signed;
  return (
    <div>
      <p className="text-[8.5px] leading-[1.4] text-paper-muted">
        Signed for and on behalf of
      </p>
      <p className="text-[8.5px] leading-[1.4] font-semibold tracking-[0.05em] text-paper-ink uppercase">
        {party}
      </p>
      <Slot className="mt-3 h-[44px]">
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
      <div className="mt-2.5 grid grid-cols-[34px_1fr] items-center gap-y-1 text-[9px]">
        <span className="text-paper-muted">Name</span>
        <Slot className="h-[18px]">
          <FieldBox show={placed} tone={tone} delay={delay + 0.08} filled>
            <span className="absolute inset-y-0 left-1.5 flex items-center text-paper-ink">
              {name}
            </span>
          </FieldBox>
        </Slot>
        <span className="text-paper-muted">Title</span>
        <Slot className="h-[18px]">
          <span className="absolute inset-y-0 left-1.5 flex items-center text-paper-ink">
            {title}
          </span>
        </Slot>
        <span className="text-paper-muted">Date</span>
        <Slot className="h-[18px]">
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
            "absolute -inset-x-1 -top-0.5 -bottom-px rounded-[3px] border font-sans transition-[border-style,background-color] duration-500",
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
