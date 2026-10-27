// Captures reference screenshots of the ORIGINAL app so you can compare your clone side by side.
//
//   npm run reference
//
// A real Chrome window opens. Log in yourself (your password never leaves your machine),
// then come back to this terminal and press Enter. The login is kept in .reference-profile/
// so you only do this once. Screenshots land in ../reference/<viewport>/<page>.png.
// They are for personal design reference only: don't commit them or reuse their artwork.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import readline from "node:readline/promises";

const ORIGIN = "https://www.duolingo.com";
const PAGES = ["learn", "leaderboard", "quests", "shop", "profile", "settings/account"];
const VIEWPORTS = { desktop: { width: 1440, height: 900 }, tablet: { width: 820, height: 1180 }, mobile: { width: 390, height: 844 } };

const context = await chromium.launchPersistentContext(".reference-profile", { headless: false, viewport: VIEWPORTS.desktop });
const page = context.pages()[0] ?? (await context.newPage());
await page.goto(`${ORIGIN}/learn`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
await rl.question("Log in in the browser window (skip if already logged in), then press Enter here… ");
rl.close();

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  await page.setViewportSize(viewport);
  await mkdir(`../reference/${name}`, { recursive: true });
  for (const path of PAGES) {
    await page.goto(`${ORIGIN}/${path}`, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(1500);
    const file = `../reference/${name}/${path.replace(/\//g, "_")}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log("saved", file);
  }
}
console.log("\nTip: start a lesson by hand, then run this again with PAGES = [] and take manual screenshots.");
await context.close();
