import path from "path";
import fs from "fs";
import cnCharacterTable from "./ArknightsGameData/zh_CN/gamedata/excel/character_table.json";
import cnSkillTable from "./ArknightsGameData/zh_CN/gamedata/excel/skill_table.json";
import { patchChars as cnCharacterPatchTable } from "./ArknightsGameData/zh_CN/gamedata/excel/char_patch_table.json";
import enCharacterTable from "./ArknightsGameData/en_US/gamedata/excel/character_table.json";
import { patchChars as enCharacterPatchTable } from "./ArknightsGameData/en_US/gamedata/excel/char_patch_table.json";
import enSkillTable from "./ArknightsGameData/en_US/gamedata/excel/skill_table.json";
import {
  getOperatorName,
  getEliteLMDCost,
  InternalItemRequirement,
  toIngredient,
  ARKNIGHTS_DATA_DIR,
  Ingredient,
} from "./globals";

enum GoalCategory {
  "Elite" = 0,
  "Mastery",
  "Skill Level",
}

interface OperatorGoal {
  goalName: string;
  goalShortName?: string;
  goalCategory: GoalCategory;
  ingredients: Ingredient[];
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

const operatorIds = [
  ...Object.keys(cnCharacterTable)
    .filter((id) => {
      const entry = cnCharacterTable[id as keyof typeof cnCharacterTable];
      return (
        // internal rarity is 0-indexed; we only want 3* and above
        // ids starting with "token_" are summons, not operators
        Object.prototype.hasOwnProperty.call(cnCharacterPatchTable, id) ||
        (!id.startsWith("token") && !entry.isNotObtainable)
      );
    })
    .sort((a, b) => a.localeCompare(b)),
  ...Object.keys(cnCharacterPatchTable),
];

const operatorEntries = operatorIds.map((id: string) => {
  const operatorId = id as keyof typeof cnCharacterTable;
  const name = getOperatorName(operatorId);
  const isPatchCharacter = Object.prototype.hasOwnProperty.call(
    cnCharacterPatchTable,
    operatorId
  );
  const isCnOnly =
    typeof enCharacterTable[operatorId as keyof typeof enCharacterTable] ===
      "undefined" &&
    typeof enCharacterPatchTable[
      operatorId as keyof typeof enCharacterPatchTable
    ] === "undefined";
  const entry: any = {
    name,
    isCnOnly,
  };
  if (name === "Amiya (Guard)") {
    entry.rarity = 5;
  }
  if (!isPatchCharacter) {
    entry.rarity = cnCharacterTable[operatorId].rarity + 1;
    entry.skillLevels = (cnCharacterTable[operatorId]
      .allSkillLvlup as SkillLevelEntry[]).map((skillLevelEntry, i) => {
      const cost = skillLevelEntry.lvlUpCost;
      const ingredients = cost.map(toIngredient);
      return {
        // we want to return the result of a skillup,
        // and since [0] points to skill level 1 -> 2, we add 2
        skillLevel: i + 2,
        ingredients,
        goalName: `Skill Level ${i + 1} → ${i + 2}`,
        goalShortName: `Skill Level ${i + 2}`,
        goalCategory: GoalCategory["Skill Level"],
      };
    });
    // operatorData[id].phases[0] is E0, so we skip that one
    entry.elite = (cnCharacterTable[operatorId].phases.slice(
      1
    ) as EliteLevelEntry[]).map(({ evolveCost }, i) => {
      const ingredients = evolveCost.map(toIngredient);
      ingredients.unshift(getEliteLMDCost(entry.rarity, i + 1));
      // [0] points to E1, [1] points to E2, so add 1
      return {
        eliteLevel: i + 1,
        ingredients,
        goalName: `Elite ${i + 1}`,
        goalCategory: GoalCategory.Elite,
      };
    });
  }
  if (isPatchCharacter || entry.rarity > 3) {
    const skillTable = isCnOnly ? cnSkillTable : enSkillTable;
    const masteryEntries = (isPatchCharacter
      ? cnCharacterPatchTable[operatorId as keyof typeof cnCharacterPatchTable]
          .skills
      : cnCharacterTable[operatorId].skills) as MasteryLevelEntry[];
    entry.skills = masteryEntries.map((masteryLevelEntry, i) => {
      // masteryLevelEntry contains data on all 3 mastery levels for one skill
      const masteries: OperatorGoal[] = masteryLevelEntry.levelUpCostCond.map(
        ({ levelUpCost }, j) => {
          const ingredients = levelUpCost.map(toIngredient);
          // mastery level -> array of ingredients
          return {
            masteryLevel: j + 1,
            ingredients,
            goalName: `Skill ${i + 1} Mastery ${j + 1}`,
            goalShortName: `S${i + 1} M${j + 1}`,
            goalCategory: GoalCategory.Mastery,
          };
        }
      );
      // skill # -> { skill name, skill 1 masteries, skill 2 masteries, ... }
      return {
        slot: i + 1,
        skillId: masteryLevelEntry.skillId,
        iconId:
          skillTable[masteryLevelEntry.skillId as keyof typeof skillTable]
            .iconId,
        skillName:
          skillTable[masteryLevelEntry.skillId as keyof typeof skillTable]
            .levels[0].name,
        masteries,
      };
    });
  }
  return entry;
});

fs.mkdirSync(ARKNIGHTS_DATA_DIR, { recursive: true });
fs.writeFileSync(
  path.join(ARKNIGHTS_DATA_DIR, "operators.json"),
  JSON.stringify(operatorEntries, null, 2)
);
