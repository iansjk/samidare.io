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
  cy.get('[data-testid="goalsList"]').contains("Amiya Elite 2");
});
