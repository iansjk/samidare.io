import { Before, Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import { addGoal, removeGoal } from "../utils";

const ITEMS_TO_CRAFT = ["Orirock Concentration", "Caster Dualchip"];
const CRAFTED_ITEM_INGREDIENTS = [
  "Orirock Cluster",
  "Chip Catalyst",
  "Caster Chip Pack",
];

Before(() => {
  cy.visit("/planner");
});

function craftItem(itemName: string) {
  cy.get(`[data-cy="${itemName}"]`).find('[data-cy="craftingToggle"]').click();
}

Given("I have marked some items to be crafted", () => {
  ITEMS_TO_CRAFT.forEach((itemName) => craftItem(itemName));
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

When("I obtain some more of the item to be crafted", () => {
  ITEMS_TO_CRAFT.forEach((itemName) => {
    cy.get(`[data-cy="${itemName}"]`)
      .find('[data-cy="increment"]')
      .then((incrementButton) => {
        cy.scrollTo("top");
        cy.wrap(incrementButton).click();
      });
  });
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
    CRAFTED_ITEM_INGREDIENTS.forEach((ingredientName) => {
      cy.get(`[data-cy="${ingredientName}"]`).should("not.exist");
    });
  }
);

Then("I should see that I'm still crafting those items", () => {
  ITEMS_TO_CRAFT.forEach((itemName) => {
    cy.get(`[data-cy="${itemName}"]`)
      .find('[data-cy="craftingToggle"]')
      .should("have.attr", "data-crafting", "true");
  });
});

Then(
  "I should still see the item to be crafted in the required materials section",
  () => {
    CRAFTED_ITEM_INGREDIENTS.forEach((ingredientName) => {
      cy.get(`[data-cy="${ingredientName}"]`);
    });
  }
);

Then("I should see that I need less of its ingredients", () => {
  const expectedCounts = {
    "Caster Chip Pack": 4,
    "Chip Catalyst": 2,
    "Orirock Cluster": 36,
  };
  CRAFTED_ITEM_INGREDIENTS.forEach((ingredientName) => {
    cy.get(`[data-cy="${ingredientName}"]`)
      .find('[data-cy="quantity"]')
      .should("have.text", expectedCounts[ingredientName]);
  });
});
