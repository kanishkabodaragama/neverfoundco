# NEVERFOUND slide menu

Next.js (App Router) template recreating the mobile slide-out menu.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the menu is open by default in `app/page.tsx`
so you can see it immediately; tap the × to close, "MENU" to reopen.

## Where everything lives

- `components/SlideMenu.tsx` — the whole menu. Built as 4 stacked layers
  (base color → logo shapes → texture → content), each labeled with a
  comment block. This is the file to hand to a code agent for tweaks.
- `tailwind.config.ts` — the `brand` color palette (black, red, lime,
  white). Change colors here and they update everywhere.
- `app/layout.tsx` — loads the `Anton` Google Font as a stand-in for the
  real NEVERFOUND brand font (a bold, hand-torn poster style). Swap in
  the real font file here once you have it.
- `public/logo.png` — the wordmark, used both as the visible mark and as
  the oversized cropped shapes behind the menu.
- `public/texture.jpg` — the holographic foil photo used for the grain/
  grunge layer.

## Customizing

- **Menu items**: edit the `items` array passed to `<SlideMenu />` in
  `app/page.tsx`. Each item takes `label`, `href`, and `color`
  (`"lime" | "white"`).
- **Colors**: edit `brand` in `tailwind.config.ts`.
- **Background shape pattern**: the rotation/scale/position of the two
  logo copies is set with inline utility classes in the "LAYER 2" block
  of `SlideMenu.tsx` — nudge the `rotate-`, `translate-`, `w-`/`h-`
  values there.
- **Texture tint/intensity**: the "LAYER 3" block's `filter` and
  `opacity` style control the color-burn tint over the logo shapes.
- **Slide animation**: controlled by the `translate-x-*` classes and
  `transition-transform duration-500` on the root element of
  `SlideMenu.tsx`.

## Notes for a code agent (e.g. Codex)

The component is intentionally flat and commented section-by-section
(LAYER 1 / 2 / 3 / 4) so each visual concern can be found and edited in
isolation without touching the others. Colors are centralized in
`tailwind.config.ts` rather than hardcoded in the component.
