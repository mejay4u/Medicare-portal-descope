import { device, element, by, expect as detoxExpect, waitFor } from 'detox';
import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('./e2e/features/dashboard.feature');

defineFeature(feature, test => {

  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
    await device.disableSynchronization();
  });



  test('Dashboard screen is visible', ({ given, then }) => {
    given('the app is launched', async () => {});

    then('I should see the dashboard screen', async () => {
      await waitFor(element(by.text('Dashboard')).atIndex(0)).toBeVisible().withTimeout(5000);
    });

    then('I should see the member name', async () => {
      // Wait for the skeleton to disappear and data to load
      await waitFor(element(by.id('member-name'))).toBeVisible().withTimeout(5000);
    });
  });

  test('Bottom navigation is accessible', ({ given, then }) => {
    given('the app is launched', async () => {});

    then('I should see the bottom tab bar', async () => {
      await detoxExpect(element(by.id('bottom-tab-bar'))).toBeVisible();
    });
  });

  test('Navigate to Claims from bottom tab', ({ given, when, then }) => {
    given('the app is launched', async () => {});

    when('I tap the "Claims" tab', async () => {
      await waitFor(element(by.id('tab-claims'))).toBeVisible().withTimeout(5000);
      await element(by.id('tab-claims')).tap();
    });

    then('I should see the claims screen', async () => {
      await waitFor(element(by.id('claims-screen'))).toExist().withTimeout(5000);
    });
  });

  test('Navigate to Find Care from bottom tab', ({ given, when, then }) => {
    given('the app is launched', async () => {});

    when('I tap the "Find Care" tab', async () => {
      await waitFor(element(by.id('tab-find-care'))).toBeVisible().withTimeout(5000);
      await element(by.id('tab-find-care')).tap();
    });

    then('I should see the find care screen', async () => {
      await waitFor(element(by.text('Find Care'))).toBeVisible().withTimeout(5000);
    });
  });

  test('Navigate to Benefits from bottom tab', ({ given, when, then }) => {
    given('the app is launched', async () => {});

    when('I tap the "Benefits" tab', async () => {
      await waitFor(element(by.id('tab-benefits'))).toBeVisible().withTimeout(5000);
      await element(by.id('tab-benefits')).tap();
    });

    then('I should see the benefits screen', async () => {
      await waitFor(element(by.id('benefits-screen'))).toExist().withTimeout(5000);
    });
  });

});
