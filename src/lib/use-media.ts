"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribe to a media query. On the server, and on the first client
 * render, it answers `false`, so markup never disagrees during hydration.
 */
export function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Whether the reader asked for reduced motion, answered the same way on the
 * server and during hydration (false) and corrected straight after. Motion's
 * own hook reads the media query on the client's first render, which makes
 * the markup disagree with the server's whenever it changes what is drawn.
 */
export function usePrefersReducedMotion() {
  return useMedia("(prefers-reduced-motion: reduce)");
}
