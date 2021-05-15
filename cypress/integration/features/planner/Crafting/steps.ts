import { Before, Given, Then, When } from "cypress-cucumber-preprocessor/steps";

Before(() => {
  cy.visit("/planner");
});

function craftItem(itemName: string) {
  cy.get(`[data-cy="${itemName}"]`).find('[data-cy="craftingToggle"]').click();
}

Given("I have marked some items to be crafted", () => {
  ["Orirock Concentration", "Caster Dualchip"].forEach((itemName) =>
    craftItem(itemName)
  );
});

When("I mark an item to be crafted that has a craftable ingredient", () => {
  craftItem("Orirock Concentration");
});

When("I mark that ingredient to be crafted too", () => {
  craftItem("Orirock Cluster");
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
