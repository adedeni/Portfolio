// Generates public/og-image.png (1200×630, Blueprint theme), favicon-32.png and apple-touch-icon.png
// by rendering HTML in a local Chrome. Run with `npm run og` after editing content.
// Needs Google Chrome installed (set CHROME_PATH to override).
import { chromium } from "playwright-core";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pub = resolve(root, "public");
const font = (p) => "file://" + resolve(root, "node_modules", p);
const executablePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const og = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:A;src:url(${font("@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2")}) format("woff2");font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:M;src:url(${font("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2")}) format("woff2")}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#071a29;padding:28px;font-family:A;color:#eaf0f4}
.sheet{height:100%;background:#0c2638;border:1.5px solid rgba(234,240,244,.55);display:flex;flex-direction:column;
 background-image:linear-gradient(rgba(234,240,244,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(234,240,244,.09) 1px,transparent 1px),linear-gradient(rgba(234,240,244,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(234,240,244,.045) 1px,transparent 1px);
 background-size:96px 96px,96px 96px,24px 24px,24px 24px}
.strip{display:flex;justify-content:space-between;border-bottom:1.5px solid rgba(234,240,244,.55);padding:12px 28px;font:500 15px M;letter-spacing:.08em;text-transform:uppercase;color:#bccbd6;background:#0c2638}
.body{flex:1;padding:40px 56px;display:flex;flex-direction:column}
.name{font-size:30px;font-weight:650;font-stretch:112%}
.role{font:500 15px M;letter-spacing:.08em;text-transform:uppercase;color:#9db1c0;margin-left:14px}
h1{margin-top:22px;font-size:62px;line-height:1.04;font-weight:650;font-stretch:118%;letter-spacing:-.02em;max-width:1000px}
.dims{margin-top:auto;display:grid;grid-template-columns:1fr 1fr;gap:56px;max-width:860px}
.dim{position:relative;height:56px;display:flex;align-items:center;justify-content:center;border-left:1.5px solid #9db1c0;border-right:1.5px solid #9db1c0}
.dim:before{content:"";position:absolute;left:0;right:0;top:50%;height:1.5px;background:#9db1c0}
.v{position:relative;background:#0c2638;padding:0 14px;font-size:46px;font-weight:650;font-stretch:118%}
.l{text-align:center;margin-top:6px;font-size:22px;color:#bccbd6}
.url{position:absolute;right:56px;bottom:56px;font:500 17px M;color:#ff9159}
</style></head><body><div class="sheet" style="position:relative">
<div class="strip"><span>Sheet 01 / 08 · General arrangement</span><span>Scale 1:1</span></div>
<div class="body"><p><span class="name">Olayode Adeshina</span><span class="role">Software Engineer · Full-Stack &amp; Mobile</span></p>
<h1>I build full-stack web and Flutter mobile apps for fintech, telecom and EdTech.</h1>
<div class="dims"><div><div class="dim"><span class="v">50,000+</span></div><p class="l">businesses on PMCSMS</p></div>
<div><div class="dim"><span class="v">10,000+</span></div><p class="l">entrepreneurs on VTUNowNow</p></div></div></div>
<span class="url">adedeni.netlify.app</span></div></body></html>`;

const dir = mkdtempSync(join(tmpdir(), "og-"));
writeFileSync(join(dir, "og.html"), og);
const svg = readFileSync(resolve(pub, "favicon.svg"), "utf8");
writeFileSync(join(dir, "icon.html"), `<!doctype html><style>*{margin:0}html,body{width:100vw;height:100vh}svg{display:block;width:100vw;height:100vh}</style>${svg}`);

const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto("file://" + join(dir, "og.html"));
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: resolve(pub, "og-image.png") });

for (const [size, name] of [[32, "favicon-32.png"], [180, "apple-touch-icon.png"]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.goto("file://" + join(dir, "icon.html"));
  await page.screenshot({ path: resolve(pub, name) });
}
await browser.close();
console.log("Wrote og-image.png, favicon-32.png, apple-touch-icon.png");
