"use client";

import { motion, useMotionValue, useSpring } from "motion/react";

import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

/** A control that leans toward the pointer while it is over it. */
export function Magnetic({
  children,
  className,
  strength = 0.32,
}: {
  children: React.ReactNode;
  className?: string;
  /** How far the control follows, as a share of the pointer's offset. */
  strength?: number;
}) {
  const reduce = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.5 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={cn("inline-block", className)}
      style={reduce ? undefined : { x: sx, y: sy }}
      onPointerMove={reduce ? undefined : onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
