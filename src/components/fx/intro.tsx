"use client";

import { useEffect, useState } from "react";

import { WAVE } from "@/components/ui/signature-mark";

/** Seconds the page's own entrances wait for the curtain to lift. */
export const INTRO = 0.85;

/* Whether the curtain has already played in this visit. Coming back to the
   home page from another page (the sign-in page) should not sign the mark
   again. This lives only in the browser tab: effects never run on the
   server, so a server render always starts with the curtain. */
let played = false;
export const introHasPlayed = () => played;

/**
 * A sheet of paper over the page that the mark signs, then lifts. All of
 * it is CSS: the stroke draws, the name follows and the curtain leaves at
 * 1.25s whether or not any script has arrived, so a slow connection sees
 * the mark sign and the page appear at the same moment a fast one does.
 * This component only removes the sheet from the tree afterwards.
 */
export function Intro() {
  const [gone, setGone] = useState(introHasPlayed);

  useEffect(() => {
    played = true;
    if (gone) return;
    const id = window.setTimeout(() => setGone(true), 2000);
    return () => window.clearTimeout(id);
  }, [gone]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="intro-curtain fixed inset-0 z-[80] grid place-items-center bg-paper"
    >
      <div className="relative">
        <svg
          viewBox="34 18 165 66"
          width={150}
          height={60}
          fill="none"
          className="intro-mark overflow-visible text-indigo"
        >
          <path
            d={WAVE}
            pathLength={1}
            stroke="currentColor"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={178} cy={47} r={3.2} fill="currentColor" />
          <circle cx={186} cy={43} r={2.4} fill="currentColor" />
          <circle cx={192} cy={41} r={1.7} fill="currentColor" />
        </svg>
        <p className="intro-label absolute inset-x-0 -bottom-10 text-center font-serif text-[19px] font-semibold tracking-[-0.01em] text-ink">
          Zign
        </p>
      </div>
    </div>
  );
}
