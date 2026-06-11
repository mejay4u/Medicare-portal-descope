Feature: Member Dashboard
  As a Medicare Advantage member
  I want to view my health plan summary on the dashboard
  So that I can quickly understand my coverage and recent activity

  Background:
    Given I am on the dashboard page

  Scenario: Dashboard loads member information
    Then I should see my member name
    And I should see my plan details
    And I should see the deductible progress bar

  Scenario: Quick action navigates to claims
    When I click the quick action "View Claims"
    Then I should be on the "/claims" page

  Scenario: Recent activity is displayed
    Then I should see at least 1 recent activity item

  Scenario: Wellness card is visible
    Then I should see the wellness card

  Scenario: Insurance card is visible on dashboard
    Then I should see the insurance card
