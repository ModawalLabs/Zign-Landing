"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useState } from "react";

const LenisContext = createContext<Lenis | null>(null);

/** The page's scroller, for anything that has to pause or steer it. */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis carries the page's scroll so long reads glide rather than step.
 * It drives the native scroll position, so every scroll-linked animation
 * reads the same value it would without it. Anyone who asked for reduced
 * motion keeps the browser's own scroll.
 */
export function SmoothScroll({
  children,
  nonce,
}: {
  children: React.ReactNode;
  /** This request's CSP nonce, for any style motion has to inject. */
  nonce?: string;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      autoRaf: true,
      anchors: { offset: -72 },
    });
    // Publishing the instance once it exists is the point of this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      <MotionConfig reducedMotion="user" nonce={nonce}>
        {children}
      </MotionConfig>
    </LenisContext.Provider>
  );
}
