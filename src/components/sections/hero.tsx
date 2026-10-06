"use client";

import { motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useRef } from "react";

import { Aurora } from "@/components/fx/aurora";
import { INTRO } from "@/components/fx/intro";
import { Magnetic } from "@/components/fx/magnetic";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { HeroDemo } from "@/components/visuals/hero-demo/hero-demo";
import { site } from "@/config/site";
import { EASE } from "@/lib/motion";
import { useMedia, usePrefersReducedMotion } from "@/lib/use-media";

/* The glass signature needs WebGL and a window; it joins once the page is
   on the client, and only where there is room for it. */
const GlassSignature = dynamic(
  () => import("@/components/fx/glass-signature").then((m) => m.GlassSignature),
  { ssr: false },
);

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  /* The glass is a desktop piece: below the large breakpoint its column
     is hidden, so the renderer is never started there. */
  const wide = useMedia("(min-width: 64rem)");
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

  /* Everything waits for the intro's curtain to lift. */
  const d = INTRO;

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20"
    >
      <Backdrop />

      <Container>
        <div className="grid items-center gap-y-10 lg:grid-cols-12 lg:gap-x-6">
          <motion.div
            className="lg:col-span-6"
            style={reduce ? undefined : { y: textY, opacity: textOpacity }}
          >
            <RevealLines
              as="h1"
              id="hero-title"
              immediate
              delay={d + 0.15}
              stagger={0.1}
              lines={[
                "Agreements,",
                <em key="settled" className="text-ink-sweep font-serif italic">
                  settled.
                </em>,
              ]}
              className="text-display text-[clamp(2.9rem,6.3vw,5.5rem)] leading-[0.98] tracking-[-0.036em]"
            />

            <Reveal immediate delay={d + 0.55}>
              <p className="mt-7 max-w-[44ch] text-[17px] leading-[1.6] text-pretty text-muted md:text-[18px]">
                Zign transforms static PDFs into intelligent agreements with{" "}
                <span className="whitespace-nowrap">AI-powered</span> drafting,
                collaboration, workflows, and secure signing.
              </p>
            </Reveal>

            <Reveal
              immediate
              delay={d + 0.7}
              className="mt-8 flex flex-wrap items-center gap-3"
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
            </Reveal>
          </motion.div>

          {/* The mark, in glass, turning slowly in the light. */}
          <div className="relative hidden lg:col-span-6 lg:block">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: EASE, delay: d + 0.3 }}
              className="relative mx-auto aspect-[5/4] w-full max-w-[600px]"
            >
              {wide && <GlassSignature />}
            </motion.div>
          </div>
        </div>

        <div className="mt-14 md:mt-16" style={{ perspective: 1800 }}>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: EASE, delay: d + 0.8 }}
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
          </motion.div>
        </div>
      </Container>
    </section>
  );
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
