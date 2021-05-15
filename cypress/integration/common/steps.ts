import { When } from "cypress-cucumber-preprocessor/steps";
import { addGoal } from "../features/planner/utils";

When(/^I (?:have )?add(?:ed)? a goal to my planner$/, () => {
  addGoal("Amiya", "Elite 2");
});

When("I refresh the page", () => {
  cy.reload();
});
