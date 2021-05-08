Feature: Operator Planner
  @focus
  Scenario: Users can add operator goals to the planner
    When I add a goal to my planner
    Then I should see my goal in the operator goals list

  Scenario: Planner shows required materials for a goal
    When I add a goal to my planner
    Then I should see its required materials in the required materials section
    And I can type how many of the required materials I have
    And I can increment them
    And I can decrement them

  Scenario: Planner groups together common required materials for multiple goals
    Given I have added a goal to my planner
    When I add another goal with some common materials
    Then I should see the required materials grouped in the required materials section

  Scenario: Required materials are marked as complete when the user obtains enough of them
    Given I have added a goal to my planner
    When I have obtained all of the items for it
    Then the required materials should be marked as completed

  Scenario: Planner shows the same state when re-visiting the page
    Given I have added a goal to my planner
    And I have obtained some of the required materials
    When I refresh the page
    Then I should see my previous item counts
