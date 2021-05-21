import { Given, Then, When } from "cypress-cucumber-preprocessor/steps/index";

Given(/^I have chosen (.+) to level$/, (operatorName) => {});

Given(/^that operator is (\d)\*$/, (rarity) => {});

Given(
  /^I am starting from elite (\d) level (\d+)$/,
  (startingElite, startingLevel) => {}
);

When("I click on the Elite dropdown", () => {});

When(/^I select target elite (\d)$/, (targetElite) => {});

When(/^I select target level (\d)+$/, (targetLevel) => {});

Then(/^I should see the correct E(\d)$/, (maxElite) => {});

Then(/^I should see the correct (\d+)$/, (maxLevel) => {});

Then(
  /^I should see that it costs (\d+) LMD and (\d+) EXP$/,
  (lmdCost, expCost) => {}
);
