Feature: Operator Planner - crafting
  Scenario: Craftable items can be crafted
    When I add a goal to my planner
    Then I should be able to craft the higher tier, craftable items

  Scenario: Uncraftable items can't be crafted
    When I add a goal to my planner
    Then I should not be able to craft the uncraftable items

  @ignore
  Scenario: Items can be chain crafted
    Given I have added a goal to my planner
    When I mark an item to be crafted that has a craftable ingredient
    And I mark that ingredient to be crafted too
    Then I should see that ingredient's ingredients in the required materials section

  @ignore
  Scenario: Items being crafted aren't shown if their goal is removed
    Given I have added a goal to my planner
    And I have marked some items to be crafted
    When I remove the goal from my planner
    Then I shouldn't see the items to be crafted in the required materials section

  @ignore
  Scenario: Items being crafted are shown if another goal needs them
    Given I have added a goal to my planner
    And I have marked some items to be crafted
    When I add another goal that has the same crafted item
    And I remove the first goal from my planner
    Then I should still see the item to be crafted in the required materials section

  @ignore
  Scenario: User stops crafting an item: ingredients no longer appear
    Given I have added a goal to my planner
    And I have marked some items to be crafted
    When I stop crafting an item
    Then I should not see its ingredients in the required materials section

  @ignore
  Scenario: User stops crafting an item: ingredients needed by other goals
    Given I have added a goal to my planner
    And I have marked some items to be crafted
    When I add another goal that requires some of the crafted items' ingredients
    Then I should see the required number of ingredients added together
    And if I stop crafting items for the first goal
    Then I should only see the ingredients that are still needed by the other goal

  @ignore
  Scenario: Ingredient requirements update with crafted item changes
    Given I have added a goal to my planner
    And I have marked some items to be crafted
    When I obtain some more of the item to be crafted
    Then I should see that I need less of its ingredients

  @ignore
  Scenario: Scenario name: Items being crafted are marked as complete when their ingredients are complete
    Given I have added a goal to my planner
    And I have marked some items to be crafted
    When I collect all the ingredients for those crafted items
    Then I should see those crafted items marked as complete

  @ignore
  Scenario: Planner saves crafting state of items
    Given I have added a goal to my planner
    And I have marked some items to be crafted
    When I refresh the page
    Then I should see that I'm still crafting those items
