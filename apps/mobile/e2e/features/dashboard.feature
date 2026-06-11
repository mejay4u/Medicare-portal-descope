Feature: Mobile Dashboard
  As a Medicare Advantage member on mobile
  I want to view my plan summary on the home screen
  So that I can quickly access my health information

  Background:
    Given the app is launched

  Scenario: Dashboard screen is visible
    Then I should see the dashboard screen
    And I should see the member name

  Scenario: Bottom navigation is accessible
    Then I should see the bottom tab bar

  Scenario: Navigate to Claims from bottom tab
    When I tap the "Claims" tab
    Then I should see the claims screen

  Scenario: Navigate to Find Care from bottom tab
    When I tap the "Find Care" tab
    Then I should see the find care screen

  Scenario: Navigate to Benefits from bottom tab
    When I tap the "Benefits" tab
    Then I should see the benefits screen
