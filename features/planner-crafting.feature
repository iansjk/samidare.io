Feature: Operator Planner - crafting
  Scenario: Users can craft a higher tier item in the planner
    When I add a goal to my planner
    Then I should be able to craft the higher tier, craftable items
    But not the uncraftable items

  Scenario: Planner saves crafting state of items
    Given I have added a goal to my planner
    And I have marked some items to be crafted
    When I refresh the page
    Then I should see that I'm still crafting those items

  Scenario: Items being crafted are marked as complete when their ingredients are complete
    Given I have added a goal to my planner
    And I have marked some items to be crafted
    When I collect all the ingredients for those crafted items
    Then I should see those crafted items marked as complete
