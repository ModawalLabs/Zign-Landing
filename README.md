# Zign landing

The marketing site for **Zign**, the agreement copilot. Two pages (home and
product) plus a sign-in screen, built with Next.js 16 (App Router),
Tailwind CSS 4 and Motion, in the product's "Ink & Indigo" language turned
dark-first: ink is the ground, light is the depth, and the documents
themselves stay white paper.

**Type.** Three families, one voice. Geist for the interface, the reading
text and every headline, on every page: semibold, set close
(`text-headline` on the home page, `text-display` elsewhere, the same
drawing), with the home page's gradient (`text-zign`) as the one accent
where a headline wants one. Geist Mono for labels, figures and codes
(every eyebrow is mono). Source Serif only for paper: the documents drawn
on the page (the NDA, the certificates, the sign-in desk) and a quoted
clause. The wordmark is the sans too.

**Colour.** The tokens keep their original names because every component is
written against them: `paper` is the page ground (now near-black), `ink` is
the text (now near-white), `indigo` is the accent lifted for the dark. The
white sheets a document is printed on use their own set (`sheet`,
`paper-ink`, `paper-muted`, `paper-line`, `indigo-ink`, `signed-ink`) so a
contract reads as paper on a dark desk, exactly as the product's dark theme
draws it. Night bands (`night`) sit a step deeper than the page. Zign's own
gradient (`text-zign`: indigo warming through violet to rose) is kept for
the brand's verb, "zign", the line that promises it takes under a
minute, and the product page's own two accents.

**Pages.** The usual SaaS split. Home (`/`) is the pitch, in four short
sections; the product page (`/product`) carries everything else. Both
share one frame, the `(site)` route group's layout: skip link, nav, footer
and grain, so the nav stays mounted between them. The nav reads Product,
Zign AI, Security, Pricing. From home those are links to `/product#…`; on
the product page they become plain anchors so Lenis glides to them, and
Product is marked current. Sign-in sits outside the group.

## Home

Modelled on Apple's product pages (apple.com/apple-music in particular),
then made to move. Apple's page is three moves: a looping video hero with
a masked "swipe-up" headline, tiles whose video plays as they enter, and
snap galleries. Here the page is four scenes in one material language,
the product's own (ink, white paper, indigo, glass), and most of what
moves is driven by the reader's scroll rather than played at them.

1. **The opening** (`home/hero.tsx`), the hero and its proof as one pinned
   scene over a 420vh track. A deep field of Zign's colour (the `.sky`:
   indigo through violet to a little rose, alive but quiet: five soft
   pools each tracing a slow closed orbit of 38 to 58 seconds from a
   staggered start, and three folds of light, each a soft crease of shadow
   over highlight, laid across it and drifting a degree or two the way
   light lies on silk; transforms and opacity only, no blur, no WebGL;
   with a light that follows the pointer), the mark
   alone drawing itself (the name is for screen readers only), "Don't sign
   it. Zign it." at up to 124px rising from
   behind its baseline, one sentence, Start free (magnetic) and Explore
   the product, and the app's window (`home/desk.tsx`, drawn at 1240 ×
   700 and scaled, the same frame as the product page's demo) rising
   into view beneath the words, the way Apple shows a Mac. As the reader
   scrolls, the words lift away, the sky fades to the page's own faint
   weather, the window takes the screen, and the signing plays: Maya's
   link, the mutual NDA opening in the app, Zign AI's answer typing
   itself into the left pane, Hannah's signature writing into her block,
   "Zigned in 0:38", with the signing order, checks and record keeping
   up on the right. A strip above the window carries the title, the three
   steps lighting up and ticking off, and the clock running 0:00 → 0:09
   → 0:30 → 0:38. Every beat is a stretch of one number from 0 to 1
   (`AT` in desk.tsx), so it can be scrubbed back and forth. Below `lg`
   the same DOM stacks (words, title and clock, a compact portrait
   layout of the window, the steps) and the window runs on an 11-second
   clock while it is on screen. The sky holds still when paused (its
   round button, WCAG 2.2.2), once it has faded, and under reduced
   motion, where the story is simply finished.
