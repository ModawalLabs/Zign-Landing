"use client";

import { AnimatePresence, motion } from "motion/react";

import { Avatar, type PersonName } from "@/components/ui/person";
import { SignatureMark } from "@/components/ui/signature-mark";
import { EASE } from "@/lib/motion";
import { useBeats } from "@/lib/use-beats";
import { cn } from "@/lib/utils";

export type Signer = {
  name: string;
  role: string;
  person: PersonName;
  tint: string;
};

/* The score, in milliseconds from the moment the sheet is seen: the two
   signers arrive, the first signs and is ticked, then the second, then
   the seal lands. */
const SCORE = [350, 500, 800, 1850, 2050, 3100, 3350] as const;
const B = {
  signer1: 1,
  signer2: 2,
  sign1: 3,
  tick1: 4,
  sign2: 5,
  tick2: 6,
  seal: 7,
} as const;

/**
 * An agreement being signed, as a performance: a white sheet rises into
 * view, its two signers appear at its corners, each signs in turn and is
 * ticked, and (on the wide sheet) a seal lands when it is done. It plays
 * while `play` is true and resets when it is not, so it plays again the
 * next time it is seen. Under reduced motion it is simply finished.
 */
export function SignedSheet({
  heading,
  signers,
  wide = false,
  play,
  reduce,
  className,
}: {
  heading: string;
  signers: [Signer, Signer];
  /** The wedding's size, with the seal; otherwise the small sheet. */
  wide?: boolean;
  play: boolean;
  reduce: boolean;
  className?: string;
}) {
  const played = useBeats(play, SCORE, reduce);
  /* Under reduced motion it is finished whether or not it has been seen. */
  const beat = reduce ? SCORE.length : played;
  const on = (b: number) => beat >= b;
  const w = wide ? 340 : 240;
  const h = wide ? 420 : 320;

  return (
    <div
      className={cn("relative", className)}
      style={{ width: w, height: wide ? h : h - 28 }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 rounded-[18px] bg-sheet text-paper-soft shadow-[0_50px_100px_-30px_rgb(0_0_0/0.85),0_0_0_1px_rgb(0_0_0/0.06)]"
        style={{ height: h, padding: wide ? "36px 34px" : "26px 24px" }}
        initial={false}
        animate={play || reduce ? { y: 0, opacity: 1 } : { y: 48, opacity: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <p
          className={cn(
            "text-center font-serif leading-tight font-semibold tracking-[-0.01em] text-paper-ink",
            wide ? "text-[22px]" : "text-[16px]",
          )}
        >
          {heading}
        </p>
        <span className="mx-auto mt-2.5 block h-px w-9 bg-paper-line" />
        <div
          className={cn(
            "space-y-[8px]",
            wide ? "mt-6 text-[12px]" : "mt-4 text-[10px]",
          )}
        >
          <div className="type-line w-full" />
          <div className="type-line w-[92%]" />
          <div className="type-line w-full" />
          <div className="type-line w-[68%]" />
          {wide && (
            <>
              <div className="type-line w-full" />
              <div className="type-line w-[85%]" />
              <div className="type-line w-[44%]" />
            </>
          )}
        </div>

        <div
          className={cn(
            "absolute inset-x-0 grid grid-cols-2",
            wide ? "bottom-9 gap-6 px-[34px]" : "bottom-14 gap-4 px-6",
          )}
        >
          <SignatureLine
            signer={signers[0]}
            signed={on(B.sign1)}
            ticked={on(B.tick1)}
            wide={wide}
          />
          <SignatureLine
            signer={signers[1]}
            signed={on(B.sign2)}
            ticked={on(B.tick2)}
            wide={wide}
          />
        </div>

        {wide && (
          <AnimatePresence>
            {on(B.seal) && (
              <motion.span
                aria-hidden
                className="absolute right-7 bottom-[108px] grid size-[88px] place-items-center rounded-full border-[3px] border-indigo-ink/70 text-indigo-ink"
                initial={{ scale: 1.6, opacity: 0, rotate: -14 }}
                animate={{ scale: 1, opacity: 1, rotate: -8 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 18 }}
              >
                <span className="absolute inset-[5px] rounded-full border border-indigo-ink/40" />
                <SignatureMark size={44} strokeWidth={8} />
                <span className="absolute bottom-[13px] font-mono text-[7px] font-semibold tracking-[0.2em] uppercase">
                  Zigned
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      <Portrait
        signer={signers[0]}
        show={on(B.signer1)}
        ticked={on(B.tick1)}
        className={
          wide
            ? "top-[52px] -left-[72px] size-[120px]"
            : "top-[30px] -left-[52px] size-[92px] sm:-left-[62px] sm:size-[100px]"
        }
      />
      <Portrait
        signer={signers[1]}
        show={on(B.signer2)}
        ticked={on(B.tick2)}
        className={
          wide
            ? "top-[232px] -right-[72px] size-[120px]"
            : "top-[150px] -right-[52px] size-[92px] sm:-right-[62px] sm:size-[100px]"
        }
      />
    </div>
  );
}

function SignatureLine({
  signer,
  signed,
  ticked,
  wide,
}: {
  signer: Signer;
  signed: boolean;
  ticked: boolean;
  wide: boolean;
}) {
  return (
    <div>
      <div
        className={cn(
          "relative border-b border-paper-line",
          wide ? "h-[46px]" : "h-[36px]",
        )}
      >
        <AnimatePresence>
          {signed && (
            <motion.span
              key="name"
              className={cn(
                "absolute bottom-[3px] left-0.5 font-script leading-none whitespace-nowrap text-indigo-ink",
                wide ? "text-[26px]" : "text-[19px]",
              )}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.5, 0, 0.3, 1] }}
            >
              {signer.name}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <p
        className={cn(
          "mt-1 flex items-center gap-1 font-medium tracking-[0.08em] text-paper-muted uppercase",
          wide ? "text-[8.5px]" : "text-[7px]",
        )}
      >
        {signer.role}
        {ticked && (
          <motion.svg
            viewBox="0 0 12 12"
            width={wide ? 10 : 8}
            height={wide ? 10 : 8}
            fill="none"
            className="text-signed-ink"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
          >
            <path
              d="m2.5 6.2 2.3 2.3 4.7-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </p>
    </div>
  );
}

function Portrait({
  signer,
  show,
  ticked,
  className,
}: {
  signer: Signer;
  show: boolean;
  ticked: boolean;
  className: string;
}) {
  return (
    <motion.div
      className={cn("absolute", className)}
      initial={false}
      animate={show ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Avatar
        name={signer.person}
        tint={signer.tint}
        signed={ticked}
        className="size-full"
      />
    </motion.div>
  );
}
