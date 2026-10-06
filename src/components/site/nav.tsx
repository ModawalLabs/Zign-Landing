"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { useLenis } from "@/components/providers/smooth-scroll";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/ui/signature-mark";
import { site } from "@/config/site";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The navigation floats in a pill of glass. It frosts further once the
 * page moves, steps aside while the reader is heading down, and returns
 * the moment they turn back.
 */
export function Nav() {
  const { scrollY } = useScroll();
  const [raised, setRaised] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setRaised(y > 12);
    if (open) return;
    if (y > 480 && y > previous + 4) setHidden(true);
    else if (y < previous - 4 || y < 480) setHidden(false);
  });

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden ? -120 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5"
      >
        <div
          className={cn(
            "glass-pill pointer-events-auto flex items-center gap-1 rounded-full py-1.5 pr-1.5 pl-2 transition-[background-color] duration-500 ease-(--ease-settle)",
            raised || open ? "bg-card/85" : "bg-card/60",
          )}
        >
          <Link
            href="#top"
            aria-label="Zign, back to the top"
            className="rounded-full px-2.5 py-1"
          >
            <Wordmark draw />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul
              className="flex items-center"
              onMouseLeave={() => setHovered(null)}
            >
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    onFocus={() => setHovered(item.href)}
                    onBlur={() => setHovered(null)}
                    className="relative block rounded-full px-3 py-1.5 text-[13.5px] text-muted transition-colors duration-300 hover:text-ink"
                  >
                    {hovered === item.href && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.06]"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 38,
                        }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <span aria-hidden className="mx-1 hidden h-5 w-px bg-line lg:block" />

          <ButtonLink
            href={site.links.signIn}
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Sign in
          </ButtonLink>
          <ButtonLink
            href={site.links.start}
            size="sm"
            arrow
            className="hidden sm:inline-flex"
          >
            Start free
          </ButtonLink>
          <MenuButton open={open} onToggle={() => setOpen((v) => !v)} />
        </div>
      </motion.header>

      <AnimatePresence>
        {open && <MobileMenu onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function MenuButton({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      className="relative grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-white/[0.06] lg:hidden"
    >
      <span className="relative block h-3 w-[18px]">
        <motion.span
          className="absolute left-0 block h-[1.5px] w-full rounded-full bg-current"
          animate={open ? { top: 5, rotate: 45 } : { top: 0, rotate: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
        <motion.span
          className="absolute left-0 block h-[1.5px] w-full rounded-full bg-current"
          animate={open ? { top: 5, rotate: -45 } : { top: 10, rotate: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </span>
    </button>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const lenis = useLenis();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const close = useCallback(() => onClose(), [onClose]);

  /* While open the page behind holds still, Escape closes, and focus starts
     on the first link and returns to the toggle afterwards. */
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    // The page behind leaves the tab order, so focus stays in the menu.
    const behind = document.querySelectorAll("#main, #site-footer");
    behind.forEach((el) => el.setAttribute("inert", ""));
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      behind.forEach((el) => el.removeAttribute("inert"));
      document.documentElement.style.overflow = "";
      lenis?.start();
      previous?.focus();
    };
  }, [lenis, close]);

  return (
    <motion.div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed inset-0 z-40 bg-paper/96 backdrop-blur-xl lg:hidden"
    >
      <h2 id={titleId} className="sr-only">
        Menu
      </h2>
      <Container className="flex h-full flex-col pt-28 pb-10">
        <ul className="flex flex-col">
          {site.nav.map((item, i) => (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 + i * 0.05 }}
              className="border-b border-line"
            >
              <a
                href={item.href}
                onClick={close}
                className="flex items-baseline justify-between py-5"
              >
                <span className="text-display text-[2rem]">{item.label}</span>
                <span
                  className="font-mono text-[12px] text-subtle"
                  data-tabular
                >
                  0{i + 1}
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
          className="mt-auto grid grid-cols-2 gap-3"
        >
          <ButtonLink href={site.links.signIn} variant="outline">
            Sign in
          </ButtonLink>
          <ButtonLink href={site.links.start} arrow>
            Start free
          </ButtonLink>
        </motion.div>
      </Container>
    </motion.div>
  );
}
