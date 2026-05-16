# Session 23: Performance Pass

Status: Complete

## Goal

Optimize build, runtime, assets, and animation performance.

## Inputs

- Production build
- Browser performance checks

## Deliverables

- Successful production build
- Bundle review
- Image optimization
- Animation performance review
- Lighthouse-style checks

## Tasks

- [x] Run production build
- [x] Review bundle size
- [x] Optimize images/assets
- [x] Test scroll and animation performance by code/build review
- [x] Fix obvious jank

## Baseline Validation

- `npm run typecheck`: passed before fixes.
- `npm run lint`: passed before fixes.
- `npm run build`: passed before fixes.
- Production build remained fully static: 19 generated pages, including all
  eight `/projects/[slug]` paths.

## Bundle Review

Next 16 did not print route byte sizes in the route table, so the pass parsed
`.next/server/app/**/page_client-reference-manifest.js` and
`.next/static/chunks`.

| Route | Baseline route JS | Final route JS | Final CSS |
|---|---:|---:|---:|
| `/documents` | 186.5 KB | 157.2 KB | 70.6 KB |
| `/proof` | 186.5 KB | 156.9 KB | 70.6 KB |
| `/timeline` | 183.8 KB | 154.5 KB | 70.6 KB |
| `/resume` | 179.3 KB | 150.0 KB | 70.6 KB |
| `/profile` | 185.2 KB | 148.6 KB | 70.6 KB |
| `/projects` | 168.3 KB | 137.9 KB | 70.6 KB |
| `/projects/[slug]` | 168.3 KB | 137.9 KB | 70.6 KB |
| `/` | 164.8 KB | 134.1 KB | 102.7 KB |
| `/future-projects` | 162.5 KB | 133.2 KB | 70.6 KB |
| `/certifications` | 164.0 KB | 120.6 KB | 70.6 KB |

Largest static chunks after fixes:

- React/runtime root chunk: 222.2 KB uncompressed, 69.3 KB gzip.
- Shared framework chunk: 146.8 KB uncompressed, 39.5 KB gzip.
- Largest route chunks: documents 73.1 KB, proof 72.8 KB, timeline 70.4 KB.
- Hidden delight overlay is now async only: 76.7 KB split JS and 8.7 KB CSS,
  absent from initial route HTML.

## Fixes Applied

- Replaced `next/image` usage for local SVG-only brand marks with plain `img`
  elements. This avoids shipping the client image component for tiny static SVGs
  while preserving eager loading for above-the-fold hero marks.
- Disabled automatic `next/link` prefetch in the always-visible shared
  header/footer route chrome so the first viewport does not eagerly pull every
  route payload.
- Split the hidden delight layer into a lightweight global keyboard/listener
  shell and a lazy-loaded command overlay. The optional vault/build-notes UI and
  its data summaries no longer ride along with every route.
- Moved hidden delight shell styles into a small shell CSS module, leaving the
  full overlay CSS with the async panel chunk.
- Replaced client-side profile/social brand icons with lightweight text glyphs
  inside the existing icon frames and removed the `react-icons` dependency.
- Removed persistent `will-change: transform` from every motion card, CTA,
  lens choice, and timeline item to avoid unnecessary composited layers at rest.

## Asset Review

- Loaded brand SVGs are small: wordmark/avatar/monogram assets used in UI are
  all under 1 KB each.
- Largest public file is the unused brand test-sheet PNG at 58.5 KB; it is a
  documentation/acceptance artifact and is not referenced by shipped routes.
- Resume DOCX assets are 40.6 KB and 29.4 KB and remain intentionally public
  downloads.
- No WebGL, 3D, video, font files, or large raster route assets ship in v1.

## Animation Review

- Global and component motion continues to use transform and opacity for reveal,
  hover, panel, and thread effects.
- `prefers-reduced-motion` fallbacks remain in `src/styles/motion.css`,
  `cinematic-hero.module.css`, the hidden delight modules, and timeline scroll
  logic.
- No `requestAnimationFrame`, `setInterval`, `infinite` animation loops, or
  WebGL/3D payload were found in the shipped source.
- Hidden delight status stamps still expire after 4.2 seconds and do not
  intercept pointer input.

## Route Smoke

Production server smoke used `next start` on `http://127.0.0.1:3001` and
headless Edge `--dump-dom`.

| Route | Result |
|---|---|
| `/` | Loaded, one `main`, one `h1`, title present |
| `/proof` | Loaded, one `main`, one `h1`, title present |
| `/projects` | Loaded, one `main`, one `h1`, title present |
| `/timeline` | Loaded, one `main`, one `h1`, title present |
| `/certifications` | Loaded, one `main`, one `h1`, title present |
| `/future-projects` | Loaded, one `main`, one `h1`, title present |
| `/resume` | Loaded, one `main`, one `h1`, title present |
| `/documents` | Loaded, one `main`, one `h1`, title present |
| `/profile` | Loaded, one `main`, one `h1`, title present |

## Final Verification

- `npm run typecheck`: passed after fixes.
- `npm run lint`: passed after fixes.
- `npm run build`: passed after fixes.
- Production route manifest and chunk-size review completed.
- Initial HTML check confirmed the async hidden-overlay chunk is not included
  in shipped route HTML.
- Public asset-size review completed.

## Handoff Notes

- Premium feel is preserved, but optional delight and icon payloads are now paid
  for later instead of in the first route.
- Session 24 can proceed with launch metadata and deployment checks.
