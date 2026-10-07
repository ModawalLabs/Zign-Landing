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
 * One object, not three boxes: a single pane of glass lifted off the night,
 * with the plans as columns inside it. The plan the page recommends is an
 * inset pane within it, tinted and edged in indigo, carrying the white key.
 * Names are set as labels, ticks are bare, and nothing else is decorated.
 */
export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="grain relative isolate scroll-mt-16 overflow-hidden bg-night py-14 lg:py-16"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Aurora strength={0.5} />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-paper" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo/40 to-transparent" />
      </div>

      <Container>
        <SectionHead
          id="pricing-title"
          n="6"
          label="Pricing"
          tone="night"
          title="Plans that grow with the paperwork."
          lede="Start free for 30 days, then pay as you go or by the week."
        />

        <Reveal className="mt-8 md:mt-10">
          <div className="rounded-[26px] border border-white/[0.08] bg-[linear-gradient(180deg,rgb(255_255_255/0.045),rgb(255_255_255/0.012))] p-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_50px_120px_-50px_rgb(0_0_0/0.95)]">
            <div className="grid lg:grid-cols-3">
              {PLANS.map((plan, i) => (
                <article
                  key={plan.slug}
                  aria-labelledby={`plan-${plan.slug}`}
                  className={cn(
                    "relative isolate flex flex-col px-6 py-7 lg:px-8 lg:py-8",
                    plan.featured
                      ? "mt-2 overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,rgb(138_151_240/0.15),rgb(138_151_240/0.04)_60%,rgb(138_151_240/0.02))] shadow-[inset_0_0_0_1px_rgb(169_179_246/0.22),inset_0_1px_0_rgb(255_255_255/0.1),0_24px_60px_-28px_rgb(56_75_199/0.65)] lg:mt-0"
                      : "border-b border-white/[0.06] lg:border-b-0",
                    i === 0 && "lg:border-r lg:border-white/[0.06]",
                  )}
                >
                  {plan.featured && (
                    <>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgb(138_151_240/0.16),transparent)]"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-lift/60 to-transparent"
                      />
                    </>
                  )}

                  <div className="flex h-5 items-center justify-between gap-3">
                    <h3
                      id={`plan-${plan.slug}`}
                      className={cn(
                        "text-eyebrow",
                        plan.featured ? "text-indigo-lift" : "text-night-muted",
                      )}
                    >
                      {plan.name}
                    </h3>
                    {plan.featured && (
                      <span className="rounded-full bg-indigo-lift/12 px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-indigo-lift uppercase">
                        Recommended
                      </span>
                    )}
                  </div>

                  <p className="mt-6 flex items-baseline gap-2 text-night-text">
                    <span
                      className="text-display text-[3.5rem] leading-none tracking-[-0.035em]"
                      data-tabular
                    >
                      {plan.price}
                    </span>
                    <span className="font-mono text-[12px] text-night-muted">
                      / {plan.period}
                    </span>
                  </p>

                  <div className="mt-3 lg:min-h-[3.2rem]">
                    <p className="text-[14.5px] leading-[1.55] text-night-muted">
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

                  <span
                    aria-hidden
                    className={cn(
                      "mt-6 h-px",
                      plan.featured ? "bg-indigo-lift/15" : "bg-white/[0.06]",
                    )}
                  />

                  <ul className="mt-6 space-y-3 text-[14.5px]">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Tick
                          className={cn(
                            "mt-[5px] size-3 shrink-0",
                            plan.featured
                              ? "text-indigo-lift"
                              : "text-night-muted",
                          )}
                        />
                        <span className="text-night-text/90">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
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
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
