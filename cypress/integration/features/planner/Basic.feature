Feature: Operator Planner
  Scenario: Users can add operator goals to the planner
    When I add a goal to my planner
    Then I should see my goal in the operator goals list
    And I should see its required materials in the required materials section
    And I can type how many of the required materials I have
    And I can increment them
    And I can decrement them if I have at least one to decrement

  Scenario: Planner groups together common required materials for multiple goals
    Given I have added a goal to my planner
    When I add another goal with some common materials
    Then I should see the required materials grouped in the required materials section

  Scenario: Required materials are marked as complete when the user obtains enough of them
    Given I have added a goal to my planner
    When I have obtained all of the required materials for it
    Then the required materials should be marked as completed

  Scenario: Planner shows the same state when re-visiting the page
    Given I have added a goal to my planner
    And I have obtained some of the required materials for it
    When I refresh the page
    Then I should see my previous item counts

  Scenario: Users can select goal presets to add many goals at once
    When I am adding goals for Spot
    Then I should see an "Elite 1, Skill Level 1 → 7" preset
    And when I select that preset
    Then the goals making up that preset should be selected
    And when I deselect that preset
    Then the goals making up that preset should be unselected

  Scenario: Operators with fewer than 3 skills have two presets
    When I am adding goals for Spot
    Then I should see an "Elite 1, Skill Level 1 → 7" preset
    And I should see an "Everything" preset

  Scenario Outline: Operators with 3 skills have three presets
    When I am adding goals for <3-skill-operator>
    Then I should see an "Elite 1, Skill Level 1 → 7" preset
    And I should see a "Skill 3, Mastery 1 → 3" preset
    And I should see an "Everything" preset

    Examples:
      | 3-skill-operator |
      | Amiya            |
      | Aak              |

  Scenario: Amiya (Guard) only has one preset
    When I am adding goals for Amiya (Guard)
    Then I should only see an "Everything" preset
