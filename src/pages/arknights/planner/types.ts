export interface Item {
  name: string;
  tier: number;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  name: string;
  tier: number;
  quantity: number;
}

interface Operator {
  name: string;
  rarity: number;
  isCnOnly: boolean;
  elite: OperatorEliteGoal[];
  skillLevels: OperatorSkillLevelGoal[];
  skills: OperatorSkill;
}

export interface OperatorSkill {
  slot: number;
  skillId: string;
  iconId: string | null;
  skillName: string;
  masteries: OperatorMasteryGoal[];
}

export enum OperatorGoalCategory {
  "Elite" = 0,
  "Mastery",
  "Skill Level",
}

export interface OperatorGoal {
  goalName: string;
  goalShortName: string;
  goalCategory: OperatorGoalCategory;
  ingredients: Ingredient[];
}

export type OperatorEliteGoal = OperatorGoal & {
  eliteLevel: number;
};

export type OperatorSkillLevelGoal = OperatorGoal & {
  skillLevel: number;
};

export type OperatorMasteryGoal = OperatorGoal & {
  masteryLevel: number;
};

export function isEliteGoal(goal: OperatorGoal): goal is OperatorEliteGoal {
  return (
    Object.prototype.hasOwnProperty.call(goal, "eliteLevel") &&
    goal.goalCategory === OperatorGoalCategory.Elite
  );
}

export function isMasteryGoal(goal: OperatorGoal): goal is OperatorMasteryGoal {
  return (
    Object.prototype.hasOwnProperty.call(goal, "masteryLevel") &&
    goal.goalCategory === OperatorGoalCategory.Mastery
  );
}

export function isSkillLevelGoal(
  goal: OperatorGoal
): goal is OperatorSkillLevelGoal {
  return (
    Object.prototype.hasOwnProperty.call(goal, "skillLevel") &&
    goal.goalCategory === OperatorGoalCategory["Skill Level"]
  );
}
