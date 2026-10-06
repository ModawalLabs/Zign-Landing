import { cn } from "@/lib/utils";

/**
 * A clause mark: the section sign and number, then the label, all in the
 * mono, the way a contract numbers its own sections.
 */
export function Clause({
  n,
  children,
  tone = "ink",
  className,
}: {
  n: string;
  children: React.ReactNode;
  tone?: "ink" | "night";
  className?: string;
}) {
  const night = tone === "night";
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-eyebrow",
        night ? "text-night-muted" : "text-muted",
        className,
      )}
    >
      <span className={night ? "text-indigo-lift" : "text-indigo"}>
        §&thinsp;{n.padStart(2, "0")}
      </span>
      <span
        aria-hidden
        className={cn("h-px w-5", night ? "bg-night-line" : "bg-line")}
      />
      <span>{children}</span>
    </p>
  );
}
