describe("removing crafted items", () => {
  beforeEach(() => {
    window.localStorage.setItem(
      "operatorGoals",
      JSON.stringify([
        {
          operatorName: "Rosa",
          eliteLevel: 2,
          goalCategory: 0,
          goalName: "Elite 2",
          ingredients: [
            { name: "LMD", tier: 4, quantity: 180000 },
            { name: "Sniper Dualchip", tier: 5, quantity: 4 },
            { name: "Bipolar Nanoflake", tier: 5, quantity: 4 },
            { name: "Optimized Device", tier: 4, quantity: 6 },
          ],
        },
        {
          operatorName: "Exusiai",
          eliteLevel: 2,
          goalCategory: 0,
          goalName: "Elite 2",
          ingredients: [
            { name: "LMD", tier: 4, quantity: 180000 },
            { name: "Sniper Dualchip", tier: 5, quantity: 4 },
            { name: "Polymerization Preparation", tier: 5, quantity: 4 },
            { name: "Sugar Lump", tier: 4, quantity: 5 },
          ],
        },
      ])
    );
    window.localStorage.setItem(
      "itemsToCraft",
      JSON.stringify({
        "Sniper Dualchip": {
          name: "Sniper Dualchip",
          tier: 5,
          ingredients: [
            { name: "Sniper Chip Pack", quantity: 2, tier: 4 },
            { name: "Chip Catalyst", quantity: 1, tier: 4 },
          ],
        },
      })
    );
    cy.visit("/planner");
  });

  it("removes crafted items for a goal when its goal is removed", () => {
    cy.get('button[aria-label~="delete" i]').click({ multiple: true });
    cy.getByTestId("materialsLists").should("be.empty");
  });

  it("keeps crafted items for a deleted goal if another goal needs them", () => {
    cy.get('button[aria-label~="delete" i]').first().click();
    cy.getByTestId("Sniper Dualchip").within(() => {
      cy.get("button").contains("crafting", { matchCase: false });
    });
  });
});

describe("crafted item chaining", () => {
  beforeEach(() => {
    window.localStorage.setItem(
      "operatorGoals",
      JSON.stringify([
        {
          operatorName: "Siege",
          eliteLevel: 2,
          goalCategory: 0,
          goalName: "Elite 2",
          ingredients: [
            { name: "LMD", tier: 4, quantity: 180000 },
            { name: "Vanguard Dualchip", tier: 5, quantity: 4 },
            { name: "Bipolar Nanoflake", tier: 5, quantity: 4 },
            { name: "Orirock Concentration", tier: 4, quantity: 6 },
          ],
        },
      ])
    );
    cy.visit("/planner");
  });

  it("marks chained crafted items", () => {
    cy.getByTestId("Orirock Concentration").as("concentration");
    cy.get("@concentration")
      .contains(/craft$/i)
      .click();
    cy.get("@concentration")
      .contains(/crafting/i)
      .closest("button")
      .should("have.class", "MuiButton-contained");
    cy.getByTestId("Orirock Cluster").as("cluster");
    cy.get("@cluster").contains(/craft/i).click();
    cy.getByTestId("Orirock Cube").as("cube");
    cy.get("@cube").contains(/craft/i).click();
    cy.getByTestId("Orirock").as("orirock");
    cy.get("@cube").find("input").type(800);
    cy.get("@cluster").find("[data-testid=quantity]").should("have.text", 0);
    cy.get("@cube").find("[data-testid=quantity]").should("have.text", 120);
    cy.get("@orirock").find("[data-testid=quantity]").should("have.text", 0);
    cy.get("@orirock").find("input").type(1000);
    cy.get("@cube").find("[data-testid=quantity]").should("have.text", 0);

    cy.get("@cube").find("input").type(0);
    cy.get("@orirock").find("[data-testid=complete]");
    cy.get("@cube").find("[data-testid=complete]");
    cy.get("@cluster").find("[data-testid=complete]");
    cy.get("@concentration").find("[data-testid=complete]");
  });

  it("removes a crafted item's ingredients from the materials list when crafting is turned off", () => {
    cy.getByTestId("Orirock Concentration").as("concentration");
    cy.get("@concentration")
      .contains(/craft$/i)
      .click();
    cy.getByTestId("Orirock Cluster").contains(/craft/i).click();
    cy.getByTestId("Orirock Cube").contains(/craft/i).click();
    cy.get("@concentration")
      .contains(/crafting/i)
      .click(); // now stop crafting concentration
    cy.getByTestId("Orirock Cluster").should("not.exist");
    cy.getByTestId("Orirock Cube").should("not.exist");
    cy.getByTestId("Orirock").should("not.exist");
  });
});

