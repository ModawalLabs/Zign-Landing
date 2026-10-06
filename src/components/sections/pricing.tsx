import { Aurora } from "@/components/fx/aurora";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { Tick } from "@/components/ui/tick";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

type Plan = {
  slug: string;
  name: string;
  price: string;
  period: string;
  description: string;
  /** A small print line under the description. */
  note?: string;
  features: string[];
  cta: string;
  featured: boolean;
};

const PLANS: Plan[] = [
  {
    slug: "free-trial",
    name: "Free Trial",
    price: "$0",
    period: "first month",
    description: "Try the future of signing, free for 30 days.",
    features: [
      "AI chat with your documents",
      "3 documents per week",
      "Basic signature tools",
      "Mobile app access",
    ],
    cta: "Start free trial",
    featured: false,
  },
  {
    slug: "pay-as-you-go",
    name: "Pay-as-You-Go",
    price: "$10",
    period: "100 credits",
    description: "One-time purchase of 100 credits.",
    note: "Credits never expire · 1 credit signs 1 document",
    features: [
      "100 credits for $10",
      "All AI features included",
      "No monthly commitment",
      "Credits never expire",
    ],
    cta: "Buy package",
    featured: false,
  },
  {
    slug: "basic",
    name: "Basic Plan",
    price: "$10",
    period: "week",
    description: "Basic subscription plan for Zign.",
    features: [
      "1,000 credits per week",
      "100 documents per day",
      "All AI features included",
      "Mobile & web access",
      "Standard support",
    ],
    cta: "Start basic plan",
    featured: true,
  },
];

/**
 * One surface, three columns divided by hairlines: no boxes. The plan the
 * page recommends stands in a pool of light and carries the white key.
 */
export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="grain relative isolate scroll-mt-16 overflow-hidden bg-night py-16 lg:py-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Aurora strength={0.5} />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-paper" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo/40 to-transparent" />
      </div>

      <Container>
        <SectionHead
          id="pricing-title"
          n="7"
          label="Pricing"
          tone="night"
          title="Plans that grow with the paperwork."
          lede="Start free for thirty days. Then buy credits as you need them, or subscribe by the week. One credit signs one document."
        />

        <div className="mt-10 grid divide-y divide-night-line border-y border-night-line md:mt-12 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.slug} delay={i * 0.08} className="relative">
              <article
                aria-labelledby={`plan-${plan.slug}`}
                className="relative flex h-full flex-col py-9 lg:px-9 lg:py-10"
              >
                {plan.featured && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,rgb(138_151_240/0.16),transparent)]"
                  />
                )}

                <div className="flex h-6 items-center justify-between">
                  <h3
                    id={`plan-${plan.slug}`}
                    className="text-[15px] font-semibold tracking-[-0.01em] text-night-text"
                  >
                    {plan.name}
                  </h3>
                  {plan.featured && (
                    <span className="rounded-full border border-indigo-lift/30 bg-indigo-lift/10 px-2 py-0.5 text-[11px] font-medium text-indigo-lift">
                      Recommended
                    </span>
                  )}
                </div>

                <p className="mt-7 flex items-baseline gap-1.5 text-night-text">
                  <span
                    className="text-display text-[3.25rem] leading-none tracking-[-0.035em]"
                    data-tabular
                  >
                    {plan.price}
                  </span>
                  <span className="text-[14px] text-night-muted">
                    / {plan.period}
                  </span>
                </p>

                <div className="mt-3 lg:min-h-[3.4rem]">
                  <p className="text-[15px] leading-[1.55] text-night-muted">
                    {plan.description}
                  </p>
                  {plan.note && (
                    <p
                      className="mt-1 text-[12px] text-night-muted/80"
                      data-tabular
                    >
                      {plan.note}
                    </p>
                  )}
                </div>

                <ul className="mt-7 space-y-3 text-[15px]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-[3px] grid size-4 shrink-0 place-items-center rounded-full",
                          plan.featured
                            ? "bg-indigo-lift/20 text-indigo-lift"
                            : "bg-white/[0.07] text-night-muted",
                        )}
                      >
                        <Tick className="size-2.5" />
                      </span>
                      <span className="text-night-text/90">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-9">
                  <ButtonLink
                    href={site.links.start}
                    variant={plan.featured ? "ink" : "outline"}
                    arrow
                    className="w-full"
                  >
                    {plan.cta}
                  </ButtonLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-5 text-[13px] text-night-muted/80">
          Prices in US dollars, before any applicable tax.
        </p>
      </Container>
    </section>
  );
}
