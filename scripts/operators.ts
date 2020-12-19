import path from 'path';
import fs from 'fs';
import cnCharacterTable from '../ArknightsData/zh-CN/gamedata/excel/character_table.json';
import cnCharacterPatchTable from '../ArknightsData/zh-CN/gamedata/excel/char_patch_table.json';

const OUTDIR = path.join(__dirname, 'src/data');

const operatorIds = Object.keys(cnCharacterTable)
  .filter((id) => {
    const entry = cnCharacterTable[id as keyof typeof cnCharacterTable];
    return (
      !id.startsWith('token') && !entry.isNotObtainable && entry.rarity + 1 >= 3
    );
  })
  .sort((a, b) => a.localeCompare(b));
console.log(operatorIds);
