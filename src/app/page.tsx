import { connection } from "next/server";

import { FilmGrain } from "@/components/fx/grain";
import { Intro } from "@/components/fx/intro";
import { Capabilities } from "@/components/sections/capabilities";
import { Closing } from "@/components/sections/closing";
import { Copilot } from "@/components/sections/copilot";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Pricing } from "@/components/sections/pricing";
import { Record } from "@/components/sections/record";
import { Statement } from "@/components/sections/statement";
import { Workflow } from "@/components/sections/workflow";
import { Workspace } from "@/components/sections/workspace";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";
import { ProgressRail } from "@/components/site/progress-rail";
import { SpotlightTracker } from "@/components/ui/spotlight";

export default async function Home() {
  // Rendered per request so the Content-Security-Policy nonce can be applied.
  await connection();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>
      <Intro />
      <Nav />
      <main id="main" className="overflow-x-clip">
        <Hero />
        <Marquee />
        <Statement />
        <Workflow />
        <Copilot />
        <Workspace />
        <Capabilities />
        <Record />
        <Pricing />
        <Faq />
        <Closing />
      </main>
      <Footer />
      <ProgressRail />
      <SpotlightTracker />
      <FilmGrain />
    </>
  );
}
