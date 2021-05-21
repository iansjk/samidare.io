import React from "react";
import {
  eliteLmdCost,
  expCostByElite,
  lmdCostByElite,
  maxLevelByRarity,
} from "../data/leveling.json";

interface LevelingCost {
  xp: number;
  lmd: number;
  levelingLmd: number;
  eliteLmd: number;
}

function levelingCost(
  startingElite: number,
  startingLevel: number,
  targetElite: number,
  targetLevel: number
): LevelingCost {}

const Leveling: React.FC = () => {
  return <></>;
};
export default Leveling;
