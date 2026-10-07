"use client";

import { motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { Aurora } from "@/components/fx/aurora";
import { INTRO, introHasPlayed } from "@/components/fx/intro";
import { Magnetic } from "@/components/fx/magnetic";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroDemo } from "@/components/visuals/hero-demo/hero-demo";
import { site } from "@/config/site";
import { useMedia, usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

/* The glass signature needs WebGL and a window; it joins once the page is
   on the client, and only where there is room for it. */
const GlassSignature = dynamic(
  () => import("@/components/fx/glass-signature").then((m) => m.GlassSignature),
  { ssr: false },
);

/* A still of the glass, rendered from the live scene at rest (see the
   README's Performance notes). Desktop only, like the glass itself: below
   the breakpoint the picture falls back to an empty pixel. */
const POSTER = "/hero/glass.webp";
const NOTHING =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/** An entrance delay, in seconds after the intro's curtain lifts. */
const at = (s: number) => ({ animationDelay: `${INTRO + s}s` });

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  /* The glass is a desktop piece: below the large breakpoint its column
     is hidden, so the renderer is never started there. */
  const wide = useMedia("(min-width: 64rem)");
  /* Under reduced motion the poster is the glass: there is nothing for a
     renderer to add to a still. */
  const glass = useWhenSettled(wide && !reduce);
  const [live, setLive] = useState(false);
  /* Back on this page from another in the same visit, the curtain does
     not play again, so nothing waits for it. */
  const [instant] = useState(introHasPlayed);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* As the reader scrolls, the words step back and the product comes
     flat to meet them, as if a sheet were being laid on the desk. */
  const textY = useTransform(scrollYProgress, [0, 0.45], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.38], [1, 0]);
  const tilt = useTransform(scrollYProgress, [0, 0.3], [9, 0]);
  const lift = useTransform(scrollYProgress, [0, 0.3], [0.96, 1]);
  const rise = useTransform(scrollYProgress, [0, 0.3], [24, 0]);

  /* The entrances are CSS (see .hero-* in globals.css), timed to the
     curtain, so the first screen arrives without waiting for a script. */
  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className={cn(
        "relative isolate overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20",
        instant && "hero-instant",
      )}
    >
      <Backdrop />

      <Container>
        <div className="grid items-center gap-y-10 lg:grid-cols-12 lg:gap-x-6">
          <motion.div
            className="lg:col-span-6"
            style={reduce ? undefined : { y: textY, opacity: textOpacity }}
          >
            <h1
              id="hero-title"
              className="text-display text-[clamp(2.9rem,6.3vw,5.5rem)] leading-[0.98] tracking-[-0.036em]"
            >
              <span className="hero-line">
                <span className="hero-rise" style={at(0.15)}>
                  Agreements,
                </span>
              </span>
              <span className="hero-line">
                <span className="hero-rise" style={at(0.25)}>
                  <em className="text-ink-sweep font-serif italic">settled.</em>
                </span>
              </span>
            </h1>

            <p
              className="hero-fade mt-7 max-w-[44ch] text-[17px] leading-[1.6] text-pretty text-muted md:text-[18px]"
              style={at(0.55)}
            >
              Zign transforms static PDFs into intelligent agreements with{" "}
              <span className="whitespace-nowrap">AI-powered</span> drafting,
              collaboration, workflows, and secure signing.
            </p>

            <div
              className="hero-fade mt-8 flex flex-wrap items-center gap-3"
              style={at(0.7)}
            >
              <Magnetic>
                <ButtonLink href={site.links.start} size="lg" arrow>
                  Start free
                </ButtonLink>
              </Magnetic>
              <Magnetic>
                <ButtonLink href="#workflow" size="lg" variant="outline">
                  See how it works
                </ButtonLink>
              </Magnetic>
            </div>
          </motion.div>

          {/* The mark, in glass, turning slowly in the light. The poster is
              there from the first frame; the live glass takes its place,
              in the same pose, once its first frame is drawn. */}
          <div className="relative hidden lg:col-span-6 lg:block">
            <div
              className="hero-glass relative mx-auto aspect-[5/4] w-full max-w-[600px]"
              style={at(0.3)}
            >
              <div
                aria-hidden
                className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgb(176_184_232/0.13),rgb(176_184_232/0.08)_36%,rgb(176_184_232/0.03)_64%,rgb(176_184_232/0.01)_84%,transparent)]"
              />
              {/* A plain picture rather than next/image: the file is
                  already encoded for its one size, and the media source
                  keeps phones from fetching it at all. */}
              <picture>
                <source media="(min-width: 64rem)" srcSet={POSTER} />
                <img
                  src={NOTHING}
                  alt=""
                  aria-hidden
                  width={900}
                  height={720}
                  fetchPriority="high"
                  className={cn(
                    "absolute inset-0 size-full object-contain transition-opacity duration-700 ease-(--ease-settle)",
                    live && "opacity-0",
                  )}
                />
              </picture>
              {glass && <GlassSignature onReady={() => setLive(true)} />}
            </div>
          </div>
        </div>

        <div
          className="hero-lift mt-12 md:mt-14 lg:mt-0"
          style={{ ...at(0.8), perspective: 1800 }}
        >
          <motion.div
            style={
              reduce
                ? undefined
                : {
                    rotateX: tilt,
                    scale: lift,
                    y: rise,
                    transformOrigin: "50% 0%",
                  }
            }
          >
            <HeroDemo />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* What counts as the reader arriving: any move, press, scroll or key. */
const ARRIVAL = [
  "pointermove",
  "pointerdown",
  "wheel",
  "touchstart",
  "keydown",
  "scroll",
] as const;

/**
 * True once the reader is here. Starting a WebGL renderer is the heaviest
 * single thing on the page (context, environment, shader compile), so it
 * never competes with the page loading: its code is fetched while the
 * browser is idle after load, and the renderer starts on the reader's
 * first move, or after a few seconds if none comes.
 */
function useWhenSettled(enabled: boolean) {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!enabled || settled) return;
    let idle = 0;
    let timer = 0;
    const start = () => setSettled(true);
    const fetchCode = () => {
      void import("@/components/fx/glass-signature");
    };
    const onLoad = () => {
      /* Safari has no idle callback; a short pause stands in for it. */
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(fetchCode, { timeout: 2000 });
      } else {
        window.setTimeout(fetchCode, 400);
      }
      timer = window.setTimeout(start, 5000);
    };
    for (const e of ARRIVAL)
      window.addEventListener(e, start, { once: true, passive: true });
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      for (const e of ARRIVAL) window.removeEventListener(e, start);
      window.removeEventListener("load", onLoad);
      if (idle) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
    };
  }, [enabled, settled]);

  return settled;
}

/**
 * The ground the hero stands on: the weather, a layout grid that fades
 * toward the edges, and two margin rules like a ruled sheet.
 */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <Aurora />
      <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_20%,transparent_75%)]" />
      <div className="absolute inset-x-0 top-0 h-[1000px] [mask-image:linear-gradient(to_bottom,#000_45%,transparent)]">
        <div className="mx-auto h-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
          <div className="h-full border-x border-line/80" />
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-paper to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper to-transparent" />
    </div>
  );
}
