import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* The custom type utilities are unknown to tailwind-merge, which would drop
   them beside a text-* size. Registering them keeps both. */
const twMerge = extendTailwindMerge<"zign-type">({
  extend: {
    classGroups: {
      "zign-type": [
        "text-display",
        "text-eyebrow",
        "text-lede",
        "text-title",
        "text-ink-sweep",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
