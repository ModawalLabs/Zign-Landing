import { ButtonLink } from "@/components/ui/button";
import { ChevronLink } from "@/components/ui/chevron-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/* Three ways in, in the pricing's own words (see sections/pricing.tsx). */
const OFFERS = [
  {
    label: "Free Trial",
    title: "Free for 30 days.",
    body: "AI chat with your documents, 3 documents a week and the basic signature tools.",
    cta: "Start free trial",
    featured: true,
  },
  {
    label: "Pay-as-You-Go",
    title: "100 credits for $10.",
    body: "One credit signs one document, and credits never expire.",
    cta: "Buy package",
    featured: false,
  },
  {
    label: "Basic Plan",
    title: "$10 a week.",
    body: "1,000 credits a week, up to 100 documents a day, and every AI feature.",
    cta: "Start basic plan",
    featured: false,
  },
] as const;

/**
 * The home page's last word: three ways to start on one pane of glass,
 * the same glass the product page's pricing stands on.
 */
export function Start() {
  return (
    <section
      aria-labelledby="start-title"
      className="relative isolate overflow-hidden pt-8 pb-32 lg:pb-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-b from-transparent to-night"
      />
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2
            id="start-title"
            className="text-headline text-[clamp(2.25rem,3.6vw,3rem)] tracking-[-0.03em]"
          >
            Start zigning for free.
          </h2>
          <ChevronLink href="/product#pricing" className="mb-1.5">
            Compare plans
          </ChevronLink>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-frame mt-10 rounded-[28px] p-2">
            <div className="grid md:grid-cols-3 md:divide-x md:divide-line-soft">
              {OFFERS.map((offer) => (
                <div
                  key={offer.label}
                  className={cn(
                    "flex flex-col p-7 lg:p-9",
                    offer.featured && "rounded-[22px] bg-indigo-wash/60",
                  )}
                >
                  <p className="text-[14px] font-semibold text-indigo-lift">
                    {offer.label}
                  </p>
                  <h3 className="mt-3 text-[26px] leading-[1.15] font-semibold tracking-[-0.025em]">
                    {offer.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.5] text-pretty text-muted">
                    {offer.body}
                  </p>
                  <div className="mt-auto pt-9">
                    <ButtonLink
                      href={site.links.start}
                      variant={offer.featured ? "ink" : "outline"}
                      arrow={offer.featured}
                    >
                      {offer.cta}
                    </ButtonLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
