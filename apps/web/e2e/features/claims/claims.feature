Feature: Claims Management
  As a Medicare Advantage member
  I want to view, search, and filter my insurance claims
  So that I can track my medical expenses and reimbursements

  Background:
    Given I am on the claims page

  Scenario: Claims list loads with data
    Then I should see at least 1 claim card

  Scenario: Search filters claims by provider name
    When I type "cardio" in the claims search box
    Then the claims list should update

  Scenario: Open a claim to view its details
    When I open claim number 1
    Then I should be on a claim detail page

  Scenario Outline: Filter claims by status
    When I filter claims by status "<status>"
    Then all visible status badges should read "<status>"

    Examples:
      | status   |
      | Approved |
      | Pending  |
      | Denied   |

  Scenario: Clearing search restores full list
    When I type "zzznomatch" in the claims search box
    And I clear the claims search box
    Then I should see at least 1 claim card
