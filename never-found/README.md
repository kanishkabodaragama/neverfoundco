# Never Found — homepage template

A mobile-first Next.js 14 (App Router) + Tailwind homepage for the streetwear
brand Never Found, built around an acid-yellow base color and a "lost
evidence / case file" visual concept.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What's inside

- `app/layout.tsx` — loads three Google Fonts: Anton (condensed display,
  used for big headlines), Space Mono (utility/label text — tags, prices,
  status), Inter (body copy).
- `app/globals.css` — color tokens, the scrolling ticker animation, a subtle
  grain overlay, and the yellow-outline "text-stroke" headline treatment.
- `components/Nav.tsx` — sticky nav with a mobile hamburger menu (no
  external menu library, just state + Tailwind).
- `components/Ticker.tsx` — the signature element: a looping "tracking
  strip" (`STATUS: NEVER FOUND — LAST SEEN: EVERYWHERE — ...`) used at the
  top and bottom of the page. Pauses automatically if the visitor has
  reduced-motion enabled.
- `components/Hero.tsx` — full-bleed yellow block, oversized stacked
  wordmark, perforated/torn bottom edge.
- `components/Statement.tsx` — brand manifesto with a yellow-stroke
  headline and small stat row (drop size, restock count, etc).
- `components/EvidenceGrid.tsx` — product grid styled as tilted "evidence
  cards," with a sold-out state ("Never found again").
- `components/DropStrip.tsx` — email capture for drop alerts.
- `components/Footer.tsx` — closes the page with the same ticker strip.

## About the logo file

`logo_nvr_fnd.png` was uploaded as a solid black 7110×8000 image with no
visible artwork in it (likely an export issue — alpha channel may have been
flattened to black, or the wrong layer was exported). I copied it into
`/public` so it's wired up and ready, but the homepage currently uses a
text-based wordmark ("NEVER" + boxed "FOUND") instead of the image, since
the file has nothing visible to render.

To swap in the real mark once you have a working file:

```tsx
import Image from "next/image";

<Image src="/logo_nvr_fnd.png" alt="Never Found" width={140} height={40} />
```

Re-export the logo as a PNG with a transparent background (or place it on
the acid-yellow or near-black background) and it'll drop straight in.

## Customizing

- Colors live in `tailwind.config.ts` (`ink`, `bone`, `acid`, `acid-dim`,
  `rust`) and `app/globals.css` (`:root` CSS variables) — change `--yellow`
  in one place to retune the whole palette.
- Product data is a plain array at the top of `EvidenceGrid.tsx` — swap in
  real product photography, names, and prices there.
- The ticker copy is an array at the top of `Ticker.tsx`.