2. **Zign is for everybody** (`home/everybody.tsx`). Rounded story tiles
   in the owner's order: the deal and the build side by side, then the
   wedding beneath them, wide. Each carries a `SignedSheet`
   (`home/signed-sheet.tsx`) that performs when the tile is seen: the white
   sheet rises, the two signers' portraits spring in at its corners, each
   signs in turn (the script name writes itself in) and is ticked, and on
   the wedding a "Zigned" seal stamps on. It resets off screen so it plays
   again. The words arrive the way Apple's do (`Copy`): the eyebrow fades
   up, the title rises line by line from behind its own baseline, and the
   sentence beneath lights up word by word as the reader scrolls past it,
   from a quieter grey that still reads at 4.5:1 to near white. The tile
   itself rises without blur so the words stay crisp. Each tile has
   Apple's "+" (bottom right): a panel slides up inside the tile with a
   little more and a link to the product page; Escape closes it, and the
   performance pauses while it is open.
3. **Zign AI** (`home/intelligence.tsx`, `home/orb.tsx`). "Sign with a
   Zing." and its sentence on the left, the copilot on the right (stacked
   below `lg`). The copilot is an orb of the hero sky's colours: five
   soft pools turning inside a sphere at their own rates, some against
   the others, so the inside folds like a slow fluid, glossed and shaded
   like glass. It is driven, not looped: a mood sets how fast it turns,
   how bright its halo burns and where it leans (towards the bar while it
   listens, faster and smaller while it thinks, larger while it speaks);
   every keystroke and every spoken word kicks it outward and it settles
   back with a wobble; a sent question and a begun answer each send a
   ring out. Transforms and opacity only, from one frame loop that stops
   off screen, when paused and under reduced motion. Beneath it, Zign AI
   greets the reader ("your agreement copilot"), then three questions
   about the hero's mutual NDA take turns: typed into the bar with a
   person's unevenness while the bar's edge lights in the sky's colours,
   sent, "thinking" with a light passing along the words, answered word
   by word out of a blur, with what it found as chips. The reader can
   pick a question, or type their own in the real input; Zign AI answers
   from the reader's own agreements, so its honest answer is how to
   start, with a Start for free key. Once the reader takes over nothing
   advances by itself and the answers are announced (`aria-live`); a
   Pause stops everything (WCAG 2.2.2). Room is kept for the longest
   answer, so nothing below moves. Then the three things it does, in a
   row.
