"use client";

import { cn } from "@/lib/utils";

/**
 * Anything that advances on its own carries one of these, so it can be
 * stopped (WCAG 2.2.2, Pause, Stop, Hide).
 */
export function AutoplayToggle({
  stopped,
  onToggle,
  tone = "ink",
  className,
}: {
  stopped: boolean;
  onToggle: () => void;
  tone?: "ink" | "night";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={stopped}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 font-mono text-[11.5px] transition-colors",
        tone === "ink"
          ? "text-muted hover:text-ink"
          : "text-night-muted hover:text-night-text",
        className,
      )}
    >
      <svg
        viewBox="0 0 12 12"
        width="10"
        height="10"
        aria-hidden
        fill="currentColor"
      >
        {stopped ? (
          <path d="M3 1.8v8.4L10 6 3 1.8Z" />
        ) : (
          <>
            <rect x="2.5" y="2" width="2.4" height="8" rx="0.6" />
            <rect x="7.1" y="2" width="2.4" height="8" rx="0.6" />
          </>
        )}
      </svg>
      {stopped ? "Play" : "Pause"}
      <span className="sr-only"> the automatic rotation</span>
    </button>
  );
}
