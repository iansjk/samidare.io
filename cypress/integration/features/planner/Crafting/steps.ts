import { Before, Then, When } from "cypress-cucumber-preprocessor/steps";

Before(() => {
  cy.visit("/planner");
});

When("I mark an item to be crafted that has a craftable ingredient", () => {
  cy.get('[data-cy="Orirock Concentration"]')
    .find('[data-cy="craftingToggle"]')
    .click();
});

When("I mark that ingredient to be crafted too", () => {
  cy.get('[data-cy="Orirock Cluster"]')
    .find('[data-cy="craftingToggle"]')
    .click();
});

Then("I should be able to craft the higher tier, craftable items", () => {
  cy.get('[data-cy="Orirock Concentration"]').find(
    '[data-cy="craftingToggle"]'
  );
});

Then("I should not be able to craft the uncraftable items", () => {
  cy.get('[data-cy="Loxic Kohl"]').contains("Uncraftable");
});

Then(
  "I should see that ingredient's ingredients in the required materials section",
  () => {
    cy.get('[data-cy="Orirock Cube"]');
  }
);
