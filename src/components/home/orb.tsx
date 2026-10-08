"use client";

import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect } from "react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type OrbMood = "idle" | "listening" | "thinking" | "speaking";

/* How each mood moves: how fast the light inside turns (degrees a
   second), how brightly the halo burns, how large the sphere sits, where
   it leans (towards the prompt while it listens), and how hard a
   keystroke or a word kicks it. */
const MOOD: Record<
  OrbMood,
  { speed: number; glow: number; scale: number; lean: number; kick: number }
> = {
  idle: { speed: 14, glow: 0.55, scale: 1, lean: 0, kick: 0.3 },
  listening: { speed: 32, glow: 0.8, scale: 1.03, lean: 7, kick: 0.5 },
  thinking: { speed: 130, glow: 1, scale: 0.93, lean: -3, kick: 0.6 },
  speaking: { speed: 46, glow: 1, scale: 1.05, lean: 0, kick: 0.34 },
};

/* The light inside: the hero sky's colours, each a soft pool turning on
   its own radius at its own rate, some against the others, so the inside
   folds over itself like a slow fluid. `turn` is where it starts. */
const POOLS = [
  {
    color: "#6a44e8",
    size: "74%",
    at: "left-[-8%] top-[-10%]",
    rate: 1,
    turn: 0,
  },
  {
    color: "#2f35d4",
    size: "82%",
    at: "right-[-24%] bottom-[-22%]",
    rate: -1.3,
    turn: 40,
  },
  {
    color: "#c75a86",
    size: "54%",
    at: "left-[6%] bottom-[-6%]",
    rate: 0.74,
    turn: 150,
  },
  {
    color: "#7fb0ff",
    size: "44%",
    at: "right-[2%] top-[4%]",
    rate: -0.6,
    turn: 220,
  },
  {
    color: "#a35ad0",
    size: "50%",
    at: "left-[30%] top-[26%]",
    rate: 1.65,
    turn: 300,
  },
] as const;

/**
 * Zign AI's presence on the page: a sphere of the hero's colours with
 * light turning inside it like a fluid. It is driven rather than looped.
 * `mood` sets how fast the inside turns, how bright it burns and where
 * it leans; every change of `pulse` (a keystroke, a word spoken) kicks it
 * outward a little, and it settles back with a wobble; every change of
 * `ripple` sends a ring of light out from its edge. When `live` is false
 * it holds perfectly still.
 */