describe("item requirements for crafted items", () => {
  beforeEach(() => {
    window.localStorage.setItem(
      "operatorGoals",
      JSON.stringify([
        {
          operatorName: "FEater",
          goalCategory: 2,
          goalName: "Skill Level 6 → 7",
          goalShortName: "Skill Level 7",
          skillLevel: 7,
          ingredients: [
            { name: "Skill Summary - 3", tier: 4, quantity: 6 },
            { name: "Oriron Cluster", tier: 3, quantity: 2 },
            { name: "Grindstone", tier: 3, quantity: 3 },
          ],
        },
      ])
    );
    window.localStorage.setItem(
      "itemsToCraft",
      JSON.stringify({
        "Skill Summary - 3": {
          name: "Skill Summary - 3",
          tier: 4,
          ingredients: [{ name: "Skill Summary - 2", quantity: 3, tier: 3 }],
        },
        "Skill Summary - 2": {
          name: "Skill Summary - 2",
          tier: 3,
          ingredients: [{ name: "Skill Summary - 1", quantity: 3, tier: 2 }],
        },
      })
    );
    cy.visit("/planner");
  });

  it("updates item requirements for upstream and downstream items", () => {
    cy.getByTestId("Skill Summary - 3").as("ss3");
    cy.get("@ss3").find("input").type(1);
    cy.get("@ss3").find("[data-testid=quantity]").should("have.text", 6); // no change to required #
    cy.getByTestId("Skill Summary - 2").as("ss2");
    cy.get("@ss2").find("[data-testid=quantity]").should("have.text", 15);
    cy.getByTestId("Skill Summary - 1").as("ss1");
    cy.get("@ss1").find("[data-testid=quantity]").should("have.text", 45);

    cy.get("@ss1").find("input").type(3);
    cy.get("@ss2").find("[data-testid=quantity]").should("have.text", 14);
  });
});

describe("crafted ingredient requirements and regular requirements", () => {
  beforeEach(() => {
    window.localStorage.setItem(
      "operatorGoals",
      JSON.stringify([
        {
          operatorName: "Rosa",
          eliteLevel: 2,
          goalCategory: 0,
          goalName: "Elite 2",
          ingredients: [
            { name: "LMD", tier: 4, quantity: 180000 },
            { name: "Sniper Dualchip", tier: 5, quantity: 4 },
            { name: "Bipolar Nanoflake", tier: 5, quantity: 4 },
            { name: "Optimized Device", tier: 4, quantity: 6 },
          ],
        },
        {
          operatorName: "Siege",
          eliteLevel: 2,
          goalCategory: 0,
          goalName: "Elite 2",
          ingredients: [
            { name: "LMD", tier: 4, quantity: 180000 },
            { name: "Vanguard Dualchip", tier: 5, quantity: 4 },
            { name: "Bipolar Nanoflake", tier: 5, quantity: 4 },
            { name: "Orirock Concentration", tier: 4, quantity: 6 },
          ],
        },
      ])
    );
    cy.visit("/planner");
  });

  it("sums up crafted ingredient requirements and regular item requirements", () => {
    cy.getByTestId("Optimized Device").as("od");
    cy.get("@od").find("[data-testid=quantity]").should("have.text", 6);
    cy.getByTestId("Bipolar Nanoflake").contains(/craft/i).click();
    cy.get("@od").find("[data-testid=quantity]").should("have.text", 14);
    cy.get("@od").contains(/craft/i).click();
    cy.getByTestId("Integrated Device")
      .find("[data-testid=quantity]")
      .should("have.text", 14);
    cy.getByTestId("Orirock Cluster")
      .find("[data-testid=quantity]")
      .should("have.text", 28);
    cy.getByTestId("Grindstone")
      .find("[data-testid=quantity]")
      .should("have.text", 14);
  });
});
