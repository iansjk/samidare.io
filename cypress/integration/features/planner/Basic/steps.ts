import {
  Before,
  When,
  Then,
  But,
  And,
} from "cypress-cucumber-preprocessor/steps";
import { addGoal, enterOperatorName } from "../utils";

Before(() => {
  cy.visit("/planner");
  cy.fixture("amiya-e2.json")
    .as("amiyaE2Goal")
    .then((goal) => {
      cy.wrap(
        goal.ingredients.filter((ingredient) => ingredient.name !== "LMD")
      ).as("amiyaE2GoalMaterials");
    });
});

When("I add another goal with some common materials", () => {
  addGoal("Rosmontis", "Skill 1 Mastery 3");
});

When(
  /^I have obtained (all|some) of the required materials for it$/,
  (howMany) => {
    cy.get("@amiyaE2GoalMaterials").then((materials: any) => {
      materials.forEach((material) => {
        cy.get(`[data-cy="${material.name}"]`)
          .find('[data-cy="ownedInput"]')
          .type(howMany === "all" ? material.quantity : 1);
      });
    });
  }
);

When(/^I am adding goals for (.+)$/, (operatorName) => {
  enterOperatorName(operatorName);
  cy.get("#goal-select").click();
});

Then("I should see my goal in the operator goals list", () => {
  cy.get('[data-cy="goalsList"]').as("goalsList");
  cy.get("@goalsList")
    .find('[data-cy="operatorGoalCard"]')
    .as("addedGoal")
    .should("have.length", 1);
  cy.get("@addedGoal").find('[data-cy="operatorName"]').contains("Amiya");
  cy.get("@addedGoal").find('[data-cy="goalName"]').contains("Elite 2");
});

Then(
  "I should see its required materials in the required materials section",
  () => {
    cy.get('[data-cy="materialsList"]')
      .as("materialsList")
      .find('[data-cy="LMD"]')
      .should("not.exist");
    cy.get("@amiyaE2GoalMaterials").then((materials: any) => {
      materials.map((material) =>
        cy
          .get("@materialsList")
          .find(`[data-cy="${material.name}"]`)
          .find('[data-cy="quantity"]')
          .should("have.text", material.quantity)
      );
    });
  }
);

Then("I can type how many of the required materials I have", () => {
  cy.get("@amiyaE2GoalMaterials").then((materials: any) => {
    materials.map((material) =>
      cy
        .get(`[data-cy="${material.name}"]`)
        .find('[data-cy="ownedInput"]')
        .type("1")
    );
  });
});

Then("I can increment them", () => {
  cy.get("@materialsList")
    .find('[data-cy="increment"]')
    .each(($el) => {
      cy.wrap($el).click();
    });
});

Then("I can decrement them if I have at least one to decrement", () => {
  cy.get("@materialsList")
    .find('[data-cy="decrement"]')
    .each(($el) => {
      cy.wrap($el)
        .closest('[data-cy="itemNeeded"]')
        .find('[data-cy="ownedInput"]')
        .as("ownedInput")
        .type("0");
      cy.wrap($el).should("be.disabled");
      cy.get("@ownedInput").type("1");
      cy.wrap($el).should("not.be.disabled");
      cy.wrap($el).click();
      cy.get("@ownedInput").should("have.value", 0);
    });
});

Then(
  "I should see the required materials grouped in the required materials section",
  () => {
    cy.fixture("rosmontis-s1m3.json").then((rosmontisS1M3Goal) => {
      const commonIngredients: Record<string, number> = {};
      cy.get("@amiyaE2Goal").then((amiyaE2Goal: any) => {
        [...rosmontisS1M3Goal.ingredients, ...amiyaE2Goal.ingredients].forEach(
          (ingredient) => {
            commonIngredients[ingredient.name] =
              (commonIngredients[ingredient.name] ?? 0) + ingredient.quantity;
          }
        );
        Object.entries(commonIngredients)
          .filter(([name]) => name !== "LMD")
          .forEach(([name, quantity]) => {
            cy.get(`[data-cy="${name}"]`)
              .find('[data-cy="quantity"]')
              .should("have.text", quantity);
          });
      });
    });
  }
);

Then("the required materials should be marked as completed", () => {
  cy.get("@amiyaE2GoalMaterials").then((materials: any) => {
    materials.forEach((material) => {
      cy.get(`[data-cy="${material.name}"]`).find('[data-cy="complete"]');
    });
  });
});

Then("I should see my previous item counts", () => {
  cy.get("@amiyaE2GoalMaterials").then((materials: any) => {
    materials.forEach((material) => {
      cy.get(`[data-cy="${material.name}"]`)
        .find('[data-cy="ownedInput"]')
        .should("have.value", "1");
    });
  });
});

Then(/^I should see an? "([^"]+)" preset$/, (presetName) => {
  cy.get('[data-cy="preset"]').contains(presetName).as("presetToSelect");
});

Then(/^the goals making up that preset should be (un)?selected$/, (negated) => {
  cy.get("@presetToSelect").then((selectedPreset) => {
    cy.get("#operator-name")
      .invoke("val")
      .then((operatorName) => {
        const presetName = selectedPreset.text();
        let maxElite = 0;
        let numSkills = 1;
        let numSkillLevels = 6;
        let goals: string[] = [];
        if (presetName === "Everything") {
          if (operatorName === "Spot") {
            maxElite = 1;
          } else if (operatorName === "Cutter") {
            maxElite = 2;
            numSkills = 2;
          } else if (operatorName === "Aak") {
            maxElite = 2;
            numSkills = 3;
          } else if (operatorName === "Amiya (Guard)") {
            numSkills = 2;
            numSkillLevels = 0;
          } else {
            throw new Error(
              `Don't know how to handle operator: ${JSON.stringify(
                operatorName
              )}`
            );
          }
        } else if (presetName === "Elite 1, Skill Level 1 → 7") {
          maxElite = 1;
          numSkills = 0;
        } else if (presetName === "Skill 3 Mastery 1 → 3") {
          goals = Array(3)
            .fill(0)
            .map((_, i) => `Skill 3 Mastery ${i + 1}`);
        } else {
          throw new Error(
            `Don't know how to handle preset name: ${presetName}`
          );
        }

        if (goals.length === 0) {
          goals = [
            ...Array(maxElite)
              .fill(0)
              .map((_, i) => `Elite ${i + 1}`),
            ...Array(numSkills)
              .fill(0)
              .flatMap((_, i) =>
                Array(3)
                  .fill(0)
                  .flatMap((__, j) => `Skill ${i + 1} Mastery ${j + 1}`)
              ),
            ...Array(numSkillLevels)
              .fill(0)
              .flatMap((_, i) => `Skill Level ${i + 1} → ${i + 2}`),
          ];
        }

        goals.forEach((goalName) => {
          cy.get("#menu-goal-select")
            .find('[data-cy="goalOption"]')
            .contains(goalName)
            .should("have.attr", "aria-selected", negated ? "false" : "true");
        });
      });
  });
});

Then('I should only see an "Everything" preset', () => {
  cy.get('[data-cy="preset"]')
    .should("have.length", 1)
    .should("have.attr", "data-value", "Everything");
});

And(/^when I (?:de)?select that preset$/, () => {
  cy.get("@presetToSelect").click();
});

But("when I am adding goals for Amiya", () => {
  enterOperatorName("Amiya");
  cy.get("#goal-select").click();
});
