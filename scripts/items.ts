import fs from "fs";
import path from "path";

import axios from "axios";
import { items as cnItemTable } from "./ArknightsData/zh-CN/gamedata/excel/item_table.json";
import cnBuildingData from "./ArknightsData/zh-CN/gamedata/excel/building_data.json";
import { stages as enStageTable } from "./ArknightsData/en-US/gamedata/excel/stage_table.json";
import { stages as cnStageTable } from "./ArknightsData/zh-CN/gamedata/excel/stage_table.json";
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

const EFFICIENT_STAGES = [
  "main_01-07", // "1-7",
  "main_04-04", // "4-4",
  "main_04-05", // "4-5",
  "main_04-07", // "4-7",
  "main_04-09", // "4-9",
  "main_05-02", // "5-2",
  "main_05-05", // "5-5",
  "sub_03-3-1", // "S3-6",
  "sub_05-4-1", // "S5-7",
  "main_07-03", // "7-4",
  "main_07-13", // "7-15",
  "main_07-15", // "7-17",
];

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
  dropRate: number;
  stageId: string;
}

async function getStagesForItems(
  { efficientStagesOnly } = { efficientStagesOnly: false }
): Promise<Record<string, StageItem>> {
  const itemStageMap: Record<string, StageItem> = {};
  let params = { itemFilter: items.map((item) => item.id).join(",") };
  if (efficientStagesOnly) {
    params = Object.assign(params, {
      stageFilter: EFFICIENT_STAGES.join(","),
    });
  }
  const response = await axios.get<PenguinStatsResponse>(
    PENGUIN_STATS_MATRIX_URL,
    { params }
  );
  const { matrix } = response.data;
  matrix
    .filter((cell) => {
      const cnStageData =
        cnStageTable[cell.stageId as keyof typeof cnStageTable];
      const enStageData =
        enStageTable[cell.stageId as keyof typeof enStageTable];
      return enStageData || cnStageData?.zoneId === "main_7";
    })
    .forEach((cell) => {
      const dropRate = cell.quantity / cell.times;
      const stageData = cnStageTable[cell.stageId as keyof typeof cnStageTable];
      const sanityCost = stageData.apCost / dropRate;
      if (
        !Object.prototype.hasOwnProperty.call(itemStageMap, cell.itemId) ||
        itemStageMap[cell.itemId].sanityCost > sanityCost
      ) {
        itemStageMap[cell.itemId] = {
          sanityCost,
          dropRate,
          stageId: cell.stageId,
        };
      }
    });
  return itemStageMap;
}

interface FarmingStage {
  itemSanityCost: number;
  stageSanityCost: number;
  dropRate: number;
  stageName: string;
}

function buildFarmingStage(stageItem: StageItem): FarmingStage {
  const stageData =
    cnStageTable[stageItem.stageId as keyof typeof cnStageTable];
  return {
    stageSanityCost: stageData.apCost,
    stageName: stageData.code,
    itemSanityCost:
      Math.round((stageItem.sanityCost + Number.EPSILON) * 100) / 100,
    dropRate: Math.round((stageItem.dropRate + Number.EPSILON) * 100) / 100,
  };
}

(async () => {
  const [itemEfficientStages, itemFastestStages] = await Promise.all([
    getStagesForItems({
      efficientStagesOnly: true,
    }),
    getStagesForItems(),
  ]);

  const itemsWithStages = items.map((item) => {
    const stages: Record<string, FarmingStage> = {};
    if (Object.prototype.hasOwnProperty.call(itemFastestStages, item.id)) {
      stages.leastSanity = buildFarmingStage(itemFastestStages[item.id]);
    }
    if (Object.prototype.hasOwnProperty.call(itemEfficientStages, item.id)) {
      stages.mostEfficient = buildFarmingStage(itemEfficientStages[item.id]);
    }
    if (Object.keys(stages).length > 0) {
      return {
        ...item,
        stages,
      };
    }
    return item;
  });

  fs.writeFileSync(
    path.join(ARKNIGHTS_DATA_DIR, "items.json"),
    JSON.stringify(itemsWithStages, null, 2)
  );
})();
