import { Given, Then } from '../fixtures';
import { expect } from '../fixtures';

Given('I am on the dashboard page', async ({ dashboardPage }) => {
  await dashboardPage.goto();
});

Given('I am on the claims page', async ({ claimsPage }) => {
  await claimsPage.goto();
});

Given('I am on the find care page', async ({ findCarePage }) => {
  await findCarePage.goto();
});

Given('I am on the benefits page', async ({ benefitsPage }) => {
  await benefitsPage.goto();
});

Then('I should be on the {string} page', async ({ page }, path: string) => {
  await expect(page).toHaveURL(new RegExp(path));
});

Then('I should be on a claim detail page', async ({ page }) => {
  await expect(page).toHaveURL(/\/claims\/.+/);
});

Then('I should be on a provider detail page', async ({ page }) => {
  await expect(page).toHaveURL(/\/find-care\/.+/);
});
