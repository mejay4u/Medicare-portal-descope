Feature: Benefits Overview
  As a Medicare Advantage member
  I want to view my plan benefits and cost-sharing details
  So that I can understand what is covered and how much I owe

  Background:
    Given I am on the benefits page

  Scenario: Benefits page loads with deductible information
    Then I should see the benefits deductible progress bar
    And I should see benefit items listed

  Scenario Outline: Switching benefit tabs shows correct content
    When I switch to the "<tab>" benefits tab
    Then I should see benefit items listed

    Examples:
      | tab     |
      | Medical |
      | Vision  |
      | Dental  |
