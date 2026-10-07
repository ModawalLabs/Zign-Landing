"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Aurora } from "@/components/fx/aurora";
import { TiltCard } from "@/components/fx/tilt";
import { AutoplayToggle } from "@/components/ui/autoplay-toggle";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

import editor from "../../../public/product/editor.webp";
import home from "../../../public/product/home.webp";
import review from "../../../public/product/review.webp";

const DWELL = 7000;

const SCREENS = [
  {
    label: "Home",
    image: home,
    alt: "The Zign home screen: a greeting, a one-line brief of what needs attention, suggestion chips and the copilot's input bar, with agreement counts and a thirty-day horizon beneath.",
    caption:
      "Home is a conversation: ask what is due, upload a file or start a draft.",
  },
  {
    label: "Editor",
    image: editor,
    alt: "The Zign editor: an employment contract on the page with tracked suggestions, Zign AI on the left and the review panel on the right showing votes from each party.",
    caption:
      "Suggestions, votes and the copilot, all on the page beside the document.",
  },
  {
    label: "Review link",
    image: review,
    alt: "A counterparty's review page: the contract on the left, suggestions and comments on the right, opened from a link with comment access.",
    caption:
      "Counterparties review from a link with the access you gave them. No account needed.",
  },
] as const;

export function Workspace() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { amount: 0.4 });
  const reduce = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const running = inView && !paused && !stopped && !reduce;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => setActive((a) => (a + 1) % SCREENS.length),
      DWELL,
    );
    return () => window.clearTimeout(id);
  }, [running, active]);

  /* The frame opens out to full size as it comes up the page. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 15%"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [34, 22]);

  const onKey = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const to = (active + dir + SCREENS.length) % SCREENS.length;
    setActive(to);
    document.getElementById(`screen-tab-${to}`)?.focus();
  };

  const screen = SCREENS[active];

  return (
    <section
      id="workspace"
      ref={sectionRef}
      aria-labelledby="workspace-title"
      className="relative isolate scroll-mt-16 py-14 lg:py-16"
    >
      {/* Faint weather under the frame, so the dark is never dead. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[28%] bottom-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_80%,transparent)]"
      >
        <Aurora strength={0.3} />
      </div>
      <Container>
        <SectionHead
          id="workspace-title"
          n="3"
          label="The workspace"
          title="One quiet place for every agreement."
          lede="The product's own screens, exactly as your team will use them."
        />

        <div
          className="mt-8 md:mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <Reveal>
            <div
              role="tablist"
              aria-label="Product screens"
              onKeyDown={onKey}
              className="-mx-5 flex [scrollbar-width:none] gap-1 overflow-x-auto px-5 pb-1 max-sm:mask-x sm:mx-0 sm:px-0"
            >
              {SCREENS.map((s, i) => (
                <button
                  key={s.label}
                  id={`screen-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-controls="screen-panel"
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative shrink-0 rounded-full px-4 py-2 text-[14px] transition-colors duration-300",
                    active === i ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {active === i && (
                    <motion.span
                      layoutId="screen-tab"
                      className="absolute inset-0 overflow-hidden rounded-full border border-line bg-card shadow-subtle"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 36,
                      }}
                    >
                      <motion.span
                        key={`${i}-${running}`}
                        className="absolute inset-x-3 bottom-0 h-px origin-left bg-indigo"
                        initial={{ scaleX: running ? 0 : 1 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: running ? DWELL / 1000 : 0,
                          ease: "linear",
                        }}
                      />
                    </motion.span>
                  )}
                  <span className="relative">{s.label}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <motion.div
            ref={frameRef}
            style={reduce ? undefined : { scale, borderRadius: radius }}
            className="glass-frame relative mt-6 overflow-hidden p-1.5 sm:p-2.5"
          >
            <TiltCard max={2} className="rounded-[10px] sm:rounded-[14px]">
              <div
                id="screen-panel"
                role="tabpanel"
                aria-labelledby={`screen-tab-${active}`}
                className="relative aspect-[16/9] overflow-hidden rounded-[10px] border border-line-soft bg-paper sm:rounded-[14px]"
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={screen.label}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.015, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    <Image
                      src={screen.image}
                      alt={screen.alt}
                      fill
                      sizes="(min-width: 1320px) 1240px, 100vw"
                      quality={90}
                      placeholder="blur"
                      className="object-cover object-top"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </TiltCard>
          </motion.div>

          <div className="mt-6 grid gap-4 md:grid-cols-12">
            <div className="flex items-center gap-3 md:col-span-3 md:items-start">
              <p
                className="pt-1 font-mono text-[12px] text-subtle"
                data-tabular
              >
                0{active + 1} / 0{SCREENS.length}
              </p>
              {!reduce && (
                <AutoplayToggle
                  stopped={stopped}
                  onToggle={() => setStopped((s) => !s)}
                />
              )}
            </div>
            <div className="min-h-[3.4em] md:col-span-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={screen.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="text-[16px] leading-[1.6] text-pretty text-ink-soft"
                >
                  {screen.caption}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
