"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const STOPS = [
  { id: "top", n: "00", label: "Start", night: false },
  { id: "workflow", n: "02", label: "How it works", night: false },
  { id: "copilot", n: "03", label: "Zign AI", night: true },
  { id: "workspace", n: "04", label: "Workspace", night: false },
  { id: "capabilities", n: "05", label: "Around the signature", night: false },
  { id: "record", n: "06", label: "Security", night: false },
  { id: "pricing", n: "07", label: "Pricing", night: false },
  { id: "faq", n: "08", label: "Questions", night: false },
  // Not a stop of its own: over the footer the rail stands down.
  { id: "site-footer", n: "", label: "Footer", night: true },
];

/**
 * A rail of ticks at the right edge, one per section, the way a contract
 * carries its clause numbers in the margin. It appears once the reader
 * has left the hero and lightens over the night section.
 */
export function ProgressRail() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const els = STOPS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const night = STOPS.find((s) => s.id === active)?.night ?? false;

  return (
    <nav
      aria-label="Sections"
      className={cn(
        "fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 transition-opacity duration-700 xl:block",
        active === "top" || active === "site-footer"
          ? "opacity-0"
          : "opacity-100",
      )}
    >
      <ol className="flex flex-col items-end gap-2.5">
        {STOPS.filter((s) => s.n).map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-label={`${s.label}, section ${s.n}`}
                aria-current={on ? "location" : undefined}
                className="group flex items-center justify-end gap-2.5 py-0.5"
              >
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-[0.08em] uppercase transition-opacity duration-300",
                    "opacity-0 group-hover:opacity-100",
                    night ? "text-night-text" : "text-ink",
                  )}
                >
                  {s.label}
                </span>
                <span
                  className={cn(
                    "block h-px transition-all duration-500 ease-(--ease-settle)",
                    on
                      ? night
                        ? "w-7 bg-indigo-lift"
                        : "w-7 bg-indigo"
                      : night
                        ? "w-3.5 bg-white/30 group-hover:w-5"
                        : "w-3.5 bg-ink/25 group-hover:w-5",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
