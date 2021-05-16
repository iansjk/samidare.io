/* eslint-disable import/prefer-default-export */
export function enterOperatorName(operatorName: string): Cypress.Chainable {
  cy.get('input[name="operator-name"]').type(`${operatorName}{enter}`);
  return cy.wait(300);
}

export function addGoal(
  operatorName: string,
  goalName: string
): Cypress.Chainable {
  enterOperatorName(operatorName);
  cy.get("#goal-select").click();
  cy.get('li[role="option"]').contains(goalName).click().type("{esc}");
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
