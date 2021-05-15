import { Before, Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import { addGoal, removeGoal } from "../utils";

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

When("I remove the goal from my planner", () => {
  cy.get('[data-cy="deleteGoal"]').click();
});

When("I add another goal that has the same crafted item", () => {
  addGoal("Absinthe", "Elite 2");
});

When("I remove the first goal from my planner", () => {
  removeGoal("Amiya", "Elite 2");
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

Then(
  "I shouldn't see the items to be crafted in the required materials section",
  () => {
    ["Orirock Cluster", "Chip Catalyst", "Caster Chip Pack"].forEach(
      (ingredientName) => {
        cy.get(`[data-cy="${ingredientName}"]`).should("not.exist");
      }
    );
  }
);

Then("I should see that I'm still crafting those items", () => {
  ["Orirock Concentration", "Caster Dualchip"].forEach((itemName) => {
    cy.get(`[data-cy="${itemName}"]`)
      .find('[data-cy="craftingToggle"]')
      .should("have.attr", "data-crafting", "true");
  });
});

Then(
  "I should still see the item to be crafted in the required materials section",
  () => {
    ["Orirock Cluster", "Chip Catalyst", "Caster Chip Pack"].forEach(
      (ingredientName) => {
        cy.get(`[data-cy="${ingredientName}"]`);
      }
    );
  }
);
