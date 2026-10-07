"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
} from "motion/react";
import { useRef } from "react";

import { useLenis } from "@/components/providers/smooth-scroll";
import { usePrefersReducedMotion } from "@/lib/use-media";

const TYPES = [
  "Mutual NDA",
  "Master services agreement",
  "Offer letter",
  "Data processing addendum",
  "Office lease",
  "Supplier agreement",
  "Consulting agreement",
  "Shareholders agreement",
  "Software licence",
  "Partnership agreement",
];

/**
 * The agreements Zign handles, passing beneath the hero. It drifts on its
 * own, hurries when the page is scrolled, and rests under the pointer.
 */
export function Marquee() {
  const lenis = useLenis();
  const reduce = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const resting = useRef(false);
  const inView = useInView(section);

  useAnimationFrame((_, delta) => {
    if (reduce || resting.current || !inView) return;
    const half = (track.current?.scrollWidth ?? 0) / 2;
    if (!half) return;
    const hurry = Math.min(Math.abs(lenis?.velocity ?? 0), 60);
    const speed = 34 + hurry * 7;
    let next = x.get() - (speed * delta) / 1000;
    if (next <= -half) next += half;
    x.set(next);
  });

  return (
    <section
      ref={section}
      aria-label="Agreement types Zign handles"
      className="relative overflow-hidden border-y border-line bg-paper/70 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] py-4"
      onMouseEnter={() => (resting.current = true)}
      onMouseLeave={() => (resting.current = false)}
    >
      <motion.ul ref={track} style={{ x }} className="flex w-max">
        {[0, 1].map((copy) =>
          TYPES.map((t) => (
            <li
              key={`${copy}-${t}`}
              aria-hidden={copy === 1 || undefined}
              className="flex items-center gap-10 pr-10 whitespace-nowrap"
            >
              <span className="font-serif text-[1.25rem] text-ink-soft">
                {t}
              </span>
              <span className="size-1.5 rounded-full bg-indigo/50" />
            </li>
          )),
        )}
      </motion.ul>
    </section>
  );
}
