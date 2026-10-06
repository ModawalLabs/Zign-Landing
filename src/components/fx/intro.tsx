"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { SignatureMark } from "@/components/ui/signature-mark";
import { EASE } from "@/lib/motion";

/** Seconds the page's own entrances wait for the curtain to lift. */
export const INTRO = 1;

/**
 * A sheet of paper over the page that the mark signs, then lifts. The CSS
 * sends it away on its own after 1.5s, so it can never hold the page
 * hostage; this component only removes it from the tree afterwards.
 */
export function Intro() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setGone(true), 2400);
    return () => window.clearTimeout(id);
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="intro-curtain fixed inset-0 z-[80] grid place-items-center bg-paper"
    >
      <div className="relative">
        <SignatureMark
          size={150}
          strokeWidth={5}
          draw
          duration={0.75}
          className="text-indigo"
        />
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.45, ease: EASE }}
          className="absolute inset-x-0 -bottom-10 text-center font-serif text-[19px] font-semibold tracking-[-0.01em] text-ink"
        >
          Zign
        </motion.p>
      </div>
    </div>
  );
}
