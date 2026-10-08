"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { ChevronLink } from "@/components/ui/chevron-link";
import { Container } from "@/components/ui/container";
import { LitWords } from "@/components/ui/lit-words";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

import { SignedSheet, type Signer } from "./signed-sheet";

type Moment = {
  id: string;
  eyebrow: string;
  /** The title, line by line: each line rises in on its own. */
  title: string[];
  body: string;
  /** What the "+" opens: a little more on how it works for them. */
  more: string;
  heading: string;
  signers: [Signer, Signer];
  glow: string;
};

/* Three of life's agreements and the two people who sign each one. */
const MOMENTS: Moment[] = [
  {
    id: "wedding",
    eyebrow: "Marriage certificates",
    title: ["Say “I do.”", "Then zign it."],
    body: "Two signatures for the biggest day of your life, from wherever you both are.",
    more: "Both of you sign from your own phones. Zign checks every detail, seals the certificate when the last signature lands, and keeps a record you can show anyone.",
    heading: "Certificate of Marriage",
    signers: [
      {
        name: "Amara Okafor",
        role: "Bride",
        person: "woman-with-veil",
        tint: "#f6d0df",
      },
      {
        name: "Daniel Mensah",
        role: "Groom",
        person: "man-in-tuxedo",
        tint: "#d6d3fb",
      },
    ],
    glow: "rgb(226 86 140 / 0.32)",
  },
  {
    id: "deal",
    eyebrow: "Business agreements",
    title: ["Close the deal."],
    body: "Partners, clients and suppliers sign from wherever they are.",
    more: "Send one link. Every party signs in turn, from any device, with no account to make, and the sealed agreement goes to everyone the moment it is done.",
    heading: "Partnership Agreement",
    signers: [
      {
        name: "Priya Shah",
        role: "Partner",
        person: "woman-office-worker",
        tint: "#d9d4fb",
      },
      {
        name: "Tom Walsh",
        role: "Partner",
        person: "man-office-worker",
        tint: "#cfe3fb",
      },
    ],
    glow: "rgb(110 124 255 / 0.32)",
  },
  {
    id: "build",
    eyebrow: "Construction contracts",
    title: ["Break ground."],
    body: "Sign the contract on site, with your hard hat still on.",
    more: "Sign on site, from a phone. Ask Zign AI what a clause means before you do, and keep the sealed copy with the job.",
    heading: "Building Contract",
    signers: [
      {
        name: "Grace Adeyemi",
        role: "Client",
        person: "woman-construction-worker",
        tint: "#fbe2c4",
      },
      {
        name: "Joe Marlow",
        role: "Contractor",
        person: "construction-worker",
        tint: "#f7ebb7",
      },
    ],
    glow: "rgb(232 140 60 / 0.3)",
  },
];

/**
 * Who Zign is for, as three of life's agreements: the deal and the build
 * side by side, and the wedding beneath them, wide. Each is a performance
 * when it comes into view, its words arrive the way Apple's do, and each
 * has a "+" for a little more.
 */
export function Everybody() {
  const [wedding, deal, build] = MOMENTS;
  return (
    <section
      id="everybody"
      aria-labelledby="everybody-title"
      className="relative py-32 lg:py-40"
    >
      <Container>
        <RevealLines
          id="everybody-title"
          lines={["Zign is for everybody."]}
          className="text-center text-headline text-[clamp(2.5rem,5.2vw,4.25rem)] tracking-[-0.035em]"
        />
        <Reveal delay={0.12}>
          <p className="mx-auto mt-5 max-w-[34ch] text-center text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.35] font-semibold tracking-[-0.01em] text-pretty text-muted">
            Whatever you&rsquo;re agreeing to, and whoever it&rsquo;s with.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-2">
          <Tile moment={deal} />
          <Tile moment={build} delay={0.08} />
          <Tile moment={wedding} wide className="lg:col-span-2" />
        </div>
      </Container>
    </section>
  );
}

