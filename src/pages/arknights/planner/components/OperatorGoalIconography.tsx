import { makeStyles, Box } from "@material-ui/core";
import React from "react";
import {
  isEliteGoal,
  isMasteryGoal,
  OperatorGoal,
  OperatorSkill,
} from "../types";

const useStyles = makeStyles({
  operatorIcon: {
    width: 30,
  },
});

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
          src={`${process.env.PUBLIC_URL}/images/icons/elite${goal.eliteLevel}.png`}
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
          src={`${process.env.PUBLIC_URL}/images/skills/${iconFilename}.png`}
          alt={skill?.skillName}
        />
        <img
          className={classes.operatorIcon}
          src={`${process.env.PUBLIC_URL}/images/icons/mastery${goal.masteryLevel}.png`}
          alt={`Mastery ${goal.masteryLevel}`}
        />
      </Box>
    );
  }
  return <></>;
}
export default OperatorGoalIconography;
