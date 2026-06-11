import { defineFeature, loadFeature } from 'jest-cucumber';
import { device, expect, element, by } from 'detox';

const feature = loadFeature('e2e/features/medical-history.feature');

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
  });

  test('Medical History screen loads', ({ given, when, then, and }) => {
    given('I am on the Dashboard screen', async () => {
      await expect(element(by.label('dashboard-screen'))).toBeVisible();
    });

    when('I tap on the "History" tab', async () => {
      await element(by.id('tab-history')).tap();
    });

    then('I should see the Medical History screen', async () => {
      await expect(element(by.label('medical-history-screen'))).toBeVisible();
    });

    and(/^I should see the "([^"]*)" text$/, async (text) => {
      await expect(element(by.text(text))).toBeVisible();
    });

    and(/^I should see the "([^"]*)" timeline item$/, async (text) => {
      await expect(element(by.text(text))).toBeVisible();
    });
  });
});
