import path from "path";

import enItemTable from "./ArknightsData/en-US/gamedata/excel/item_table.json";
import cnCharacterTable from "./ArknightsData/zh-CN/gamedata/excel/character_table.json";

export const ARKNIGHTS_DATA_DIR = path.join(
  __dirname,
  "../../src/data/arknights"
);
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
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
  const entry = enItemTable.items[itemId as keyof typeof enItemTable.items];
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
    quantity,
  };
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
    quantity: count,
  };
}
