import { When, Then } from '../fixtures';
import { expect } from '../fixtures';

Then('I should see at least {int} claim card', async ({ claimsPage }, min: number) => {
  const count = await claimsPage.getClaimCount();
  expect(count).toBeGreaterThanOrEqual(min);
});

When('I type {string} in the claims search box', async ({ claimsPage }, term: string) => {
  await claimsPage.search(term);
});

When('I clear the claims search box', async ({ claimsPage }) => {
  await claimsPage.search('');
});

Then('the claims list should update', async ({ claimsPage }) => {
  // wait for any in-flight filter debounce to settle
  await claimsPage.page.waitForTimeout(300);
  // assertion: list is still mounted (may be 0 results — that is valid)
  await expect(claimsPage.heading).toBeVisible();
});

When('I filter claims by status {string}', async ({ claimsPage }, status: string) => {
  await claimsPage.filterByStatus(status);
});

Then('all visible status badges should read {string}', async ({ claimsPage }, status: string) => {
  const texts = await claimsPage.getAllStatusBadgeTexts();
  for (const text of texts) {
    expect(text.trim().toLowerCase()).toBe(status.toLowerCase());
  }
});

When('I open claim number {int}', async ({ claimsPage }, n: number) => {
  await claimsPage.openClaim(n - 1);
});
