"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Slow weather behind a section: pools of indigo, violet and sky light
 * that drift and breathe on a long cycle over the dark, with one faint
 * warm pool so the page never reads cold. The drift holds still while the
 * section is off screen, so a long page is not animating a dozen skies no
 * one can see. Under reduced motion they hold still.
 */
export function Aurora({
  strength = 1,
  className,
}: {
  /** Scales every pool's opacity; 1 is the hero's weather. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => el.toggleAttribute("data-still", !entry.isIntersecting),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Each pool falls off along an eased curve drawn with gradient stops,
     soft enough to need no blur filter: a filter this size is the most
     expensive thing a phone can be asked to paint. */
  const pool = (rgb: string, alpha: number) => {
    const a = Math.min(1, alpha * strength);
    const at = (k: number) => `rgb(${rgb} / ${(a * k).toFixed(3)})`;
    return {
      background: `radial-gradient(closest-side, ${at(1)}, ${at(0.66)} 35%, ${at(0.34)} 62%, ${at(0.12)} 82%, transparent)`,
    };
  };
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "aurora pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className="aurora-a absolute -top-[25%] left-[-12%] h-[75%] w-[62%] rounded-full"
        style={pool("56 75 199", 0.34)}
      />
      <div
        className="aurora-b absolute top-[5%] right-[-18%] h-[85%] w-[58%] rounded-full"
        style={pool("107 92 231", 0.3)}
      />
      <div
        className="aurora-c absolute bottom-[-35%] left-[18%] h-[75%] w-[64%] rounded-full"
        style={pool("127 176 255", 0.18)}
      />
      <div
        className="aurora-b absolute top-[28%] left-[34%] h-[45%] w-[38%] rounded-full"
        style={pool("255 200 160", 0.08)}
      />
    </div>
  );
}