export function Orb({
  mood,
  pulse,
  ripple,
  live,
  className,
}: {
  mood: OrbMood;
  pulse: number;
  ripple: number;
  live: boolean;
  className?: string;
}) {
  const m = MOOD[mood];
  const angle = useMotionValue(0);
  const time = useMotionValue(0);
  const kick = useMotionValue(0);
  const speed = useSpring(m.speed, { stiffness: 40, damping: 18 });
  const glow = useSpring(m.glow, { stiffness: 60, damping: 20 });
  const size = useSpring(m.scale, { stiffness: 120, damping: 14 });
  const lean = useSpring(m.lean, { stiffness: 70, damping: 16 });

  useEffect(() => {
    speed.set(m.speed);
    glow.set(m.glow);
    size.set(m.scale);
    lean.set(m.lean);
  }, [m, speed, glow, size, lean]);

  /* A kick outward, then back with a little overshoot, like a drop. */
  useEffect(() => {
    if (!live || pulse === 0) return;
    const controls = animate(kick, [Math.min(1, kick.get() + m.kick), 0], {
      type: "spring",
      stiffness: 240,
      damping: 11,
    });
    return () => controls.stop();
  }, [pulse, live, kick, m.kick]);

  useAnimationFrame((_, delta) => {
    if (!live) return;
    const dt = Math.min(delta, 64) / 1000;
    angle.set(angle.get() + speed.get() * dt);
    time.set(time.get() + dt);
  });

  /* The sphere is never quite round: it breathes a little out of step
     on its two axes, and a kick squashes it wider than it is tall. */
  const scaleX = useTransform(
    () =>
      size.get() * (1 + 0.014 * Math.sin(time.get() * 1.7) + 0.07 * kick.get()),
  );
  const scaleY = useTransform(
    () =>
      size.get() *
      (1 + 0.014 * Math.cos(time.get() * 1.3) + 0.035 * kick.get()),
  );
  const y = useTransform(() => lean.get() + 5 * Math.sin(time.get() * 0.8));
  const haloOpacity = useTransform(
    () =>
      glow.get() * (0.86 + 0.14 * Math.sin(time.get() * 2.1)) +
      0.25 * kick.get(),
  );
  const haloScale = useTransform(
    () => 0.92 + 0.16 * glow.get() + 0.1 * kick.get(),
  );
  const core = useTransform(() => 0.05 + 0.12 * glow.get() + 0.4 * kick.get());
  const sheen = useTransform(angle, (a) => a * 1.6);

  return (
    <div aria-hidden className={cn("relative aspect-square", className)}>
      {/* The light it throws on the dark around it. */}
      <motion.div
        className="pointer-events-none absolute -inset-[42%] rounded-full bg-[radial-gradient(closest-side,rgb(106_68_232/0.5),rgb(58_53_204/0.22)_48%,transparent)] blur-2xl"
        style={{ opacity: haloOpacity, scale: haloScale }}
      />

      {ripple > 0 && (
        <motion.span
          key={ripple}
          className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_1px_rgb(169_179_246/0.3),0_0_32px_6px_rgb(106_68_232/0.4)]"
          initial={{ scale: 1, opacity: 0.9 }}
          animate={{ scale: 1.45, opacity: 0 }}
          transition={{ duration: 1.4, ease: EASE }}
        />
      )}

      <motion.div className="absolute inset-0" style={{ y }}>
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-full bg-[#0c0a2a] shadow-[0_30px_80px_-20px_rgb(58_53_204/0.6)]"
          style={{ scaleX, scaleY }}
        >
          {POOLS.map((pool) => (
            <Pool key={pool.color} pool={pool} angle={angle} />
          ))}

          {/* A bright core that flares as it hears and speaks. */}
          <motion.div
            className="absolute inset-[30%] rounded-full bg-[#efeaff] blur-[22px]"
            style={{ opacity: core }}
          />

          {/* Light caught on the surface, turning faster than the inside:
              two soft lobes, off the centre so nothing pinches there. */}
          <motion.div
            className="absolute -inset-[20%] mix-blend-soft-light will-change-transform"
            style={{
              rotate: sheen,
              background:
                "radial-gradient(34% 22% at 30% 34%, rgb(255 255 255 / 0.75), transparent), radial-gradient(28% 18% at 72% 70%, rgb(255 255 255 / 0.5), transparent)",
            }}
          />

          {/* Depth: darker towards the rim, glossed from above. */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_56%,transparent_46%,rgb(8_7_30/0.6)_100%)]" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(58%_42%_at_36%_18%,rgb(255_255_255/0.32),rgb(255_255_255/0.05)_55%,transparent_72%)]" />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14),inset_0_-18px_40px_rgb(10_8_40/0.55),inset_0_12px_30px_rgb(255_255_255/0.08)]" />
        </motion.div>
      </motion.div>
    </div>
  );
}

function Pool({
  pool,
  angle,
}: {
  pool: (typeof POOLS)[number];
  angle: MotionValue<number>;
}) {
  const rotate = useTransform(angle, (a) => pool.turn + a * pool.rate);
  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ rotate }}
    >
      <div
        className={cn("absolute rounded-full opacity-90 blur-[20px]", pool.at)}
        style={{
          width: pool.size,
          height: pool.size,
          background: pool.color,
        }}
      />
    </motion.div>
  );
}
