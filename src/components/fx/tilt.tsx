"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

/**
 * A card that leans a few degrees toward the pointer. Small angles only:
 * it should feel like a sheet on a desk being looked at, not a trading
 * card. The glare is the `.spotlight` the child carries.
 */
export function TiltCard({
  children,
  className,
  max = 3.5,
}: {
  children: React.ReactNode;
  className?: string;
  /** The furthest lean, in degrees. */
  max?: number;
}) {
  const reduce = usePrefersReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 170, damping: 22, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 170, damping: 22, mass: 0.6 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      style={
        reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }
      }
      onPointerMove={reduce ? undefined : onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
