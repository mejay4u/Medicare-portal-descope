Feature: Find Care — Provider Search
  As a Medicare Advantage member
  I want to search for in-network providers near me
  So that I can book appointments with qualified specialists

  Background:
    Given I am on the find care page

  Scenario: Smart Match is visible without searching
    Then I should see the Smart Match section

  Scenario: Searching returns a list of providers
    When I search for providers matching "cardiology"
    Then I should see at least 1 provider card

  Scenario: Smart Match remains visible after a search
    When I search for providers matching "dermatology"
    Then I should see the Smart Match section
    And I should see at least 1 provider card

  Scenario: Filtering to in-network only
    When I toggle the in-network only filter
    And I click apply filters
    Then all visible provider cards should be in-network

  Scenario: Navigating to a provider detail page
    Given I have searched for "primary care"
    When I click view details on provider 1
    Then I should be on a provider detail page

  Scenario: Empty search term returns Smart Match only
    When I click the search button without a search term
    Then I should see the Smart Match section
