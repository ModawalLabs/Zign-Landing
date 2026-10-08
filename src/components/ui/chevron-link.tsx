import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The quiet second action beside a key: a coloured link with a chevron
 * that steps forward on hover.
 */
export function ChevronLink({
  href,
  tone = "indigo",
  className,
  children,
}: {
  href: string;
  /** White when it sits on a coloured ground. */
  tone?: "indigo" | "white";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1 rounded-full text-[16px] font-medium tracking-[-0.01em] transition-colors duration-300",
        tone === "white"
          ? "text-white hover:text-white/75"
          : "text-indigo-lift hover:text-white",
        className,
      )}
    >
      {children}
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        aria-hidden
        className="mt-px transition-transform duration-300 ease-(--ease-settle) group-hover:translate-x-0.5"
      >
        <path
          d="M6 3.5 10.5 8 6 12.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
