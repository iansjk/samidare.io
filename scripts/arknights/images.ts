/* eslint-disable import/prefer-default-export */
import path from "path";
import { promises as fs } from "fs";
import slugify from "../../src/utils";
import { getOperatorName } from "./globals";

const ACESHIP_BASEDIR = path.join(__dirname, "aceship");
const OUTDIR = path.join(__dirname, "../../static/arknights/images");

const skillIconFilenameRegex = /skill_icon_(?<skillId>[^.]+)\.png/;
function newSkillIconFilename(oldFilename: string): string | null {
  const match = oldFilename.match(skillIconFilenameRegex);
  if (!match?.groups?.skillId) {
    return null;
  }
  return `${match.groups.skillId}.png`;
}

(async () => {
  const avatarFilenameRegex = /(?<internalName>char_\d+_[a-z0-9]+)(?:_(?<eliteLevel>[12])\+?)?\.png/;
  function newOperatorImageFilename(oldFilename: string): string | null {
    const match = oldFilename.match(avatarFilenameRegex);
    if (
      !match?.groups?.internalName ||
      !getOperatorName(match.groups.internalName)
    ) {
      return null;
    }
    const { eliteLevel } = match.groups;
    const operatorName = getOperatorName(match.groups.internalName);
    const newFilename = slugify(
      eliteLevel
        ? `${operatorName} elite ${eliteLevel}.png`
        : `${operatorName}.png`
    );
    return newFilename;
  }

  const operatorImageTask = {
    sourceDir: path.join(ACESHIP_BASEDIR, "img", "avatars"),
    destinationDir: path.join(OUTDIR, "operators"),
    renameFn: newOperatorImageFilename,
  };
  const skillIconTask = {
    sourceDir: path.join(ACESHIP_BASEDIR, "img", "skills"),
    destinationDir: path.join(OUTDIR, "skills"),
    renameFn: newSkillIconFilename,
  };

  await Promise.all([
    fs.mkdir(path.join(OUTDIR, "operators"), { recursive: true }),
    fs.mkdir(path.join(OUTDIR, "skills"), { recursive: true }),
  ]);

  const tasks = [operatorImageTask, skillIconTask].map(async (task) => {
    const files = await fs.readdir(task.sourceDir);
    return Promise.all(
      files.map(async (filename) => {
        const newFilename = task.renameFn(filename);
        if (newFilename) {
          // use readFile, writeFile instead of copyFile to guarantee byte-by-byte equality
          // (otherwise git will think files will change on every script run)
          const buf = await fs.readFile(path.join(task.sourceDir, filename));
          fs.writeFile(path.join(task.destinationDir, newFilename), buf);
        }
      })
    );
  });
  await Promise.all(tasks);
})();
