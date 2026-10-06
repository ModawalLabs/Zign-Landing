import { Aurora } from "@/components/fx/aurora";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/ui/signature-mark";
import { site } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();
  const columns = [
    {
      title: "Product",
      links: site.nav.map((n) => ({ label: n.label, href: n.href })),
    },
    {
      title: "Get started",
      links: [
        { label: "Start free", href: site.links.start },
        { label: "Sign in", href: site.links.signIn },
        { label: "Questions", href: "#faq" },
        ...(site.links.contact
          ? [{ label: "Contact", href: site.links.contact }]
          : []),
      ],
    },
  ];

  return (
    <footer
      id="site-footer"
      className="relative isolate overflow-hidden bg-night text-night-text"
    >
      {/* A little of the closing's light carries on, gathering low around
          the name rather than starting afresh at the footer's edge. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,#000_45%)]"
      >
        <Aurora strength={0.45} />
      </div>

      <Container className="pt-16 pb-8 md:pt-20">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark tone="paper" />
            <p className="mt-6 max-w-[34ch] text-[15px] leading-[1.65] text-night-muted">
              The agreement copilot. Draft, negotiate and sign with an AI that
              reads every clause, and keep a sealed record of every step.
            </p>
            <ButtonLink
              href={site.links.start}
              variant="ink"
              arrow
              className="mt-8"
            >
              Start free
            </ButtonLink>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-10 lg:col-span-5 lg:col-start-8"
          >
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="text-eyebrow text-night-muted">{col.title}</h2>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-[15px] text-night-text/85 transition-colors hover:text-white"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-night-line pt-6 text-[13px] text-night-muted sm:flex-row">
          <p>&copy; {year} Zign. All rights reserved.</p>
          <p>Ink, paper and one indigo line.</p>
        </div>
      </Container>

      {/* The name, set large and cut by the page's edge, lit from above. */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.24em] bg-gradient-to-b from-white/[0.1] to-white/0 bg-clip-text text-center font-serif text-[clamp(6rem,22vw,20rem)] leading-[0.8] font-semibold tracking-[-0.05em] text-transparent select-none"
      >
        Zign
      </p>
    </footer>
  );
}
