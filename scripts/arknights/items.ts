import fs from "fs";
import path from "path";

import { items as cnItemTable } from "./ArknightsData/zh-CN/gamedata/excel/item_table.json";
import cnBuildingData from "./ArknightsData/zh-CN/gamedata/excel/building_data.json";
import {
  ARKNIGHTS_DATA_DIR,
  getItemName,
  InternalItemRequirement,
  toIngredient,
} from "./globals";

const { workshopFormulas } = cnBuildingData;

interface FormulaEntry {
  rarity: number;
  goldCost: number;
  costs: InternalItemRequirement[];
}

const WHITELISTED_ITEMS = new Set([
  "LMD",
  "Orirock",
  "Orirock Cube",
  "Orirock Cluster",
  "Orirock Concentration",
  "Sugar Substitute",
  "Sugar",
  "Sugar Pack",
  "Sugar Lump",
  "Ester",
  "Polyester",
  "Polyester Pack",
  "Polyester Lump",
  "Oriron Shard",
  "Oriron",
  "Oriron Cluster",
  "Oriron Block",
  "Diketon",
  "Polyketon",
  "Aketon",
  "Keton Colloid",
  "Damaged Device",
  "Device",
  "Integrated Device",
  "Optimized Device",
  "Grindstone",
  "Manganese Ore",
  "Loxic Kohl",
  "RMA70-12",
  "Coagulating Gel",
  "Incandescent Alloy",
  "Crystal Component",
  "White Horse Kohl",
  "Manganese Trihydrate",
  "Grindstone Pentahydrate",
  "RMA70-24",
  "Polymerized Gel",
  "Incandescent Alloy Block",
  "Crystal Circuit",
  "Polymerization Preparation",
  "Bipolar Nanoflake",
  "D32 Steel",
  "Crystal Electronic Unit",
  "Skill Summary - 1",
  "Skill Summary - 2",
  "Skill Summary - 3",
  "Chip Catalyst",
  "Caster Chip",
  "Caster Chip Pack",
  "Caster Dualchip",
  "Vanguard Chip",
  "Vanguard Chip Pack",
  "Vanguard Dualchip",
  "Defender Chip",
  "Defender Chip Pack",
  "Defender Dualchip",
  "Sniper Chip",
  "Sniper Chip Pack",
  "Sniper Dualchip",
  "Guard Chip",
  "Guard Chip Pack",
  "Guard Dualchip",
  "Supporter Chip",
  "Supporter Chip Pack",
  "Supporter Dualchip",
  "Medic Chip",
  "Medic Chip Pack",
  "Medic Dualchip",
  "Specialist Chip",
  "Specialist Chip Pack",
  "Specialist Dualchip",
]);

const items = Object.keys(cnItemTable)
  .filter((id) => WHITELISTED_ITEMS.has(getItemName(id)))
  .map((id) => {
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
          tier: 4,
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
