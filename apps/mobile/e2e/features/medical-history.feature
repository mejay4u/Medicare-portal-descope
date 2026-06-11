Feature: Mobile Medical History

  Scenario: Medical History screen loads
    Given I am on the Dashboard screen
    When I tap on the "History" tab
    Then I should see the Medical History screen
    And I should see the "Arthur, your wellness journey is trending positively." text
    And I should see the "Type 2 Diabetes" timeline item
    And I should see the "Annual Flu Shot" timeline item
