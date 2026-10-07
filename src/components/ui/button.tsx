import Link from "next/link";

import { cn } from "@/lib/utils";

type Variant = "ink" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.005em] whitespace-nowrap transition-[background-color,color,box-shadow,border-color] duration-300 ease-(--ease-settle) select-none";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13.5px]",
  md: "h-10 px-[18px] text-[14px]",
  lg: "h-11 px-5 text-[14.5px]",
};

/* On the dark page the primary key is the one white thing; the others are
   drawn in hairlines and glass. */
const variants: Record<Variant, string> = {
  ink: "key-ink bg-ink text-paper hover:bg-white",
  outline:
    "border border-line bg-card/40 text-ink backdrop-blur-sm hover:border-[#3a3d47] hover:bg-card",
  ghost: "text-ink hover:bg-white/[0.06]",
};

export function ButtonLink({
  href,
  variant = "ink",
  size = "md",
  arrow = false,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

/** The same key as ButtonLink, for actions that stay on the page. */
export function Button({
  type = "button",
  variant = "ink",
  size = "md",
  arrow = false,
  className,
  children,
}: {
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type={type}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}

/** An arrow whose shaft draws out as its head travels, on hover. */
function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      aria-hidden
      className={cn("-mr-0.5 overflow-visible", className)}
    >
      <path
        d="M1 8h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="origin-left scale-x-0 transition-transform duration-300 ease-(--ease-settle) group-hover/btn:scale-x-100"
      />
      <path
        d="M7.5 3.5 12 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="-translate-x-[3px] transition-transform duration-300 ease-(--ease-settle) group-hover/btn:translate-x-0.5"
      />
    </svg>
  );
}
