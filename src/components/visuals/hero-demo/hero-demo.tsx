"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

import {
  Composer,
  CopilotHeader,
  SigningPanel,
  Thread,
  WindowBar,
} from "./parts";
import { Sheet } from "./sheet";
import { S, useStory, type DemoState } from "./timeline";

/* The composition is drawn at one fixed size and scaled to fit, so every
   hairline and gap holds its proportion at any width. Below lg it switches
   to a portrait arrangement rather than shrinking past legibility. */
const FULL = { w: 1240, h: 700 };
const COMPACT = { w: 460, h: 640 };

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function HeroDemo({ className }: { className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { once: true, amount: 0.25 });
  const reduce = usePrefersReducedMotion();
  const { state, replay, done } = useStory(inView, reduce);

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
    <figure
      className={cn("relative", className)}
      aria-label="Zign preparing a mutual NDA: it reads the agreement, places six signature fields, flags a one-year confidentiality term and changes it to three years, sends it to Hannah Brooks, and records her signature."
    >
      <div
        ref={frameRef}
        aria-hidden
        className={cn(
          "glass-frame relative mx-auto overflow-hidden rounded-[14px] bg-card lg:rounded-[18px]",
          "aspect-[460/640] max-w-[560px] lg:aspect-[1240/700] lg:max-w-none",
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
              <CompactLayout state={state} />
            ) : (
              <FullLayout state={state} scale={scale} />
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex h-8 justify-end">
        <AnimatePresence>
          {done && !reduce && (
            <motion.button
              type="button"
              onClick={replay}
              initial={{ opacity: 0, y: -4 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 1.6, duration: 0.6, ease: EASE },
              }}
              exit={{ opacity: 0 }}
              className="group inline-flex items-center gap-2 rounded-full px-3 font-mono text-[11.5px] text-muted transition-colors hover:text-ink"
            >
              <svg
                viewBox="0 0 16 16"
                width="12"
                height="12"
                fill="none"
                aria-hidden
                className="transition-transform duration-500 ease-(--ease-settle) group-hover:-rotate-180"
              >
                <path
                  d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3h-3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Replay
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </figure>
  );
}

function FullLayout({ state, scale }: { state: DemoState; scale: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const sendRef = useRef<HTMLSpanElement>(null);

  return (
    <div ref={rootRef} className="relative flex h-full flex-col">
      <WindowBar state={state} ref={sendRef} />
      <div className="grid min-h-0 flex-1 grid-cols-[300px_1fr_276px]">
        <aside className="flex min-h-0 flex-col gap-4 border-r border-line-soft bg-band px-5 pt-4 pb-5">
          <CopilotHeader />
          <Thread state={state} ref={chipRef} />
          <Composer />
        </aside>
        <div className="relative min-h-0 overflow-hidden bg-desk pt-7">
          <Sheet state={state} />
        </div>
        <aside className="min-h-0 border-l border-line-soft bg-card">
          <SigningPanel state={state} />
        </aside>
      </div>
      <Pointer
        state={state}
        rootRef={rootRef}
        chipRef={chipRef}
        sendRef={sendRef}
        scale={scale}
      />
    </div>
  );
}

function CompactLayout({ state }: { state: DemoState }) {
  return (
    <div className="flex h-full flex-col">
      <WindowBar state={state} compact />
      <div className="relative min-h-0 flex-1 overflow-hidden bg-desk pt-6">
        <Sheet state={state} crop />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-desk to-transparent" />
      </div>
      <div className="flex h-[236px] shrink-0 flex-col gap-3 border-t border-line-soft bg-band px-5 pt-4 pb-4">
        <CopilotHeader />
        <Thread state={state} latestOnly />
      </div>
    </div>
  );
}

/**
 * A pointer that does what the story says: it travels to the suggestion,
 * presses it, then travels to Send. Positions are measured from the
 * targets themselves and divided by the scale, since the composition is
 * transformed.
 */
function Pointer({
  state,
  rootRef,
  chipRef,
  sendRef,
  scale,
}: {
  state: DemoState;
  rootRef: React.RefObject<HTMLDivElement | null>;
  chipRef: React.RefObject<HTMLSpanElement | null>;
  sendRef: React.RefObject<HTMLSpanElement | null>;
  scale: number;
}) {
  const x = useMotionValue(560);
  const y = useMotionValue(640);
  const { step } = state;

  useEffect(() => {
    const target =
      step === S.toChip || step === S.press
        ? chipRef.current
        : step === S.toSend || step === S.sent
          ? sendRef.current
          : null;
    const root = rootRef.current;
    if (!target || !root) return;
    const t = target.getBoundingClientRect();
    const r = root.getBoundingClientRect();
    const tx = (t.left - r.left) / scale + (t.width / scale) * 0.42;
    const ty = (t.top - r.top) / scale + (t.height / scale) * 0.55;
    const opts = { duration: 0.85, ease: [0.5, 0, 0.2, 1] as const };
    const ax = animate(x, tx, opts);
    const ay = animate(y, ty, opts);
    return () => {
      ax.stop();
      ay.stop();
    };
  }, [step, scale, x, y, rootRef, chipRef, sendRef]);

  const visible = step >= S.toChip && step <= S.sent;
  const pressing = step === S.press || step === S.sent;

  return (
    <motion.div
      className="pointer-events-none absolute top-0 left-0 z-20"
      style={{ x, y }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, delay: visible ? 0 : 0.5 }}
    >
      <motion.svg
        viewBox="0 0 20 20"
        width="20"
        height="20"
        animate={{ scale: pressing ? [1, 0.82, 1] : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ filter: "drop-shadow(0 2px 4px rgb(18 19 23 / 0.25))" }}
      >
        <path
          d="M3.5 2.5 16 9.2l-5.6 1.4-2.6 5.4L3.5 2.5Z"
          fill="#121317"
          stroke="#fff"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}
