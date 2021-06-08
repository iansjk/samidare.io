Feature: Leveling cost calculator

  Scenario Outline: Shows the maximum level for rarity chosen
    Given I have chosen <operator-name> to level
    And that operator is <operator-rarity>
    When I click on the target elite dropdown
    Then I should see the correct <max-ending-elite>
    And I should see the correct <max-ending-level>

    Examples:
      | operator-name | operator-rarity | max-ending-elite | max-ending-level |
      | Lancet-2      | 1*              | E0               | 30               |
      | Yato          | 2*              | E0               | 30               |
      | Spot          | 3*              | E1               | 55               |
      | Cutter        | 4*              | E2               | 70               |
      | Ptilopsis     | 5*              | E2               | 80               |
      | Shining       | 6*              | E2               | 90               |

  Scenario Outline: Shows LMD and EXP costs for leveling an operator
    Given I have chosen <operator-name> to level
    And I am starting from elite <starting-elite>
    And I am starting from level <starting-level>
    When I select target elite <target-elite>
    And I select target level <target-level>
    Then I should see that it costs <total-exp> EXP
    And I should see that it costs <total-lmd> LMD
    And I should see that it costs <elite-lmd> LMD for the elite promotions
    And I should see that it costs <leveling-lmd> LMD for the levels

    Examples:
      | operator-name | starting-elite | starting-level | target-elite | target-level | total-exp | total-lmd | elite-lmd | leveling-lmd |
      | Castle-3      | E0             | 30             | E0           | 30           | 0         | 0         | 0         | 0            |
      | Durin         | E0             | 1              | E0           | 30           | 9800      | 6043      | 0         | 6043         |
      | Spot          | E0             | 1              | E1           | 1            | 16400     | 23947     | 10000     | 13947        |
      | Cutter        | E1             | 40             | E2           | 30           | 136629    | 170441    | 60000     | 110441       |
      | Vulcan        | E1             | 69             | E2           | 1            | 9605      | 131027    | 120000    | 11027        |
      | Saria         | E0             | 1              | E2           | 90           | 1111400   | 1334796   | 210000    | 1124796      |
