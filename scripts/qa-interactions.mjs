import puppeteer from "puppeteer-core";

const baseUrl = process.argv[2] ?? "http://localhost:4321";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"]
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 1 });

await page.goto(`${baseUrl}/search/`, { waitUntil: "networkidle0" });
await page.type("[data-search-input]", "disaster");
const searchCount = await page.$eval("[data-search-count]", (el) => el.textContent);
const searchResults = await page.$$eval("[data-search-result]", (rows) => rows.length);

await page.goto(`${baseUrl}/research/`, { waitUntil: "networkidle0" });
await page.click('[data-filter-type="book"]');
const researchCount = await page.$eval("[data-publication-count]", (el) => el.textContent);
const visibleBooks = await page.$$eval("[data-publication-record]:not([hidden])", (rows) => rows.length);
const hiddenRows = await page.$$eval("[data-publication-record][hidden]", (rows) => rows.length);

console.log(JSON.stringify({ searchCount, searchResults, researchCount, visibleBooks, hiddenRows }, null, 2));
await browser.close();
