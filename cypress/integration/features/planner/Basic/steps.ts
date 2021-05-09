import {
  Before,
  Given,
  When,
  Then,
  And,
} from "cypress-cucumber-preprocessor/steps";

Before(() => cy.visit("/planner"));

When("I add a goal to my planner", () => {
  cy.get('input[name="operator-name"]').type("Amiya{enter}");
  cy.get("#goal-select").click();
  cy.get('li[ role="option"]').contains("Elite 2").click().type("{esc}");
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
    cy.fixture("amiya-e2.json")
      .as("amiyaE2Goal")
      .then((goal) => {
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
      .map((ingredient, i) =>
        cy
          .get(`[data-cy="${ingredient.name}"]`)
          .find('[data-cy="owned"]')
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

Then("I can decrement them", () => {
  cy.get("@materialsList")
    .find('[data-cy="decrement"]')
    .each(($el) => {
      cy.wrap($el).click();
    });
});
