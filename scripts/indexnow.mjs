// Tell Bing (and other IndexNow engines) the site changed. Run after a deploy:
//   node scripts/indexnow.mjs
const key = "144adfff0761de691e8870747d930580";
const host = "adedeni.netlify.app";
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: [`https://${host}/`, `https://${host}/sitemap.xml`],
  }),
});
console.log("IndexNow:", res.status, res.status === 200 || res.status === 202 ? "accepted" : await res.text());
