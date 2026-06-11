import { Given, When, Then } from '../fixtures';
import { expect } from '../fixtures';

Then('I should see the Smart Match section', async ({ findCarePage }) => {
  await findCarePage.assertSmartMatchVisible();
});

When('I search for providers matching {string}', async ({ findCarePage }, term: string) => {
  await findCarePage.searchFor(term);
});

Given('I have searched for {string}', async ({ findCarePage }, term: string) => {
  await findCarePage.searchFor(term);
});

Then('I should see at least {int} provider card', async ({ findCarePage }, min: number) => {
  const count = await findCarePage.getProviderCount();
  expect(count).toBeGreaterThanOrEqual(min);
});

When('I toggle the in-network only filter', async ({ findCarePage }) => {
  await findCarePage.toggleInNetwork();
});

When('I click apply filters', async ({ findCarePage }) => {
  await findCarePage.applyFilters();
});

Then('all visible provider cards should be in-network', async ({ findCarePage }) => {
  const states = await findCarePage.getProviderInNetworkStates();
  expect(states.length).toBeGreaterThan(0);
  for (const isVisible of states) {
    expect(isVisible).toBe(true);
  }
});

When('I click view details on provider {int}', async ({ findCarePage }, n: number) => {
  await findCarePage.openProviderDetail(n - 1);
});

When('I click the search button without a search term', async ({ findCarePage }) => {
  await findCarePage.searchButton.click();
  await findCarePage.waitForNetworkIdle();
});
