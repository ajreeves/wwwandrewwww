import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:4322/";
const width = Number(process.argv[3] ?? 390);
const height = Number(process.argv[4] ?? 1200);

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"]
});

const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle0" });

const result = await page.evaluate(() => {
  const viewportWidth = document.documentElement.clientWidth;
  const scrollWidth = document.documentElement.scrollWidth;
  const offenders = [...document.querySelectorAll("body *")]
    .map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        className: String(el.className || ""),
        text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 90),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width)
      };
    })
    .filter((item) => item.right > viewportWidth + 1 || item.left < -1)
    .slice(0, 40);
  const clipped = [...document.querySelectorAll("body *")]
    .filter((el) => el.scrollWidth > el.clientWidth + 1)
    .map((el) => ({
      tag: el.tagName,
      className: String(el.className || ""),
      text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 90),
      clientWidth: el.clientWidth,
      scrollWidth: el.scrollWidth
    }))
    .slice(0, 40);

  return { viewportWidth, scrollWidth, offenders, clipped };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
