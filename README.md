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
film grain sits over the whole page; sections carry a dot grid or
ruled-paper texture. Product frames are glass bezels (`.glass-frame`), the
navigation floats in a glass pill, the certificate is a white sheet that
floats and tilts toward the pointer with a holographic seal and a foil
sheen. The hero carries the brand's signature stroke cast in glass
(`fx/glass-signature.tsx`, react-three-fiber + drei): a tube along the
wordmark's curve with a transmission material, lit by rendered light panels
and backed by a painted backlight so it has something to refract. It is
desktop-only, never rendered on the server, and falls back to the flat mark
where WebGL is missing or the renderer fails. The hero's product story plays
on load and loops; "How it works" is pinned and scrubbed by the scroll (one
document drafted, prepared, negotiated and signed as the reader moves). The
marquee hurries with scroll velocity. A one-second intro curtain draws the
mark before the page lifts in; the CSS removes it on its own, so it can
never block the page. All of it stands down under `prefers-reduced-motion`.

**Structure.** The page is numbered like a contract. Each section opens
with a rule that draws itself across the page carrying `§ 0n` at one end and
the section's name at the other (`SectionHead`), then its title and a
one-line lede. There are no cards: capabilities are an index beside rows
drawn straight on the page, pricing is one surface divided by hairlines,
and the certificate is a sheet. Sections keep an 80px rhythm on desktop
(`py-16 lg:py-20`).

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
(`npx next dev -p 3100`). "Start free" and "Sign in" point at
`NEXT_PUBLIC_APP_URL`, which defaults to `http://localhost:3000`.

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Development server                  |
| `npm run build`     | Production build                    |
| `npm run start`     | Serve the production build          |
| `npm run lint`      | ESLint (Next core-web-vitals + TS)  |
| `npm run typecheck` | `tsc --noEmit`                      |
| `npm run format`    | Prettier, with Tailwind class order |

## Environment

| Variable                    | Purpose                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`       | Origin of the Zign app. Only `http(s)` origins are accepted; anything else falls back.    |
| `NEXT_PUBLIC_SITE_URL`      | This site's public origin. Enables `metadataBase`, the canonical URL and `/sitemap.xml`.  |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional. When it looks like an address, "Write to us" appears in the FAQ and the footer. |

## Where things are

```
src/
  app/            layout (fonts, metadata, nonce), page, globals.css (tokens),
                  icon.svg, robots.ts, sitemap.ts
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
    providers/    Lenis smooth scroll + MotionConfig
  lib/            motion constants, beat/typing hooks, media-query hooks
public/product/   2x screenshots of zign-v2 in its dark theme (WebP)
```

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
  pattern with arrow-key navigation; the FAQ is a disclosure list.
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
