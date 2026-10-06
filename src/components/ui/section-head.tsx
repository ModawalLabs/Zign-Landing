import { Reveal, RevealRule } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * The head every section opens with, set the way a contract opens a
 * section: a rule that draws itself across the page, carrying the clause
 * number at one end and the section's name at the other, then the title,
 * then a short lede. One scale, no italics; the hero and the closing line
 * keep those.
 */
export function SectionHead({
  id,
  n,
  label,
  title,
  lede,
  tone = "ink",
  className,
}: {
  id: string;
  n: string;
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  tone?: "ink" | "night";
  className?: string;
}) {
  const night = tone === "night";
  return (
    <div className={className}>
      <RevealRule tone={tone} />
      <div className="pt-5">
        <Reveal blur={false} y={6}>
          <p
            className={cn(
              "flex items-baseline justify-between gap-6 text-eyebrow",
              night ? "text-night-muted" : "text-muted",
            )}
          >
            <span className={night ? "text-indigo-lift" : "text-indigo"}>
              §&thinsp;{n.padStart(2, "0")}
            </span>
            <span>{label}</span>
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            id={id}
            className={cn(
              "mt-8 max-w-[22ch] text-display text-[clamp(2rem,3.5vw,2.95rem)] leading-[1.06] tracking-[-0.026em] text-balance md:mt-10",
              night ? "text-night-text" : "text-ink",
            )}
          >
            {title}
          </h2>
        </Reveal>
        {lede && (
          <Reveal delay={0.16}>
            <p
              className={cn(
                "mt-5 max-w-[56ch] text-lede text-pretty",
                night ? "text-night-muted" : "text-muted",
              )}
            >
              {lede}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}
