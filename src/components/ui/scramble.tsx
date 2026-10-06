"use client";

import { useEffect, useState } from "react";

const GLYPHS = "0123456789abcdef";

/**
 * A hash that resolves from noise, left to right, the way a digest is
 * computed and then fixed. Before it starts it shows a neutral placeholder,
 * so the server and the first client render agree.
 */
export function Scramble({
  text,
  active,
  className,
}: {
  text: string;
  active: boolean;
  className?: string;
}) {
  const [shown, setShown] = useState(() => text.replace(/[0-9a-f]/g, "·"));

  useEffect(() => {
    if (!active) {
      const id = window.setTimeout(
        () => setShown(text.replace(/[0-9a-f]/g, "·")),
        0,
      );
      return () => window.clearTimeout(id);
    }
    let frame = 0;
    const total = 26;
    const id = window.setInterval(() => {
      frame += 1;
      const fixed = Math.floor((frame / total) * text.length);
      setShown(
        text
          .split("")
          .map((ch, i) =>
            i < fixed || ch === " "
              ? ch
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(""),
      );
      if (frame >= total) window.clearInterval(id);
    }, 40);
    return () => window.clearInterval(id);
  }, [active, text]);

  return <span className={className}>{shown}</span>;
}
