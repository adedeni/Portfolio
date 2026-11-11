# adedeni.netlify.app

Portfolio of Olayode Adeshina. Vite + React + TypeScript + Tailwind, pre-rendered to static HTML at build time and deployed on Netlify (`netlify.toml`).

## Commands

```bash
npm install
npm run dev       # local dev server at http://localhost:5173
npm run build     # type-check, build, pre-render into dist/
npm run preview   # serve the production build at http://localhost:4173
npm run og        # regenerate og-image.png and PNG favicons (needs Google Chrome)
```

## Editing content

All copy, projects, links and experience live in `src/data/content.ts`. Components only read from it.

- **Missing link:** set `href: null`. The site shows a "link pending" label.
- **Screenshots:** export each as WebP (and optionally AVIF), around 1600×1000, into `public/images/`. Then replace the `{ kind: "pending", ... }` entry with:

  ```ts
  { kind: "image", webp: "/images/pmcsms-dashboard.webp", avif: "/images/pmcsms-dashboard.avif",
    width: 1600, height: 1000, alt: "…", caption: "…" }
  ```

  To convert, use `npx @squoosh/cli --webp auto --avif auto file.png` or https://squoosh.app.
- **CV:** replace `public/olayode-adeshina-cv.pdf` and update `contact.cv.meta` (pages and size).
- After changing the headline or metrics, run `npm run og` to refresh the social card.

## Structure

- `src/components/StorefrontEditor.tsx` with `public/storefront/index.html`: Detail A, the working postMessage editor demo.
- `scripts/prerender.mjs`: injects the server-rendered HTML, JSON-LD and font preloads into `dist/index.html`.
