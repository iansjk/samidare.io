import fs from "fs";
import path from "path";

import cnItemData from "./ArknightsData/zh-CN/gamedata/excel/item_table.json";
import cnBuildingData from "./ArknightsData/zh-CN/gamedata/excel/building_data.json";
import {
  ARKNIGHTS_DATA_DIR,
  getItemName,
  InternalItemRequirement,
  toIngredient,
} from "./globals";

const cnItemTable = cnItemData.items;
const { workshopFormulas } = cnBuildingData;

interface FormulaEntry {
  rarity: number;
  goldCost: number;
  costs: InternalItemRequirement[];
}

const items = Object.keys(cnItemTable).map((id) => {
  const entry = cnItemTable[id as keyof typeof cnItemTable];
  const name = getItemName(id);
  const tier = entry.rarity + 1;
  const baseObj = {
    id,
    name,
    tier,
  };
  const formulaId = entry.buildingProductList.find(
    ({ roomType }) => roomType === "WORKSHOP"
  )?.formulaId;
  if (formulaId) {
    const formula: FormulaEntry =
      workshopFormulas[formulaId as keyof typeof workshopFormulas];
    const ingredients = formula.costs.map(toIngredient);
    if (formula.goldCost > 0) {
      ingredients.unshift({
        id: "4001",
        name: "LMD",
        quantity: formula.goldCost,
      });
    }
    return Object.assign(baseObj, { ingredients });
  }
  return baseObj;
});

fs.writeFileSync(
  path.join(ARKNIGHTS_DATA_DIR, "items.json"),
  JSON.stringify(items, null, 2)
);
