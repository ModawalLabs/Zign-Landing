import { Aurora } from "@/components/fx/aurora";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroDemo } from "@/components/visuals/hero-demo/hero-demo";
import { productSections, site } from "@/config/site";

/** An entrance delay, in seconds. */
const at = (s: number) => ({ animationDelay: `${s}s` });

/**
 * The product page's own opening: what the page covers in one line, the
 * two keys, the page's contents as a row of numbered clauses, and the
 * product at work (Zign preparing an NDA and seeing it signed). Its
 * entrance is CSS, so it is there before any script arrives.
 */
export function ProductHeader() {
  return (
    <section
      id="overview"
      aria-labelledby="product-title"
      className="relative isolate overflow-hidden pt-32 pb-10 md:pt-36 lg:pb-12"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Aurora strength={0.8} />
        <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_30%_30%,#000_20%,transparent_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <Container>
        <p className="rise-in text-eyebrow text-muted" style={at(0.05)}>
          Product
        </p>
        <h1
          id="product-title"
          className="rise-in mt-6 max-w-[18ch] text-display text-[clamp(2.6rem,5.2vw,4.4rem)] leading-[1] tracking-[-0.034em] text-balance"
          style={at(0.1)}
        >
          Every agreement, from first draft to{" "}
          <em className="text-zign not-italic">sealed record.</em>
        </h1>
        <p
          className="rise-in mt-6 max-w-[52ch] text-lede text-pretty text-muted"
          style={at(0.2)}
        >
          Draft with Zign AI, negotiate in the open, sign from any device, and
          keep proof that holds up.
        </p>
        <div className="rise-in mt-8 flex flex-wrap gap-3" style={at(0.28)}>
          <ButtonLink href={site.links.start} size="lg" arrow>
            Start free
          </ButtonLink>
          <ButtonLink href="#pricing" size="lg" variant="outline">
            See pricing
          </ButtonLink>
        </div>

        <nav
          aria-label="On this page"
          className="rise-in mt-14 border-t border-line pt-5"
          style={at(0.36)}
        >
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {productSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex items-baseline gap-2 text-eyebrow text-muted transition-colors duration-300 hover:text-ink"
                >
                  <span className="text-indigo">§&thinsp;{s.n}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="rise-in mt-12 lg:mt-14" style={at(0.45)}>
          <HeroDemo />
        </div>
      </Container>
    </section>
  );
}
