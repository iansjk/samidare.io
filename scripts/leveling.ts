import path from "path";
import fs from "fs";

import {
  maxLevel as maxLevelByElite,
  characterExpMap as expCostByElite,
  characterUpgradeCostMap as lmdCostByElite,
  evolveGoldCost as eliteLmdCostByElite,
} from "./ArknightsGameData/zh_CN/gamedata/excel/gamedata_const.json";
import { ARKNIGHTS_DATA_DIR } from "./globals";

const out = {
  maxLevelByElite,
  expCostByElite,
  lmdCostByElite,
  eliteLmdCostByElite,
};
fs.writeFileSync(
  path.join(ARKNIGHTS_DATA_DIR, "leveling.json"),
  JSON.stringify(out, null, 2)
);
