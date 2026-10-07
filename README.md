# Zign landing

The marketing site for **Zign**, the agreement copilot. One page, built with
Next.js 16 (App Router), Tailwind CSS 4, Motion and a little Three.js, in
the product's "Ink & Indigo" language turned dark-first: ink is the ground,
light is the depth, and the documents themselves stay white paper.

**Type.** Three families and one scale. Geist for the interface and reading
text; Geist Mono for labels, figures and codes (every eyebrow is mono);
Source Serif 4 for display. Serif display runs at ~46px for section titles
and ~88px in the hero, and the italic appears exactly twice, in the hero and
the closing line. Card and list titles are the sans (`text-title`).

**Colour.** The tokens keep their original names because every component is
written against them: `paper` is the page ground (now near-black), `ink` is
the text (now near-white), `indigo` is the accent lifted for the dark. The
white sheets a document is printed on use their own set (`sheet`,
`paper-ink`, `paper-muted`, `paper-line`, `indigo-ink`, `signed-ink`) so a
contract reads as paper on a dark desk, exactly as the product's dark theme
draws it. Night bands (`night`) sit a step deeper than the page.

**Atmosphere and motion.** Depth comes from light: `Aurora`
(`src/components/fx/aurora.tsx`) drifts pools of indigo, violet and sky
behind the hero, the Copilot band, the pricing surface and the closing; a
film grain sits over the whole page; sections carry a dot grid. Product
frames are glass bezels (`.glass-frame`), the
navigation floats in a glass pill, the certificate is a white sheet that
floats and tilts toward the pointer with a holographic seal and a foil
sheen. The hero carries the brand's signature stroke cast in glass
(`fx/glass-signature.tsx`, react-three-fiber + drei): a tube along the
wordmark's curve in clear, smoked crystal. It is lit like a product shot
(white softbox, side strip, back rim, one low indigo fill) and bends a
private backdrop of soft strip lights that only the glass sees, so it
reads through lines of light and the page gets no halo or extra colour.
Indigo appears only in its lower reflections; keep it that restrained. It
is desktop-only, never rendered on the server, and where WebGL is missing
or the renderer fails its poster simply stays. The hero's product story plays
on load and loops; "How it works" is pinned and scrubbed by the scroll (one
document drafted, prepared, negotiated and signed as the reader moves). The
marquee hurries with scroll velocity. A short intro curtain signs the mark
before the page lifts in. All of it stands down under
`prefers-reduced-motion`.

**Structure.** The page is numbered like a contract, § 01 to § 06: how it
works, Zign AI, the workspace, around the signature, security, pricing.
Each section opens with a rule that draws itself across the page carrying
`§ 0n` at one end and the section's name at the other (`SectionHead`), then
its title and a one-sentence lede. There are no cards: the three
capabilities sit on one surface divided by hairlines, pricing is one pane
of glass with the plans as columns and the recommended plan as an indigo
inset within it, and the certificate is a sheet. Sections keep
a 64px rhythm on desktop (`py-14 lg:py-16`).

**Keep it tight.** The page was cut to its main points on purpose (about
9,500px on desktop, down from 12,200): no statement section, no FAQ, three
capabilities, three security guarantees, three product screens, and a
200vh scroll story. Copy is one sentence per lede and two lines per
paragraph. Add a section only if it carries a point none of these do.

The product itself lives in `../zign-v2`. Nothing on this page claims a
feature, price or mechanism that zign-v2 (or the zign-modules backend it
mirrors) does not have.

## Running it

```bash
npm install
cp .env.example .env.local   # optional; every variable has a safe default
npm run dev                  # http://localhost:3000, or pass -p 3100
```

If zign-v2 is also running on port 3000, start this one on another port
(`npx next dev -p 3100`).

Before publishing, set `NEXT_PUBLIC_SITE_URL` to this site's origin.
Without it the page has no canonical URL and the sitemap has no entries.

## Sign-in page

