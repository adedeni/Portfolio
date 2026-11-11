// Inject the server-rendered app, JSON-LD and font preloads into dist/index.html.
import { readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const ssrDir = resolve(root, "dist-ssr");

const { render, jsonLd } = await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href);

let html = readFileSync(resolve(dist, "index.html"), "utf8");
const appHtml = render();

const assets = readdirSync(resolve(dist, "assets"));
const preload = ["archivo-latin-wdth-normal", "ibm-plex-mono-latin-400-normal"]
  .map((name) => assets.find((f) => f.startsWith(name) && f.endsWith(".woff2")))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");

html = html
  .replace("<!--app-html-->", appHtml)
  .replace("<!--json-ld-->", `<script type="application/ld+json">${jsonLd()}</script>`)
  .replace("<!--preload-fonts-->", preload);

for (const marker of ["<!--app-html-->", "<!--json-ld-->", "<!--preload-fonts-->"]) {
  if (html.includes(marker)) throw new Error(`Prerender: marker ${marker} was not replaced`);
}

writeFileSync(resolve(dist, "index.html"), html);
rmSync(ssrDir, { recursive: true, force: true });
console.log(`Prerendered index.html (${(appHtml.length / 1024).toFixed(1)} KB of markup)`);
