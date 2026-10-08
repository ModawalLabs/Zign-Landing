import Image from "next/image";

import { cn } from "@/lib/utils";

/* Six people from Microsoft's Fluent emoji (MIT licence, see
   public/people/LICENSE.txt), cropped to one frame so their shoulders sit
   on the bottom edge of whatever holds them. */
export type PersonName =
  | "woman-with-veil"
  | "man-in-tuxedo"
  | "woman-office-worker"
  | "man-office-worker"
  | "woman-construction-worker"
  | "construction-worker";

/** The frame every person is cropped to, in pixels. */
const W = 184;
const H = 226;

/**
 * One person, head and shoulders. Decoration: what they stand for is
 * said in words beside them, so they stay out of the accessibility tree.
 */
function Person({
  name,
  className,
}: {
  name: PersonName;
  /** Size it with a width class; the height follows the frame. */
  className?: string;
}) {
  return (
    <Image
      src={`/people/${name}.webp`}
      alt=""
      aria-hidden
      width={W}
      height={H}
      unoptimized
      draggable={false}
      className={cn("h-auto select-none", className)}
    />
  );
}

/**
 * A person as a portrait: head and shoulders in a tinted circle with a
 * white ring, the way a contact appears on a phone. `signed` adds a tick.
 */
export function Avatar({
  name,
  tint,
  signed = false,
  className,
}: {
  name: PersonName;
  /** The circle's colour behind them. */
  tint: string;
  signed?: boolean;
  /** Size it with a size class. */
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative block rounded-full shadow-[0_0_0_4px_#fff,0_22px_44px_-14px_rgb(0_0_0/0.7)]",
        className,
      )}
    >
      <span
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ background: tint }}
      >
        <Person
          name={name}
          className="absolute bottom-[-5%] left-1/2 w-[80%] -translate-x-1/2"
        />
      </span>
      {signed && (
        <span className="absolute -right-[2%] -bottom-[2%] grid size-[32%] place-items-center rounded-full bg-signed-ink shadow-[0_0_0_3px_#fff]">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="size-[58%] text-white"
          >
            <path
              d="m3.5 8.3 2.9 2.9 6.1-6.4"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </span>
  );
}
