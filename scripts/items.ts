import fs from "fs";
import path from "path";

import axios from "axios";
import { items as cnItemTable } from "./ArknightsGameData/zh_CN/gamedata/excel/item_table.json";
import cnBuildingData from "./ArknightsGameData/zh_CN/gamedata/excel/building_data.json";
import { stages as enStageTable } from "./ArknightsGameData/en_US/gamedata/excel/stage_table.json";
import { stages as cnStageTable } from "./ArknightsGameData/zh_CN/gamedata/excel/stage_table.json";
import {
  ARKNIGHTS_DATA_DIR,
  getItemName,
  InternalItemRequirement,
  toIngredient,
} from "./globals";

const {
  workshopFormulas,
  manufactFormulas: manufactureFormulas,
} = cnBuildingData;

interface FormulaEntry {
  goldCost?: number;
  costs: InternalItemRequirement[];
}

// maximum item sanity cost multiplier when considering a stage as being "efficient"
// e.g. if Sugar Substitute costs 4x+ sanity per item farming it from the "most efficient" stage
// compared to the sanity per item from the "least sanity" stage, then don't display a most efficient stage
// (since it'd take way too long to get the item from the prospective most efficient stage)
const EFFICIENT_STAGE_MAX_ITEM_SANITY_COST_MULTIPLIER = 4;

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
  "wk_fly_5", // "CA-5",
  "main_01-07", // "1-7",
  "main_04-04", // "4-4",
  "main_04-05", // "4-5",
  "main_04-07", // "4-7",
  "main_04-09", // "4-9",
  "main_05-02", // "5-2",
  "main_05-05", // "5-5",
  "sub_03-3-1", // "S3-6",
  "main_07-03", // "7-4",
  "main_07-06", // "7-8",
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
    const { sortId } = entry;
    const baseObj = {
      id,
      name,
      tier,
      sortId,
    };
    const workshopFormulaId = entry.buildingProductList.find(
      ({ roomType }) => roomType === "WORKSHOP"
    )?.formulaId;
    const manufactureFormulaId = entry.buildingProductList.find(
      ({ roomType }) => roomType === "MANUFACTURE"
    )?.formulaId;

    if (workshopFormulaId || manufactureFormulaId) {
      const formula: FormulaEntry = workshopFormulaId
        ? workshopFormulas[workshopFormulaId as keyof typeof workshopFormulas]
        : manufactureFormulas[
            manufactureFormulaId as keyof typeof manufactureFormulas
          ];
      const ingredients = formula.costs.map(toIngredient);
      if (typeof formula.goldCost !== "undefined" && formula.goldCost > 0) {
        ingredients.unshift({
          id: "4001",
          name: "LMD",
          tier: 4,
          quantity: formula.goldCost,
          sortId: 10004,
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
    .filter((cell) =>
      Object.prototype.hasOwnProperty.call(enStageTable, cell.stageId)
    )
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

function buildFarmingStage(itemId: string, stageItem: StageItem): FarmingStage {
  const stageData =
    cnStageTable[stageItem.stageId as keyof typeof cnStageTable];
  const itemName = getItemName(itemId);
  const dropRate =
    itemName.endsWith("Chip") || itemName.endsWith("Chip Pack")
      ? 0.5
      : Math.round((stageItem.dropRate + Number.EPSILON) * 100) / 100;

  return {
    stageSanityCost: stageData.apCost,
    stageName: stageData.code,
    itemSanityCost:
      Math.round((stageItem.sanityCost + Number.EPSILON) * 100) / 100,
    dropRate,
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
      stages.leastSanity = buildFarmingStage(
        item.id,
        itemFastestStages[item.id]
      );
    }
    if (Object.prototype.hasOwnProperty.call(itemEfficientStages, item.id)) {
      const mostEfficientStage = buildFarmingStage(
        item.id,
        itemEfficientStages[item.id]
      );
      if (stages.leastSanity) {
        if (
          mostEfficientStage.itemSanityCost <=
          stages.leastSanity.itemSanityCost *
            EFFICIENT_STAGE_MAX_ITEM_SANITY_COST_MULTIPLIER
        ) {
          stages.mostEfficient = mostEfficientStage;
          // if the least sanity stage and the most efficient stage are the same,
          // display the stage only once as "most efficient"
          if (stages.leastSanity.stageName === stages.mostEfficient.stageName) {
            delete stages.leastSanity;
          }
        }
      }
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
