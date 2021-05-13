import { Before, When, Then } from "cypress-cucumber-preprocessor/steps";

Before(() => {
  cy.visit("/planner");
  cy.fixture("amiya-e2.json").as("amiyaE2Goal");
});

When(/I (?:have )?add(?:ed)? a goal to my planner/, () => {
  cy.get('input[name="operator-name"]').type("Amiya{enter}");
  cy.get("#goal-select").click();
  cy.get('li[role="option"]').contains("Elite 2").click().type("{esc}");
  cy.contains("Add").click();
});

When("I add another goal with some common materials", () => {
  cy.get('input[name="operator-name"]').type("Rosmontis{enter}");
  cy.get("#goal-select").click();
  cy.get('li[role="option"]')
    .contains("Skill 1 Mastery 3")
    .click()
    .type("{esc}");
  cy.contains("Add").click();
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
    cy.get("@amiyaE2Goal").then((goal: any) => {
      cy.get('[data-cy="materialsList"]')
        .as("materialsList")
        .find('[data-cy="LMD"]')
        .should("not.exist");
      goal.ingredients
        .filter((ingredient) => ingredient.name !== "LMD")
        .map((ingredient) =>
          cy
            .get("@materialsList")
            .find(`[data-cy="${ingredient.name}"]`)
            .find('[data-cy="quantity"]')
            .should("have.text", ingredient.quantity)
        );
    });
  }
);

Then("I can type how many of the required materials I have", () => {
  cy.get("@amiyaE2Goal").then((goal: any) => {
    goal.ingredients
      .filter((ingredient) => ingredient.name !== "LMD")
      .map((ingredient) =>
        cy
          .get(`[data-cy="${ingredient.name}"]`)
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
