"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Aurora } from "@/components/fx/aurora";
import { AutoplayToggle } from "@/components/ui/autoplay-toggle";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { SignatureMark } from "@/components/ui/signature-mark";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

const DWELL = 8000;

const PROMPTS = [
  {
    ask: "What am I agreeing to?",
    hint: "Plain-language summaries",
    Answer: Summary,
  },
  {
    ask: "Tighten the termination clause",
    hint: "Rewrites as tracked changes",
    Answer: Rewrite,
  },
  {
    ask: "What's still blank?",
    hint: "Finds what needs filling",
    Answer: Blanks,
  },
] as const;

export function Copilot() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  /* The questions take turns while the panel is on screen; hovering or
     focusing the list holds the current one. */
  const [stopped, setStopped] = useState(false);
  const running = inView && !paused && !stopped && !reduce;

  /* A pool of light that follows the pointer across the dark. */
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  const [lit, setLit] = useState(false);
  const onGlowMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    gx.set(e.clientX - r.left);
    gy.set(e.clientY - r.top);
    if (!lit) setLit(true);
  };

  const onTabKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? -1
          : 0;
    const to =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? PROMPTS.length - 1
          : step
            ? (active + step + PROMPTS.length) % PROMPTS.length
            : null;
    if (to === null) return;
    e.preventDefault();
    setActive(to);
    document.getElementById(`ask-tab-${to}`)?.focus();
  };

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => setActive((a) => (a + 1) % PROMPTS.length),
      DWELL,
    );
    return () => window.clearTimeout(id);
  }, [running, active]);

  return (
    <section
      id="copilot"
      aria-labelledby="copilot-title"
      className="grain relative isolate scroll-mt-16 overflow-hidden bg-night py-16 text-night-text lg:py-24"
      onPointerMove={reduce ? undefined : onGlowMove}
      onPointerLeave={() => setLit(false)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Aurora />
        <div className="dot-grid-night absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_25%,transparent_75%)] opacity-60" />
        {/* The band ends by becoming the page beneath it, not by stopping. */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-paper" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-lift/50 to-transparent" />
      </div>
      <CursorGlow x={gx} y={gy} lit={lit} />

      <Container>
        <SectionHead
          id="copilot-title"
          n="3"
          label="Zign AI"
          tone="night"
          title="Ask the agreement anything."
          lede="Zign AI reads the whole agreement before you do. It explains, rewrites and checks on the page itself, and answers signers' questions as they sign."
        />

        <div
          ref={ref}
          className="mt-10 grid gap-10 md:mt-12 lg:grid-cols-12 lg:gap-12"
        >
          <div
            className="lg:col-span-4"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div
              role="tablist"
              aria-label="Questions to ask Zign AI"
              aria-orientation="vertical"
              onKeyDown={onTabKey}
              className="border-t border-night-line"
            >
              {PROMPTS.map((p, i) => (
                <button
                  key={p.ask}
                  type="button"
                  role="tab"
                  id={`ask-tab-${i}`}
                  aria-selected={active === i}
                  tabIndex={active === i ? 0 : -1}
                  aria-controls="ask-panel"
                  onClick={() => setActive(i)}
                  className="group relative block w-full border-b border-night-line py-5 text-left"
                >
                  <span
                    className={cn(
                      "block text-display text-[1.35rem] leading-snug transition-colors duration-500",
                      active === i
                        ? "text-night-text"
                        : "text-night-muted/60 group-hover:text-night-muted",
                    )}
                  >
                    &ldquo;{p.ask}&rdquo;
                  </span>
                  <span className="mt-1.5 block text-[13px] text-night-muted">
                    {p.hint}
                  </span>
                  <span
                    aria-hidden
                    className="absolute bottom-[-1px] left-0 h-px w-full overflow-hidden"
                  >
                    {active === i && (
                      <motion.span
                        key={`${i}-${paused}-${inView}`}
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
                className="mt-3 -ml-2.5"
              />
            )}

            <Reveal delay={0.2} className="mt-8">
              <div className="border-t border-night-line pt-5">
                <p className="text-eyebrow text-indigo-lift">Copilot memory</p>
                <p className="mt-3 text-[15px] leading-[1.6] text-night-text/90">
                  It remembers what you tell it. Halden&rsquo;s contracts
                  contact is Hannah Brooks, and you countersign after her.
                </p>
                <p className="mt-3 text-[13px] text-night-muted">
                  Pin a fact, or have it forgotten, from settings.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <div
              id="ask-panel"
              role="tabpanel"
              aria-labelledby={`ask-tab-${active}`}
              className="relative overflow-hidden rounded-[22px] border border-white/[0.08] bg-night-raised/85 shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_40px_120px_-40px_rgb(0_0_0/0.85)] backdrop-blur-xl"
            >
              <div className="flex items-center gap-2.5 border-b border-night-line px-5 py-3.5">
                <span className="grid size-7 place-items-center rounded-lg bg-indigo-lift/15">
                  <SignatureMark
                    size={16}
                    strokeWidth={9}
                    className="text-indigo-lift"
                  />
                </span>
                <span className="text-[13.5px] font-semibold">Zign AI</span>
                <span className="text-[13px] text-night-muted">
                  on Mutual NDA, Halden &amp; Co.
                </span>
              </div>
              <div className="relative h-[500px] px-5 py-6 sm:px-8 sm:py-8">
                <AnimatePresence mode="wait">
                  <Exchange key={active} index={active} />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Exchange({ index }: { index: number }) {
  const { ask, Answer } = PROMPTS[index];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex h-full flex-col gap-6"
    >
      <div className="flex justify-end">
        <p className="rounded-2xl rounded-br-md bg-white/[0.08] px-4 py-2.5 text-[14px] text-night-text">
          {ask}
        </p>
      </div>
      <div className="min-h-0 flex-1 text-[14.5px] leading-[1.7] text-night-text/90">
        <Answer />
      </div>
    </motion.div>
  );
}

/* Answers arrive in pieces, the way a streamed reply does. */
function Stream({
  children,
  i,
  className,
}: {
  children: React.ReactNode;
  i: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.5 + i * 0.32 }}
    >
      {children}
    </motion.div>
  );
}

function Summary() {
  const points = [
    [
      "What it covers",
      "Project details you and Halden share while you explore the partnership.",
    ],
    [
      "How long",
      "Each side keeps the other's information secret for three years from disclosure.",
    ],
    [
      "How it ends",
      "Either side can stop talks at any time; the confidentiality still holds.",
    ],
    ["Which law", "England and Wales."],
  ];
  return (
    <div className="space-y-5">
      <Stream i={0}>
        <p>
          In short: a two-way NDA. Both sides protect what they learn from each
          other, and use it only to explore the work together.
        </p>
      </Stream>
      <Stream i={1}>
        <dl className="divide-y divide-night-line border-y border-night-line">
          {points.map(([k, v], j) => (
            <motion.div
              key={k}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 + j * 0.22, duration: 0.5 }}
              className="grid gap-1 py-3 sm:grid-cols-[130px_1fr] sm:gap-4"
            >
              <dt className="text-[13px] text-night-muted">{k}</dt>
              <dd>{v}</dd>
            </motion.div>
          ))}
        </dl>
      </Stream>
      <Stream i={5}>
        <p className="flex gap-3 rounded-xl border border-pending-lift/30 bg-pending-lift/[0.07] px-4 py-3 text-[14px]">
          <span className="mt-[3px] grid size-4 shrink-0 place-items-center rounded-full bg-pending-lift text-[10px] font-bold text-night">
            !
          </span>
          <span>
            Worth a look: clause 6 lets Halden keep one copy of your information
            for its records after the talks end.
          </span>
        </p>
      </Stream>
    </div>
  );
}

function Rewrite() {
  return (
    <div className="space-y-5">
      <Stream i={0}>
        <p>
          Here&rsquo;s clause 7 with a notice period and a clear return of
          materials. Changes are tracked so Halden sees exactly what moved.
        </p>
      </Stream>
      <Stream i={1}>
        <div className="rounded-xl border border-night-line bg-night p-5 font-serif text-[15px] leading-[1.75]">
          <p className="mb-2 font-sans text-[12px] text-night-muted">
            7. Termination
          </p>
          Either Party may end discussions{" "}
          <span className="text-night-muted line-through decoration-night-muted/80">
            at any time
          </span>{" "}
          <span className="rounded-[3px] bg-indigo-lift/15 px-0.5 text-indigo-lift shadow-[inset_0_-1px_0_rgb(128_143_239/0.6)]">
            on fourteen (14) days&rsquo; written notice
          </span>
          .{" "}
          <span className="rounded-[3px] bg-indigo-lift/15 px-0.5 text-indigo-lift shadow-[inset_0_-1px_0_rgb(128_143_239/0.6)]">
            Within ten (10) days of the end date, each Party shall return or
            destroy the other&rsquo;s Confidential Information.
          </span>
        </div>
      </Stream>
      <Stream i={2} className="flex flex-wrap gap-2">
        <span className="rounded-lg bg-night-text px-3.5 py-2 text-[13px] font-medium text-night">
          Apply to the document
        </span>
        <span className="rounded-lg border border-night-line px-3.5 py-2 text-[13px] text-night-text/90">
          Make it thirty days
        </span>
        <span className="rounded-lg border border-night-line px-3.5 py-2 text-[13px] text-night-text/90">
          Keep the original
        </span>
      </Stream>
    </div>
  );
}

function Blanks() {
  const blanks = [
    { where: "Clause 1", what: "The Effective Date", who: "You" },
    {
      where: "Schedule 1",
      what: "Halden's registered address",
      who: "Hannah Brooks",
    },
    {
      where: "Signature block",
      what: "Hannah's job title",
      who: "Hannah Brooks",
    },
  ];
  return (
    <div className="space-y-5">
      <Stream i={0}>
        <p>
          Three things are still empty. I can ask Hannah for hers when it goes
          out.
        </p>
      </Stream>
      <Stream i={1}>
        <ul className="divide-y divide-night-line border-y border-night-line">
          {blanks.map((b, j) => (
            <motion.li
              key={b.what}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + j * 0.2, duration: 0.5, ease: EASE }}
              className="flex items-center gap-4 py-3.5"
            >
              <span className="w-[112px] shrink-0 font-mono text-[12px] text-night-muted">
                {b.where}
              </span>
              <span className="flex-1">{b.what}</span>
              <span className="hidden text-[13px] text-night-muted sm:block">
                {b.who}
              </span>
              <span className="rounded-md border border-night-line px-2.5 py-1 text-[12px] text-night-text/90">
                Jump to it
              </span>
            </motion.li>
          ))}
        </ul>
      </Stream>
      <Stream i={4}>
        <p className="text-night-muted">
          Everything else is filled, and both signature blocks are complete.
        </p>
      </Stream>
    </div>
  );
}

/** The pointer's pool of light, 640px across, centred on the hand. */
function CursorGlow({
  x,
  y,
  lit,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  lit: boolean;
}) {
  const left = useTransform(x, (v) => v - 320);
  const top = useTransform(y, (v) => v - 320);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 -z-10 hidden size-[640px] rounded-full bg-[radial-gradient(closest-side,rgb(128_143_239/0.14),rgb(128_143_239/0.09)_36%,rgb(128_143_239/0.04)_64%,rgb(128_143_239/0.01)_84%,transparent)] lg:block"
      style={{ x: left, y: top }}
      animate={{ opacity: lit ? 1 : 0 }}
      transition={{ duration: 0.8, ease: EASE }}
    />
  );
}
