import { FilmGrain } from "@/components/fx/grain";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";

/**
 * The marketing pages (home and product) share one frame: the skip link,
 * the floating nav, the footer and the page's grain. The nav stays mounted
 * as the reader moves between them. Sign-in has its own frame.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="overflow-x-clip">
        {children}
      </main>
      <Footer />
      <FilmGrain />
    </>
  );
}
