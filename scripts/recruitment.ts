import fs from "fs";
import path from "path";
import { ARKNIGHTS_DATA_DIR } from "./globals";
import {
  gachaTags,
  recruitDetail,
} from "./ArknightsData/en-US/gamedata/excel/gacha_table.json";
import characterTable from "./ArknightsData/en-US/gamedata/excel/character_table.json";

function toTitleCase(string: string) {
  return [...string.toLowerCase()]
    .map((char, i) => (i === 0 ? char.toUpperCase() : char))
    .join("");
}

function professionToClass(profession: string) {
  switch (profession) {
    case "PIONEER":
      return "Vanguard";
    case "WARRIOR":
      return "Guard";
    case "SPECIAL":
      return "Specialist";
    case "TANK":
      return "Defender";
    case "SUPPORT":
      return "Supporter";
    default:
      return toTitleCase(profession);
  }
}

const operatorNameToId: Record<
  string,
  keyof typeof characterTable
> = Object.fromEntries(
  Object.entries(characterTable).map(([id, opData]) => [
    opData.name,
    id as keyof typeof characterTable,
  ])
);

const recruitMessageHeader =
  "<@rc.title>Recruitment Rules</>\n\n<@rc.em>Only when you choose this tag can you have a chance to obtain a ★★★★★★ Operator</>\n<@rc.em>Top Operator</>\n\n<@rc.subtitle>※All Possible Operators※</>\n<@rc.eml>Operators displayed in green cannot be obtained through Headhunting. You can get them through Recruitment</>\n\n";
const recruitmentStrings = recruitDetail
  .replace(recruitMessageHeader, "")
  .split(/★+/);
const recruitableOperators = recruitmentStrings.map((line) =>
  line
    .replace(/(\\n)|(<[^>]+>)|-{2,}/g, "")
    .replace("Feater", "FEater")
    .trim()
    .split(/\s?\/\s?/)
);

const recruitment = recruitableOperators.flatMap((opNames, rarity) =>
  opNames
    .filter((name) => !!name)
    .map((opName) => {
      const opData = characterTable[operatorNameToId[opName]];
      const tags = [
        ...(opData.tagList ?? []),
        toTitleCase(opData.position),
        professionToClass(opData.profession),
      ];
      if (rarity === 1) {
        tags.push("Robot");
      } else if (rarity === 2) {
        tags.push("Starter");
      } else if (rarity === 6) {
        tags.push("Top Operator");
      }
      if (rarity >= 5) {
        tags.push("Senior Operator");
      }
      return {
        name: opName,
        rarity,
        tags,
      };
    })
);

fs.writeFileSync(
  path.join(ARKNIGHTS_DATA_DIR, "recruitment.json"),
  JSON.stringify(recruitment, null, 2)
);

fs.writeFileSync(
  path.join(ARKNIGHTS_DATA_DIR, "recruitment-tags.json"),
  JSON.stringify(
    gachaTags.map((tag) => tag.tagName),
    null,
    2
  )
);
