# Cloudflare Pages Deployment

Use Cloudflare Pages static export for this portfolio.

## Dashboard Settings

- Framework preset: `Next.js (Static HTML Export)`
- Build command: `npm run build:pages`
- Build output directory: `out`
- Node version: use the current Cloudflare Pages default unless a future build log requires pinning it.

## Local Checks

- Normal production build: `npm run build`
- Cloudflare Pages export: `npm run build:pages`
- Static preview from exported folder:
  - `cd out`
  - `python -m http.server 8788 --bind 127.0.0.1`
  - Open `http://127.0.0.1:8788/`

## Notes

- `next.config.ts` enables `output: "export"` only when `CF_PAGES=1` or
  `NEXT_OUTPUT_EXPORT=1`, so normal local Next builds still work.
- Cloudflare Pages sets `CF_PAGES=1` during builds. The `build:pages` helper
  sets it locally too, so the same command can be tested on Windows.
- Generated metadata routes such as `manifest.webmanifest`, icons, sitemap,
  robots, and social images are marked `force-static` so the export can include
  them.
- `public/_headers` adds long-lived caching for `/_next/static/*` and
  `/assets/*`.
