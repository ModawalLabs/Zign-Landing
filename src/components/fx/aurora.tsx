import { cn } from "@/lib/utils";

/**
 * Slow weather behind a section: pools of indigo, violet and sky light
 * that drift and breathe on a long cycle over the dark, with one faint
 * warm pool so the page never reads cold. Under reduced motion they hold
 * still.
 */
export function Aurora({
  strength = 1,
  className,
}: {
  /** Scales every pool's opacity; 1 is the hero's weather. */
  strength?: number;
  className?: string;
}) {
  const pool = (rgb: string, alpha: number) => ({
    background: `radial-gradient(closest-side, rgb(${rgb} / ${Math.min(1, alpha * strength).toFixed(3)}), transparent)`,
  });
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className="aurora-a absolute -top-[25%] left-[-12%] h-[75%] w-[62%] rounded-full blur-3xl"
        style={pool("56 75 199", 0.34)}
      />
      <div
        className="aurora-b absolute top-[5%] right-[-18%] h-[85%] w-[58%] rounded-full blur-3xl"
        style={pool("107 92 231", 0.3)}
      />
      <div
        className="aurora-c absolute bottom-[-35%] left-[18%] h-[75%] w-[64%] rounded-full blur-3xl"
        style={pool("127 176 255", 0.18)}
      />
      <div
        className="aurora-b absolute top-[28%] left-[34%] h-[45%] w-[38%] rounded-full blur-3xl"
        style={pool("255 200 160", 0.08)}
      />
    </div>
  );
}
