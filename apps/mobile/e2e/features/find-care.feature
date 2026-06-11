Feature: Mobile Find Care
  As a Medicare Advantage member on mobile
  I want to search for providers on my phone
  So that I can find care while on the go

  Background:
    Given the app is launched
    And I navigate to the Find Care screen

  Scenario: Find Care screen loads
    Then I should see the find care screen
    And I should see the provider search input

  Scenario: Search for a provider
    When I type "cardiology" in the provider search input
    And I tap the search button
    Then I should see at least 1 provider result

  Scenario: View provider details
    Given I have searched for "primary care"
    When I tap the first provider in the list
    Then I should see the provider detail screen