"Sign in" opens `/login`; every "Start free" (and every plan's button)
opens `/login?mode=signup`, the same page with sign-up wording. It is the
design only: Google, Apple and email are laid out, and nothing is sent. The
form is the one place a real auth flow plugs in later
(`src/components/auth/sign-in.tsx`). Beside it on wide screens a pile of
three example documents takes turns on top, every 6.5 seconds: a marriage
certificate, a mutual NDA and an offer letter (all fictional, in `DOCS`).
Each waits for the reader's signature; typing an address writes it on the
one on top and holds it there, and a complete-looking address seals it.
The turns pause under the pointer and on focus, can be stopped, can be
chosen by hand from the numbered tabs, and never run under reduced motion. The page is `noindex`.
Coming back to the home page from it in the same visit skips the intro
curtain (`introHasPlayed` in `fx/intro.tsx`).

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Development server                  |
| `npm run build`     | Production build                    |
| `npm run start`     | Serve the production build          |
| `npm run lint`      | ESLint (Next core-web-vitals + TS)  |
| `npm run typecheck` | `tsc --noEmit`                      |
| `npm run format`    | Prettier, with Tailwind class order |

## Environment

| Variable                    | Purpose                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`      | This site's public origin. Enables `metadataBase`, the canonical URL and `/sitemap.xml`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional. When it looks like an address, a "Contact" link appears in the footer.         |

## Where things are

```
src/
  app/            layout (fonts, metadata, nonce), page, login/ (sign-in),
                  globals.css (tokens), icon.svg, robots.ts, sitemap.ts
  proxy.ts        per-request Content-Security-Policy with a nonce
  config/site.ts  links and navigation, with URL validation
  components/
    site/         nav (glass pill, hide-on-scroll, accessible mobile menu),
                  footer, progress rail
    sections/     one file per section, in page order; workflow.tsx holds
                  the scroll-scrubbed document story
    fx/           aurora, film grain, intro curtain, tilt, magnetic,
                  glass-signature (WebGL)
    visuals/      hero-demo/ (the looping product story), workflow/ (the
                  phone-size scenes), instruments.tsx (the small drawings)
    ui/           primitives: reveal, buttons, clause eyebrow, section head,
                  signature mark, scramble, autoplay toggle, spotlight
    auth/         the sign-in screen and the providers' marks
    providers/    Lenis smooth scroll + MotionConfig
  lib/            motion constants, beat/typing hooks, media-query hooks
public/product/   2x screenshots of zign-v2 in its dark theme (WebP)
public/hero/      the glass poster (a still of the live 3D scene, WebP)
```

## Performance

Measured with Lighthouse on the production build: desktop 97 to 98, mobile
75 to 82 (run to run), with accessibility, best practices and SEO at 100 on
both. What keeps it
there, and should stay true:

- **The first screen needs no script.** The intro curtain and the hero's
  entrance are CSS (`.intro-*`, `.hero-*` in `globals.css`), so the page is
  painted as soon as its HTML, CSS and fonts arrive. The lede, the largest
  element, is painted from the first frame (dim and out of focus under the
  curtain), so it is never held back by an animation delay.
- **The glass is there at once and comes alive later.** A poster of it
  (`public/hero/glass.webp`, 13 KB, desktop only through a `<picture>`
  media source) is painted with the first frame. The live scene's code
  (three.js, about 250 KB compressed) is fetched while the browser is idle
  after load; the renderer starts on the reader's first move, scroll or
  key, or after five seconds, and fades in over the poster in the same
  pose (every motion in the scene is zero at the start and eases in, and
  the canvas measures its box's layout size so it matches the poster even
  mid-entrance). Under reduced motion, or without WebGL, the poster stays.
  The scene stops drawing while off screen, three.js does not wait on
  shader compile checks, and the light studio is built by hand rather than
  with drei's `Environment`, which would bring HDR and EXR loaders.
- **Re-rendering the poster.** If the glass scene changes, render a new
  still: run the production build at 1440×900 with a device scale factor
  of 1.5, start the glass (move the pointer), switch on reduced motion (the
  scene draws one frame at rest), hide everything but the hero canvas,
  capture the `.hero-glass` box on a transparent background, and encode it
  as WebP with alpha (`sharp`, quality 80).
- **Nothing animates out of sight.** Every `Aurora` pauses while its section
  is off screen, and so does the marquee. The light pools are drawn with
  eased gradient stops, not blur filters, which are expensive to paint on
  phones.
- **Only first-screen fonts are preloaded**: Geist and Source Serif (roman
  and italic). Geist Mono and the signature hand load when first used.

The mobile score is held back by Lighthouse's throttled estimate of LCP:
each run starts a fresh, GPU-less Chrome whose first frame lands after the
scripts have run, and the estimate then counts that script time. In a warm
browser the page first paints at about 200 ms on a phone with the lede in
that frame. The one large lever left is the display font: Source Serif's
optical-size axis makes its two files 246 KB; without the axis they are
99 KB, at the cost of the display cut at large sizes.

## Security

- **Content-Security-Policy with a fresh nonce per request** (`src/proxy.ts`).
  Scripts run only with the nonce (`'strict-dynamic'`); `<style>` elements
  need it too. Inline style _attributes_ are allowed (`style-src-attr`),
  because Motion renders its starting styles on the server as attributes and
  a nonce cannot cover an attribute. No third-party origins at all: fonts are
  self-hosted by `next/font`, images are local, the 3D scene's environment
  is rendered rather than fetched, there are no analytics or embeds.
  `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`. The page
  is rendered per request (`connection()`) so the nonce can be applied.
- **Response headers** (`next.config.ts`): HSTS, `nosniff`,
  `X-Frame-Options: DENY`, a strict `Referrer-Policy`, a `Permissions-Policy`
  that switches off camera, microphone, geolocation and payment, COOP/CORP
  `same-origin`. `X-Powered-By` is removed.
- **Configured links are validated**: the app URL must be an `http(s)`
  origin and the contact address must look like one, so an environment
  value can never become a `javascript:` link.
- No `dangerouslySetInnerHTML`, no user input, no forms, no cookies, no
  client storage.
- `npm audit --omit=dev` reports no vulnerabilities. The remaining advisory
  is in `braces`, reached only through `eslint-config-next` (lint tooling,
  never shipped).

## Accessibility

- Landmarks, a skip link, one `h1`, and every section labelled by its heading.
- The tab lists (Copilot questions, product screens) follow the ARIA tabs
  pattern with arrow-key navigation.
- The mobile menu is a modal dialog: focus moves in, the page behind is
  `inert`, Escape closes it and focus returns to the toggle.
- Anything that advances on its own pauses on hover and focus and has a
  Pause control (WCAG 2.2.2). The scroll-scrubbed story moves only when the
  reader scrolls, and its four steps are reachable as buttons.
- `prefers-reduced-motion`: smooth scrolling is off, transforms are skipped,
  the hero shows its finished state, the glass holds still, and nothing
  rotates. The reduced-motion hook is hydration-safe, so the markup never
  disagrees with the server.

## Updating the product screenshots

The images in `public/product/` are 2880×1800 captures of zign-v2 in its
dark theme, converted to WebP with `sharp`. Recapture them from a running
zign-v2 at 1440×900 with a device scale factor of 2, with
`localStorage.theme = "dark"` set before the page loads. Mark the
dashboard's first-run tour as seen first
(`localStorage["zign:tour-seen:u_shivansh"] = "1"`) so it isn't in the shot.
