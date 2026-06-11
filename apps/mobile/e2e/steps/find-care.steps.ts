import { device, element, by, expect as detoxExpect, waitFor } from 'detox';
import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('./e2e/features/find-care.feature');

defineFeature(feature, test => {



  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
    await device.disableSynchronization();
  });

  test('Find Care screen loads', ({ given, and, then }) => {
    given('the app is launched', async () => {});
    and('I navigate to the Find Care screen', async () => {});

    then('I should see the find care screen', async () => {
      await waitFor(element(by.text('Find Care'))).toBeVisible().withTimeout(5000);
    });

    and('I should see the provider search input', async () => {
      await waitFor(element(by.id('provider-search-input'))).toBeVisible().withTimeout(5000);
    });
  });

  test('Search for a provider', ({ given, and, when, then }) => {
    given('the app is launched', async () => {});
    and('I navigate to the Find Care screen', async () => {});

    when('I type "cardiology" in the provider search input', async () => {
      await element(by.id('provider-search-input')).typeText('cardiology');
    });

    and('I tap the search button', async () => {
      // Search triggers automatically via onChangeText; dismiss keyboard to reveal results
      await element(by.id('provider-search-input')).tapReturnKey();
    });

    then('I should see at least 1 provider result', async () => {
      await waitFor(element(by.id('provider-list'))).toExist().withTimeout(5000);
      await waitFor(element(by.id('provider-card-0'))).toExist().withTimeout(5000);
    });
  });

  test('View provider details', ({ given, and, when, then }) => {
    given('the app is launched', async () => {});
    and('I navigate to the Find Care screen', async () => {});

    given('I have searched for "primary care"', async () => {
      await waitFor(element(by.id('provider-search-input'))).toExist().withTimeout(5000);
      await element(by.id('provider-search-input')).typeText('primary care');
      await element(by.id('provider-search-input')).tapReturnKey();
      await waitFor(element(by.id('provider-card-0'))).toExist().withTimeout(5000);
    });

    when('I tap the first provider in the list', async () => {
      // Robust scroll-to-visible pattern
      await waitFor(element(by.label('View Details Button')).atIndex(0))
        .toBeVisible()
        .whileElement(by.id('provider-list'))
        .scroll(100, 'down');
      
      await element(by.label('View Details Button')).atIndex(0).tap();
    });

    then('I should see the provider detail screen', async () => {
      // Diagnostic: Check if we hit an error state first
      await detoxExpect(element(by.id('error-state'))).not.toBeVisible();
      // Verify by production accessibility label or text
      await waitFor(element(by.text('Provider Profile')).atIndex(0)).toExist().withTimeout(20000);
    });
  });

});
