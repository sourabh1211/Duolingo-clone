import { expect, test } from "@playwright/test";

const API = "http://127.0.0.1:8000";

test.beforeEach(async ({ request }) => {
  await request.post(`${API}/api/dev/reset`); // start every test from the seeded demo state
});

test("path shows completed, active and locked skills", async ({ page }) => {
  await page.goto("/learn");
  await expect(page.getByRole("button", { name: /Basics, completed/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Food, active/ })).toBeVisible();
  await page.getByRole("button", { name: /Family, locked/ }).click();
  await expect(page.getByText("Complete all levels above to unlock this!")).toBeVisible();
});

test("a wrong answer costs a heart and shows the correct solution", async ({ page, isMobile }) => {
  test.skip(isMobile, "Skip is desktop-only, like the original");
  await page.goto("/learn");
  await page.getByRole("button", { name: /Food, active/ }).click();
  await page.getByRole("button", { name: "Start +10 XP" }).click();

  const hearts = page.getByRole("banner").getByLabel(/^\d hearts$/);
  await expect(hearts).toHaveText("4"); // the seeded learner has 4 of 5 hearts
  await page.getByRole("button", { name: "Skip" }).click(); // skipping counts as a mistake
  await expect(page.getByText("Correct solution:")).toBeVisible();
  await expect(hearts).toHaveText("3");
  await page.getByRole("button", { name: "Got it" }).click();
  await expect(page.getByText("Tap the matching pairs")).toBeVisible();
});

test("quitting asks for confirmation and returns to the path", async ({ page }) => {
  await page.goto("/learn");
  await page.getByRole("button", { name: /Food, active/ }).click();
  await page.getByRole("button", { name: "Start +10 XP" }).click();
  await page.getByLabel("Quit lesson").click();
  await expect(page.getByText("Wait, don't go!")).toBeVisible();
  await page.getByRole("button", { name: "End session" }).click();
  await expect(page).toHaveURL(/\/learn/);
});

test("leaderboard stays locked until 10 lessons are done", async ({ page }) => {
  await page.goto("/leaderboard");
  await expect(page.getByRole("main").getByText("Complete 3 more lessons to start competing", { exact: false })).toBeVisible();
});

test("guidebook opens from the unit banner and shows key phrases", async ({ page }) => {
  await page.goto("/learn");
  await page.getByRole("link", { name: "Unit 1 guidebook" }).click();
  await expect(page.getByRole("heading", { name: "Unit 1 Guidebook" })).toBeVisible();
  await expect(page.getByText("Hola, me llamo Ana.")).toBeVisible();
  await page.getByRole("link", { name: "Back" }).click();
  await expect(page).toHaveURL(/\/learn/);
});
