import { makeStyles, Box } from "@material-ui/core";
import React from "react";
import {
  EliteGoal,
  isEliteGoal,
  isMasteryGoal,
  MasteryGoal,
  OperatorGoal,
  OperatorSkill,
} from "../types";
import elite1 from "../data/images/elite1.png";
import elite2 from "../data/images/elite2.png";
import mastery1 from "../data/images/mastery1.png";
import mastery2 from "../data/images/mastery2.png";
import mastery3 from "../data/images/mastery3.png";

const useStyles = makeStyles({
  operatorIcon: {
    width: 30,
  },
});

function eliteImage(goal: EliteGoal) {
  if (goal.eliteLevel === 1) {
    return elite1;
  }
  if (goal.eliteLevel === 2) {
    return elite2;
  }
  return "";
}

function masteryImage(goal: MasteryGoal) {
  if (goal.masteryLevel === 1) {
    return mastery1;
  }
  if (goal.masteryLevel === 2) {
    return mastery2;
  }
  if (goal.masteryLevel === 3) {
    return mastery3;
  }
  return "";
}

interface OperatorGoalIconographyProps {
  goal: OperatorGoal;
  skill?: OperatorSkill;
}

function OperatorGoalIconography(
  props: OperatorGoalIconographyProps
): React.ReactElement {
  const { goal, skill } = props;
  const classes = useStyles();

  if (isEliteGoal(goal)) {
    return (
      <Box clone mr={0.25}>
        <img
          className={classes.operatorIcon}
          src={eliteImage(goal)}
          alt={goal.goalName}
        />
      </Box>
    );
  }
  if (isMasteryGoal(goal)) {
    const iconFilename = skill?.iconId ?? skill?.skillId;
    return (
      <Box mr={0.5}>
        <img
          className={classes.operatorIcon}
          src={`/arknights/images/skills/${iconFilename}.png`}
          alt={skill?.skillName}
        />
        <img
          className={classes.operatorIcon}
          src={masteryImage(goal)}
          alt={`Mastery ${goal.masteryLevel}`}
        />
      </Box>
    );
  }
  return <></>;
}
export default OperatorGoalIconography;
