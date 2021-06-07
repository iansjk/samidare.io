/* eslint-disable import/prefer-default-export */
import { enterOperatorName } from "../../common/utils";

export function addGoal(
  operatorName: string,
  goalName: string
): Cypress.Chainable {
  enterOperatorName(operatorName);
  cy.get("#goal-select").click();
  cy.get("#menu-goal-select").contains(goalName).click().type("{esc}");
  return cy.contains("Add").click();
}

export function removeGoal(
  operatorName: string,
  goalName: string
): Cypress.Chainable {
  return cy
    .get(
      `[data-cy="operatorGoalCard"][data-operator-name="${operatorName}"][data-goal-name="${goalName}"]`
    )
    .find('[data-cy="deleteGoal"]')
    .click();
}