4. **Start zigning for free** (`home/start.tsx`). Three ways to start on
   one pane of glass (`.glass-frame`, the product page's pricing glass)
   in the pricing's own words, with the site's own keys (white for the
   trial, outline for the rest) and "Compare plans" to the product page.

**People, sparingly.** Six people, and only as portraits: head and
shoulders in a tinted circle with a white ring, the way a contact appears
on a phone (`Avatar` in `ui/person.tsx`). They are Microsoft's Fluent 3D
emoji, MIT licensed (the licence ships in `public/people/LICENSE.txt`),
in a deliberate mix of skin tones, cropped with `sharp` to one frame
(184 × 226 from the 256px source, shoulders on the bottom edge) and saved
as WebP. The source is 256px, so keep a portrait at 120px or less to stay
sharp on a 2x screen. They are decoration (`alt=""`, `aria-hidden`):
whatever they stand for is said in words beside them. Don't scatter them
as stickers; an earlier version did, and it read as a toy. (A later
version swapped them for initials in circles; the owner preferred the
portraits and the tiles, so they stay.)

**One system.** Geist semibold for every headline (hero 124px, scene
titles 68px, captions 28px), one body size per level, one radius for
glass (28px), one for paper (14px), one accent (indigo) and one place
for gradient text ("under a minute."). One easing (`EASE`) for whatever
moves on its own; springs only for things that land (ticks, a pressed
key). Nothing fades text in a loop (the audit checks whatever frame it
lands on): the window's key label rolls, nothing fades, a step still to
come is set quieter, never fainter. Everything that moves on its own
stops off screen and under reduced motion.

**Keep it quick.** About 7,800px on desktop, footer included, most of it
the pinned opening. Add nothing to home that the product page already
says.

## Product page

A short header (title, one line, Start free / See pricing, an "On this
page" list), the product at work (`visuals/hero-demo/`, Zign preparing an
NDA and seeing it signed), then six sections numbered like a contract,
§ 01 to § 06: how it works, Zign AI, the workspace, around the signature,
security, pricing (`productSections` in `config/site.ts` feeds the list
and the progress rail, which lives on this page only). Each section opens
with a rule that draws itself across the page carrying `§ 0n` at one end
and the section's name at the other (`SectionHead`), then its title and a
one-sentence lede. There are no cards: the three capabilities sit on one
surface divided by hairlines, pricing is one pane of glass with the plans
as columns and the recommended plan as an indigo inset within it, and the
certificate is a sheet. Sections keep a 64px rhythm (`py-14 lg:py-16`),
and the page closes on the shared `Closing`.

**Atmosphere and motion.** Depth comes from light: `Aurora`
(`fx/aurora.tsx`) drifts pools of indigo, violet and sky behind the
header, the Copilot band, the pricing surface and the closing; a film
grain sits over every page; sections carry a dot grid. Product frames are
glass bezels (`.glass-frame`), the navigation floats in a glass pill, and
the certificate floats and tilts toward the pointer with a holographic
seal and a foil sheen. The demo plays when it comes into view and loops;
"How it works" is pinned and scrubbed by the scroll (one document drafted,
prepared, negotiated and signed as the reader moves). All of it, on both
pages, stands down under `prefers-reduced-motion`.

**The demo's NDA** (`visuals/hero-demo/sheet.tsx`) is set like a real
short-form mutual NDA under English law: reference line, parties, numbered
"Agreed terms" with defined words in bold quotes, justified serif text, an
execution line and "Signed for and on behalf of" blocks with printed
titles. The parties are fictional and carry no company numbers or
addresses on purpose. The sheet opens at its title and scrolls down while
Zign reads it (`SCROLL`, in the composition's fixed pixels), so clause 3
(the term the story amends) and the signature blocks are in view for the
rest of the story; on phones it shows only clause 3 and the signatures.
Clause 3 must stay the term: the thread, checks and record all name it.

**Keep it tight.** No statement section, no FAQ, three capabilities, three
security guarantees, three product screens, and a 200vh scroll story. Copy
is one sentence per lede and two lines per paragraph. Add a section only
if it carries a point none of these do.

The product itself lives in `../zign-v2`. Nothing on this site claims a
feature, price or mechanism that zign-v2 (or the zign-modules backend it
mirrors) does not have, or that the owner has not supplied ("under a
minute" and the pricing are the owner's).

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
It sits outside the `(site)` group, so it has no nav or footer.

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
  app/            layout (fonts, metadata, nonce), login/ (sign-in),
                  globals.css (tokens), icon.svg, robots.ts, sitemap.ts
    (site)/       the marketing frame (nav, footer, grain): page.tsx is
                  home, product/page.tsx is the product page
  proxy.ts        per-request Content-Security-Policy with a nonce
  config/site.ts  links, navigation and the product page's sections,
                  with URL validation
  components/
    site/         nav (glass pill, hide-on-scroll, accessible mobile menu,
                  page-aware links), footer, progress rail (product page)
    home/         the home page: hero (the pinned opening) and desk (the
                  app window it signs the NDA in), everybody (the tiles
                  and their signed sheets), intelligence and
                  orb (Zign AI), start
    sections/     the product page, one file per section, in page order;
                  product-header opens it, closing ends it, workflow.tsx
                  holds the scroll-scrubbed story
    fx/           aurora, film grain, tilt, magnetic
    visuals/      hero-demo/ (the product at work), workflow/ (the
                  phone-size scenes), instruments.tsx (the small drawings)
    ui/           primitives: reveal, lit words, buttons, chevron link,
                  person,
                  clause eyebrow, section head, signature mark, scramble,
                  autoplay toggle, spotlight
    auth/         the sign-in screen and the providers' marks
    providers/    Lenis smooth scroll + MotionConfig
  lib/            motion constants, beat/typing hooks, media-query hooks
public/product/   2x screenshots of zign-v2 in its dark theme (WebP)
public/people/    the six portraits (Fluent 3D emoji, MIT) and their licence
```

## Performance

Measured with Lighthouse 12 on the production build (`next start`),
October 2026:

| Page       | Desktop | Mobile | Accessibility | Best practices | SEO |
| ---------- | ------- | ------ | ------------- | -------------- | --- |
| `/`        | 100     | 88     | 100           | 100            | 100 |
| `/product` | 99      | 89     | 100           | 100            | 100 |
| `/login`   | 100     | 92     | 100           | 100            | 63  |

The login page's SEO score is its `noindex`, which is deliberate: a
sign-in screen should not be in search results. What keeps the rest
there, and should stay true:

- **The first screen needs no script.** The hero's entrance is CSS
  (`.hero-*` in `globals.css`), and so is the sky, so the page is painted
  as soon as its HTML, CSS and fonts arrive. The sentence under the
  headline is painted from the first frame (dim and soft, then in focus),
  so it is never held back by an animation delay.
- **No 3D, no video.** The home page is type, a CSS sky, six small
  portraits and one CSS window, all driven by scroll position or a
  clock; there is no WebGL, no video and no three.js in the bundle. The
  portraits are 6 to 8 KB WebP each, served as they are.
- **Nothing animates out of sight.** The sky, the sheets and the timed
  window run only while they are on screen, so does the Zign AI orb's
  frame loop, every `Aurora` pauses while its section is off screen, and
  light is drawn with eased gradient stops, not blur filters, which are
  expensive to paint on phones.
- **Nothing text-bearing fades in a loop.** The window's key label rolls
  rather than fades, so no text is ever caught at low
  contrast (the accessibility audit checks whatever frame it lands on).
- **Only first-screen fonts are preloaded**: Geist and Source Serif (roman
  and italic, without the optical-size axis now that the serif is paper
  only). Geist Mono and the signature hand load when first used.

The mobile score is held back by Lighthouse's throttled estimate of LCP:
each run starts a fresh, GPU-less Chrome whose first frame lands after the
scripts have run, and the estimate then counts that script time. The
observed LCP is the first paint on every page, under half a second. What
remains in the report is not ours to fix: Next's built-in polyfills
("legacy JavaScript", 13 KB), and no back/forward cache, because a page
that carries a fresh CSP nonce is rendered per request with `no-store`.

Don't turn on `experimental.inlineCss`. It would remove the render-blocking
stylesheet, but Next 16.3 writes the inlined `<style>` without the nonce,
so the policy blocks it and every page renders unstyled (and it adds about
110 KB of uncompressed CSS to every page).

## Security

- **Content-Security-Policy with a fresh nonce per request** (`src/proxy.ts`).
  Scripts run only with the nonce (`'strict-dynamic'`); `<style>` elements
  need it too. Inline style _attributes_ are allowed (`style-src-attr`),
  because Motion renders its starting styles on the server as attributes and
  a nonce cannot cover an attribute. No third-party origins at all: fonts are
  self-hosted by `next/font`, images are local,
  and there are no analytics or embeds.
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
  the home sky holds still, the window shows the NDA zigned and every
  sheet signed and sealed, the product demo shows its finished
  state, and nothing rotates. The reduced-motion hook is hydration-safe, so the markup never
  disagrees with the server.

## Updating the product screenshots

The images in `public/product/` are 2880×1800 captures of zign-v2 in its
dark theme, converted to WebP with `sharp`. Recapture them from a running
zign-v2 at 1440×900 with a device scale factor of 2, with
`localStorage.theme = "dark"` set before the page loads. Mark the
dashboard's first-run tour as seen first
(`localStorage["zign:tour-seen:u_shivansh"] = "1"`) so it isn't in the shot.
