"use client";

import { useEffect, useState } from "react";

/**
 * A small score for an illustration: while `play` is true the beat count
 * climbs on the given schedule; when it turns false it resets, so a scene
 * plays again the next time it is shown. Reduced motion lands on the last
 * beat at once.
 */
export function useBeats(play: boolean, at: readonly number[], reduce = false) {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!play) {
      const id = window.setTimeout(() => setBeat(0), 450);
      return () => window.clearTimeout(id);
    }
    if (reduce) {
      const id = window.setTimeout(() => setBeat(at.length), 0);
      return () => window.clearTimeout(id);
    }
    const ids = at.map((ms, i) => window.setTimeout(() => setBeat(i + 1), ms));
    return () => ids.forEach((id) => window.clearTimeout(id));
    // The schedule is a constant per scene; restarting on play is the point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, reduce]);

  return beat;
}

/** Type a string out over time, once `start` is true. */
export function useTyped(
  text: string,
  start: boolean,
  { cps = 38, reduce = false }: { cps?: number; reduce?: boolean } = {},
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      const id = window.setTimeout(() => setCount(0), 450);
      return () => window.clearTimeout(id);
    }
    if (reduce) {
      const id = window.setTimeout(() => setCount(text.length), 0);
      return () => window.clearTimeout(id);
    }
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setCount(n);
      if (n >= text.length) window.clearInterval(id);
    }, 1000 / cps);
    return () => window.clearInterval(id);
  }, [start, text, cps, reduce]);

  return text.slice(0, count);
}
