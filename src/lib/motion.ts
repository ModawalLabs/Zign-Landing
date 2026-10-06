import type { Transition } from "motion/react";

/**
 * One motion vocabulary for the page. Things arrive like a weighted sheet
 * settling on a desk: quick out of the gate, a long quiet finish, no
 * overshoot. The product moves the same way.
 */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const GLIDE = [0.65, 0, 0.35, 1] as const;

export const SETTLE: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 34,
  mass: 0.9,
};

export const SOFT: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 26,
  mass: 1,
};

export const arrive = (delay = 0, duration = 0.9): Transition => ({
  duration,
  delay,
  ease: EASE,
});
