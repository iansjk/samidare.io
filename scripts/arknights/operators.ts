import path from "path";
import fs from "fs";
import cnCharacterTable from "./ArknightsData/zh-CN/gamedata/excel/character_table.json";
import cnSkillTable from "./ArknightsData/zh-CN/gamedata/excel/skill_table.json";
import enCharacterTable from "./ArknightsData/en-US/gamedata/excel/character_table.json";
import enSkillTable from "./ArknightsData/en-US/gamedata/excel/skill_table.json";
import {
  getOperatorName,
  getEliteLMDCost,
  getItemName,
  Ingredient,
} from "./globals";

const OUTDIR = path.join(__dirname, "../../src/data/arknights");
fs.mkdirSync(OUTDIR, { recursive: true });

interface InternalItemRequirement {
  id: string;
  count: number;
}
interface EliteLevelEntry {
  evolveCost: InternalItemRequirement[];
}

interface MasteryLevelEntry {
  skillId: string;
  levelUpCostCond: {
    levelUpCost: InternalItemRequirement[];
  }[];
}

interface SkillLevelEntry {
  lvlUpCost: InternalItemRequirement[];
}

const toIngredient = ({ id, count }: { id: string; count: number }): Ingredient => ({
  id,
  name: getItemName(id),
  quantity: count,
});

const operatorIds = Object.keys(cnCharacterTable)
  .filter((id) => {
    const entry = cnCharacterTable[id as keyof typeof cnCharacterTable];
    return (
      // internal rarity is 0-indexed; we only want 3* and above
      // ids starting with "token_" are summons, not operators
      !id.startsWith("token") && !entry.isNotObtainable && entry.rarity + 1 >= 3
    );
  })
  .sort((a, b) => a.localeCompare(b));

const operatorEntries = operatorIds.map((id: string) => {
  const operatorId = id as keyof typeof cnCharacterTable;
  const name = getOperatorName(operatorId);
  const isCnOnly =
    enCharacterTable[operatorId as keyof typeof enCharacterTable] === undefined;
  const rarity = cnCharacterTable[operatorId].rarity + 1;
  const skillLevels =
    (cnCharacterTable[operatorId].allSkillLvlup as SkillLevelEntry[]).map((skillLevelEntry, i) => {
      const cost = skillLevelEntry.lvlUpCost;
      const ingredients = cost.map(toIngredient);
      return {
        // we want to return the result of a skillup,
        // and since [0] points to skill level 1 -> 2, we add 2
        skillLevel: i + 2,
        ingredients
      };
    });
  // operatorData[id].phases[0] is E0, so we skip that one
  const elite =
    (cnCharacterTable[operatorId].phases.slice(1) as EliteLevelEntry[]).map(({ evolveCost }, i) => {
      const ingredients = evolveCost.map(toIngredient);
      ingredients.unshift(getEliteLMDCost(rarity, i + 1));
      // [0] points to E1, [1] points to E2, so add 1
      return {
        eliteLevel: i + 1,
        ingredients
      };
    });
  const baseObj = {
    name,
    rarity,
    elite,
    skillLevels,
    isCnOnly,
  };
  if (rarity < 4) {
    return baseObj;
  }
  const skillTable = isCnOnly ? cnSkillTable : enSkillTable;
  const skills = (cnCharacterTable[operatorId].skills as MasteryLevelEntry[]).map((masteryLevelEntry, i) => {
      // masteryLevelEntry contains data on all 3 mastery levels for one skill
      const masteries =
        masteryLevelEntry.levelUpCostCond.map(({ levelUpCost }, j) => {
          const ingredients = levelUpCost.map(toIngredient);
          // mastery level -> array of ingredients
          return {
            masteryLevel: j + 1,
            ingredients
          };
        });
      // skill # -> { skill name, skill 1 masteries, skill 2 masteries, ... }
      return {
        slot: i + 1,
        skillId: masteryLevelEntry.skillId,
        iconId: skillTable[masteryLevelEntry.skillId as keyof typeof skillTable].iconId,
        skillName: skillTable[masteryLevelEntry.skillId as keyof typeof skillTable].levels[0].name,
        masteries
      };
    });
  return Object.assign(baseObj, { skills });
});

fs.writeFileSync(
  path.join(OUTDIR, "operators.json"),
  JSON.stringify(operatorEntries, null, 2)
);
