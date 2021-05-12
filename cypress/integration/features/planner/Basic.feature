Feature: Operator Planner
  Scenario: Users can add operator goals to the planner
    When I add a goal to my planner
    Then I should see my goal in the operator goals list
    And I should see its required materials in the required materials section
    And I can type how many of the required materials I have
    And I can increment them
    And I can decrement them if I have at least one to decrement

  @ignore
  Scenario: Planner groups together common required materials for multiple goals
    Given I have added a goal to my planner
    When I add another goal with some common materials
    Then I should see the required materials grouped in the required materials section

  @ignore
  Scenario: Required materials are marked as complete when the user obtains enough of them
    Given I have added a goal to my planner
    When I have obtained all of the items for it
    Then the required materials should be marked as completed

  @ignore
  Scenario: Planner shows the same state when re-visiting the page
    Given I have added a goal to my planner
    And I have obtained some of the required materials
    When I refresh the page
    Then I should see my previous item counts
