Feature: Leveling cost calculator

  Scenario Outline: Shows the maximum level for rarity chosen
    Given I have chosen <operator-name> to level
    And that operator is <operator-rarity>
    When I click on the Elite dropdown
    Then I should see the correct <max-elite>
    And I should see the correct <max-level>

    Examples:
      | operator-name | operator-rarity | max-elite | max-level |
      | Lancet-2      | 1*              | E0        | 30        |
      | Yato          | 2*              | E0        | 30        |
      | Spot          | 3*              | E1        | 55        |
      | Cutter        | 4*              | E2        | 60        |
      | Ptilopsis     | 5*              | E2        | 70        |
      | Shining       | 6*              | E2        | 80        |

  Scenario: Displays cost for E0 L1 -> E1 level 1 Spot
    Given I have chosen Spot to level
    And I am starting from elite 0 level 1
    When I select target elite 1
    And I select target level 1
    Then I should see that it costs 23947 LMD and 16400 EXP

  Scenario: Displays cost for E0 L1 -> E2 level 90 Saria
    Given I have chosen Saria to level
    And I am starting from elite 0 level 1
    When I select target elite 2
    And I select target level 90
    Then I should see that it costs 1334796 LMD and 1111400 EXP
