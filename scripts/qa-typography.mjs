import puppeteer from "puppeteer-core";

const baseUrl = process.env.SITE_URL || "http://127.0.0.1:4321";
const widths = [1440, 1680, 1920];
const pages = [
  { name: "home", url: "/" },
  { name: "research", url: "/research/" },
  { name: "publication", url: "/research/rain/" },
  { name: "books", url: "/books/" }
];
const selectors = [
  ".hero-name",
  ".page-title",
  ".publication-title",
  ".section-heading h2",
  ".feature-title",
  ".book-title",
  ".card-title",
  ".list-title",
  ".page-intro",
  ".lede"
];

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--headless=new", "--no-sandbox"]
});

const results = [];
for (const width of widths) {
  for (const target of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 1200, deviceScaleFactor: 1 });
    await page.goto(new URL(target.url, baseUrl).toString(), { waitUntil: "networkidle0" });
    const measurements = await page.evaluate((requestedSelectors) => {
      const data = {};
      for (const selector of requestedSelectors) {
        const el = document.querySelector(selector);
        if (!el) continue;
        const styles = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        data[selector] = {
          text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 80),
          fontFamily: styles.fontFamily.split(",")[0].replaceAll('"', ""),
          fontSize: styles.fontSize,
          lineHeight: styles.lineHeight,
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      }
      return data;
    }, selectors);
    results.push({ width, page: target.name, measurements });
    await page.close();
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
