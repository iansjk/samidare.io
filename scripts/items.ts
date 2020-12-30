import fs from "fs";
import path from "path";

import axios from "axios";
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

const EFFICIENT_STAGES_COSTS: Record<string, number> = {
  "main_01-07": 6, // "1-7",
  "main_04-04": 18, // "4-4",
  "main_04-05": 18, // "4-5",
  "main_04-07": 18, // "4-7",
  "main_04-09": 21, // "4-9",
  "main_05-02": 18, // "5-2",
  "main_05-05": 18, // "5-5",
  "sub_03-3-1": 15, // "S3-6",
  "sub_05-4-1": 18, // "S5-7",
  "main_07-03": 18, // "7-4",
  "main_07-13": 18, // "7-15",
  "main_07-15": 21, // "7-17",
};

const PENGUIN_STATS_MATRIX_URL =
  "https://penguin-stats.io/PenguinStats/api/v2/result/matrix";

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

interface PenguinStatsMatrixCell {
  stageId: string;
  itemId: string;
  quantity: number;
  times: number;
  start: number;
  end: number;
}

interface PenguinStatsResponse {
  matrix: PenguinStatsMatrixCell[];
}

interface StageItem {
  sanityCost: number;
  stageId: string;
}

const itemEfficientStageMap: Record<string, StageItem> = {};
(async () => {
  const response = await axios.get<PenguinStatsResponse>(
    PENGUIN_STATS_MATRIX_URL,
    {
      params: {
        stageFilter: Object.keys(EFFICIENT_STAGES_COSTS).join(","),
        itemFilter: items.map((item) => item.id).join(","),
      },
    }
  );
  const { matrix } = response.data;
  matrix.forEach((cell) => {
    const dropRate = cell.quantity / cell.times;
    const sanityCost = EFFICIENT_STAGES_COSTS[cell.stageId] / dropRate;
    if (
      !Object.prototype.hasOwnProperty.call(
        itemEfficientStageMap,
        cell.itemId
      ) ||
      itemEfficientStageMap[cell.itemId].sanityCost > sanityCost
    ) {
      itemEfficientStageMap[cell.itemId] = {
        sanityCost,
        stageId: cell.stageId,
      };
    }
  });

  const itemsWithEfficientStages = items.map((item) => {
    if (!Object.prototype.hasOwnProperty.call(itemEfficientStageMap, item.id)) {
      return item;
    }
    return Object.assign(item, {
      efficientStage: itemEfficientStageMap[item.id],
    });
  });

  fs.writeFileSync(
    path.join(ARKNIGHTS_DATA_DIR, "items.json"),
    JSON.stringify(itemsWithEfficientStages, null, 2)
  );
})();