function Tile({
  moment: m,
  wide = false,
  delay = 0,
  className,
}: {
  moment: Moment;
  wide?: boolean;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const seen = useInView(ref, { amount: 0.45 });
  const [open, setOpen] = useState(false);
  const panelId = useId();

  /* Escape closes the "+" panel, as it would a sheet. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Reveal delay={delay} y={32} blur={false} className={className}>
      <motion.article
        ref={ref}
        className={cn(
          "group relative isolate overflow-hidden rounded-[30px] bg-[#131317] ring-1 ring-white/[0.05] ring-inset",
          wide ? "grid lg:h-[640px] lg:grid-cols-2" : "flex h-[580px] flex-col",
        )}
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: wide
              ? `radial-gradient(42% 60% at 74% 52%, ${m.glow}, transparent 75%)`
              : `radial-gradient(60% 50% at 50% 84%, ${m.glow}, transparent 75%)`,
          }}
        />

        <div
          className={cn(
            "relative z-10",
            wide
              ? "flex flex-col justify-center px-8 pt-12 sm:px-12 lg:py-16 lg:pl-16"
              : "px-8 pt-12 sm:px-12",
          )}
        >
          <Copy moment={m} reduce={reduce} />
        </div>

        <div
          role="img"
          aria-label={`${m.heading}, signed by ${m.signers[0].name} and ${m.signers[1].name}.`}
          className={cn(
            "relative",
            wide
              ? "flex h-[440px] items-center justify-center sm:h-[560px] lg:h-full"
              : "mt-auto flex justify-center",
          )}
        >
          <SignedSheet
            heading={m.heading}
            signers={m.signers}
            wide={wide}
            play={seen && !open}
            reduce={reduce}
            className={
              wide ? "scale-[0.72] sm:scale-100 lg:translate-x-[-8px]" : ""
            }
          />
        </div>

        {/* A little more, the way Apple's tiles carry a "+". */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={
            open
              ? `Close more about ${m.eyebrow.toLowerCase()}`
              : `More about ${m.eyebrow.toLowerCase()}`
          }
          className="absolute right-5 bottom-5 z-30 grid size-10 place-items-center rounded-full bg-white/[0.12] text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.22]"
        >
          <motion.svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            aria-hidden
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <path
              d="M8 2.5v11M2.5 8h11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </motion.svg>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              id={panelId}
              className="absolute inset-0 z-20 flex flex-col justify-end bg-[#0e0f12]/92 p-8 backdrop-blur-xl sm:p-12 lg:justify-center lg:pr-24"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <p className="text-eyebrow text-indigo-lift">{m.eyebrow}</p>
              <p className="mt-4 max-w-[44ch] text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.3] font-semibold tracking-[-0.02em] text-pretty">
                {m.more}
              </p>
              <ChevronLink href="/product" className="mt-6">
                Explore the product
              </ChevronLink>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </Reveal>
  );
}

/* ── The words ───────────────────────────────────────────────────────── */

/**
 * A tile's words, arriving the way Apple's do: the eyebrow fades up, the
 * title rises line by line from behind its own baseline, and the sentence
 * beneath lights up word by word as the reader scrolls past it. Under
 * reduced motion they are simply there.
 */
function Copy({ moment: m, reduce }: { moment: Moment; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const shown = reduce || seen;

  return (
    <div ref={ref}>
      <motion.p
        className="text-[clamp(1.125rem,1.6vw,1.5rem)] font-semibold tracking-[-0.01em] text-muted"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={shown ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {m.eyebrow}
      </motion.p>
      <h3 className="mt-2 text-headline text-[clamp(2.25rem,3.8vw,3.5rem)] tracking-[-0.035em]">
        {m.title.map((line, i) => (
          <span
            key={line}
            className="block [clip-path:inset(-0.3em_-0.6em_-0.24em_-0.6em)]"
          >
            <motion.span
              className="block will-change-transform"
              style={{ transformOrigin: "0% 100%" }}
              initial={reduce ? false : { y: "115%", rotate: 1.5 }}
              animate={shown ? { y: "0%", rotate: 0 } : undefined}
              transition={{ duration: 1.1, ease: EASE, delay: 0.1 + i * 0.09 }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h3>
      <LitWords
        text={m.body}
        className="mt-5 max-w-[30ch] text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-[1.35] font-semibold tracking-[-0.01em] text-pretty"
      />
    </div>
  );
}
