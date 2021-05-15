import { When } from "cypress-cucumber-preprocessor/steps";

When(/^I (?:have )?add(?:ed)? a goal to my planner$/, () => {
  cy.get('input[name="operator-name"]').type("Amiya{enter}");
  cy.wait(100);
  cy.get("#goal-select").click();
  cy.get('li[role="option"]').contains("Elite 2").click().type("{esc}");
  cy.contains("Add").click();
});

When("I refresh the page", () => {
  cy.reload();
});
