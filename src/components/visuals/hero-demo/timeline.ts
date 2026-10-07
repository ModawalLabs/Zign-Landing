"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * The hero's story as numbered beats. Each component reads `step` and
 * shows what is true from that beat on, so the whole demo is one number
 * and can be replayed, or shown finished, by changing it.
 */
export const S = {
  idle: 0,
  ask: 1, // Maya asks Zign to prepare the NDA
  read: 2, // the sheet is read
  fields: 3, // six fields are placed
  placed: 4, // Zign reports the fields and the signers
  flag: 5, // clause 3's term is flagged
  toChip: 6, // the pointer travels to the suggestion
  press: 7, // the suggestion is pressed
  amended: 8, // the term is struck and replaced
  toSend: 9, // the pointer travels to Send
  sent: 10, // out for signature
  signed: 11, // Hannah signs
} as const;

/** When each beat lands, in milliseconds from the start. */
const BEATS = [
  600, 1350, 2850, 3500, 4700, 6100, 6950, 7350, 8700, 9500, 11100,
] as const;

const FINAL = BEATS.length;

export type DemoState = {
  step: number;
  /** The signing date, written in on the client when Hannah signs. */
  date: string | null;
  /** The wall-clock time the story ran at, for the audit lines. */
  time: string | null;
};

function stamp() {
  const now = new Date();
  return {
    date: new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(now),
    time: new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(now),
  };
}

export function useStory(start: boolean, reduce: boolean) {
  const [state, setState] = useState<DemoState>({
    step: S.idle,
    date: null,
    time: null,
  });
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduce) {
      // Shown finished at once, still timed on the client.
      const id = window.setTimeout(
        () => setState({ step: FINAL, ...stamp() }),
        0,
      );
      return () => window.clearTimeout(id);
    }
    const ids = BEATS.map((at, i) =>
      window.setTimeout(
        () => setState((s) => ({ ...s, ...stamp(), step: i + 1 })),
        at,
      ),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [start, reduce, run]);

  const replay = useCallback(() => {
    setState({ step: S.idle, date: null, time: null });
    setRun((r) => r + 1);
  }, []);

  /* A finished run rests for a while, then plays again on its own, so the
     product is never still for long. Replay still works in between. */
  useEffect(() => {
    if (!start || reduce || state.step < FINAL) return;
    const id = window.setTimeout(replay, 6500);
    return () => window.clearTimeout(id);
  }, [start, reduce, state.step, replay]);

  return { state, replay, done: state.step >= FINAL };
}
