/* eslint-disable import/prefer-default-export */

export function enterOperatorName(operatorName: string): Cypress.Chainable {
  cy.get("#operator-name").type(`${operatorName}{enter}`);
  return cy.wait(300);
}
