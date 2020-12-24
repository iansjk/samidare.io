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

interface OperatorSkill {
  slot: number;
  skillId: string;
  iconId: string | null;
  skillName: string;
  masteries: OperatorMasteryGoal[];
}

enum OperatorGoalCategory {
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
