import path from "path";

import { items as enItemTable } from "./ArknightsData/en-US/gamedata/excel/item_table.json";
import { items as cnItemTable } from "./ArknightsData/zh-CN/gamedata/excel/item_table.json";
import cnCharacterTable from "./ArknightsData/zh-CN/gamedata/excel/character_table.json";

export const ARKNIGHTS_DATA_DIR = path.join(__dirname, "../src/data");
export interface Ingredient {
  id: string;
  name: string;
  tier: number;
  quantity: number;
  sortId: number;
}

export interface InternalItemRequirement {
  id: string;
  count: number;
}

const operatorNameOverride: Record<string, string> = {
  ShiraYuki: "Shirayuki",
  Гум: "Gummy",
  Зима: "Zima",
  Истина: "Istina",
  Роса: "Rosa",
};

const itemNameOverride: Record<string, string> = {
  31033: "Crystal Component",
  31034: "Crystal Circuit",
  30145: "Crystal Electronic Unit",
};

export function getOperatorName(operatorId: string): string | null {
  const entry = cnCharacterTable[operatorId as keyof typeof cnCharacterTable];
  if (entry === undefined || entry.isNotObtainable) {
    return null;
  }
  const { appellation } = entry;
  return Object.prototype.hasOwnProperty.call(operatorNameOverride, appellation)
    ? operatorNameOverride[appellation]
    : appellation;
}

export function getItemName(itemId: string): string {
  const entry = enItemTable[itemId as keyof typeof enItemTable];
  const name = entry?.name ?? itemNameOverride[itemId];
  return name;
}

export function getEliteLMDCost(
  rarity: number,
  eliteLevel: number
): Ingredient {
  let quantity = -1;
  if (rarity === 3) {
    quantity = 10000;
  } else if (rarity === 4) {
    quantity = eliteLevel === 2 ? 60000 : 15000;
  } else if (rarity === 5) {
    quantity = eliteLevel === 2 ? 120000 : 20000;
  } else if (rarity === 6) {
    quantity = eliteLevel === 2 ? 180000 : 30000;
  }
  return {
    id: "4001",
    name: "LMD",
    tier: 4,
    quantity,
    sortId: 10004,
  };
}

const ITEM_TIERS = Object.fromEntries(
  Object.keys(cnItemTable).map((id) => [
    id,
    cnItemTable[id as keyof typeof cnItemTable].rarity + 1,
  ])
);

function getItemTier(id: string): number {
  return ITEM_TIERS[id];
}

export function toIngredient({
  id,
  count,
}: {
  id: string;
  count: number;
}): Ingredient {
  return {
    id,
    name: getItemName(id),
    tier: getItemTier(id),
    quantity: count,
    sortId: cnItemTable[id as keyof typeof cnItemTable].sortId,
  };
}
