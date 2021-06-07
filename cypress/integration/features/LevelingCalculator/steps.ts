import { Before, Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import { enterOperatorName } from "../../common/utils";

Before(() => {
  cy.visit("/leveling");
});

Given(/^I have chosen (.+) to level$/, (operatorName) => {
  enterOperatorName(operatorName);
});

Given(/^that operator is (\d)\*$/, (_rarity) => {
  // no-op
});

Given(/^I am starting from elite E(\d)$/, (startingElite) => {
  cy.get("#starting-elite").select(`Elite ${startingElite}`);
});

Given(/^I am starting from level (\d+)$/, (startingLevel) => {
  cy.get("#starting-level").type(startingLevel);
});

When("I click on the target elite dropdown", () => {
  // no-operator
});

When(/^I select target elite E(\d)$/, (targetElite) => {
  cy.get("#target-elite").select(`Elite ${targetElite}`);
});

When(/^I select target level (\d+)$/, (targetLevel) => {
  cy.get("#target-level").type(targetLevel);
});

Then(/^I should see the correct E(\d)$/, (maxEndingElite) => {
  cy.get("#target-elite")
    .should("not.be.disabled")
    .then((targetEliteSelect) => {
      Array(3) // e0, e1, e2
        .fill(0)
        .map((_, i) =>
          cy
            .wrap(targetEliteSelect)
            .find("option")
            .should(
              i <= maxEndingElite ? "contain.text" : "not.contain.text",
              `Elite ${i}`
            )
        );
    });
  cy.wrap(maxEndingElite).as("maxElite");
});

Then(/^I should see the correct (\d+)$/, (maxEndingLevel) => {
  cy.get("@maxElite").then((maxElite: any) => {
    cy.get("#target-elite").select(`Elite ${maxElite}`);
    cy.get('[data-cy="endPoint"]').should(
      "contain.text",
      `Between 1 and ${maxEndingLevel}`
    );
  });
});

Then(/^I should see that it costs (\d+) EXP$/, (totalExp) => {
  cy.get('[data-cy="exp"]').should("have.attr", "data-exp", totalExp);
});

Then(/^I should see that it costs (\d+) LMD$/, (totalLmd) => {
  cy.get('[data-cy="lmd"]').should("have.attr", "data-lmd", totalLmd);
});

Then(
  /^I should see that it costs (\d+) LMD for the elite promotions$/,
  (eliteLmd) => {
    cy.get('[data-cy="eliteLmd"]').should(
      "have.attr",
      "data-elite-lmd",
      eliteLmd
    );
  }
);

Then(/^I should see that it costs (\d+) LMD for the levels$/, (levelingLmd) => {
  cy.get('[data-cy="levelingLmd"]').should(
    "have.attr",
    "data-leveling-lmd",
    levelingLmd
  );
});
