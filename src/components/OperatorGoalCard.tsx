import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  makeStyles,
  Typography,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import React from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import ItemStack from "./ItemStack";
import OperatorGoalIconography from "./OperatorGoalIconography";
import {
  EliteGoal,
  isEliteGoal,
  isMasteryGoal,
  MasteryGoal,
  OperatorGoal,
  OperatorSkill,
  SkillLevelGoal,
} from "../types";
import { getOperatorImagePublicId } from "../utils";

const useStyles = makeStyles((theme) => ({
  deleteIconButton: {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    padding: 0,
  },
  goalOuterGridContainer: {
    alignItems: "center",
  },
  goalCard: {
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    paddingLeft: "2rem",
    backgroundPosition: "-40px center",
  },
  goalShortName: {
    lineHeight: theme.typography.h6.lineHeight,
  },
}));

export interface OperatorGoalCardProps {
  goal: OperatorGoal & (EliteGoal | MasteryGoal | SkillLevelGoal);
  skill?: OperatorSkill;
  onDelete: (goal: OperatorGoal) => void;
}

const OperatorGoalCard = React.memo(function OperatorGoalCard(
  props: OperatorGoalCardProps
): React.ReactElement {
  const { goal, skill, onDelete } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  let eliteLevel = 1;
  if (isMasteryGoal(goal)) {
    eliteLevel = 2;
  } else if (isEliteGoal(goal)) {
    eliteLevel = goal.eliteLevel;
  }
  const operatorImageUrl = `https://res.cloudinary.com/samidare/image/upload/e_sharpen/f_auto,q_auto/v1/${getOperatorImagePublicId(
    goal.operatorName,
    eliteLevel
  )}`;
  const goalCardStyle = {
    backgroundImage: `linear-gradient(to right, transparent, ${theme.palette.background.paper} 130px), url("${operatorImageUrl}")`,
  };
  const handleClick = React.useCallback(() => onDelete(goal), [goal, onDelete]);
  const [alter, appellation] = goal.operatorName.split(" the ");
  return (
    <Box mb={1} position="relative">
      <Card className={classes.goalCard} style={goalCardStyle}>
        <CardContent>
          <Grid container className={classes.goalOuterGridContainer}>
            <Grid item xs={12}>
              <Box display="flex">
                <Typography component="h3" variant="h6">
                  {appellation && !isXSmallScreen && (
                    <Typography component="span" variant="overline">
                      {alter} the&nbsp;
                    </Typography>
                  )}
                  {appellation ?? goal.operatorName}
                </Typography>
                <Box
                  whiteSpace="nowrap"
                  alignItems="center"
                  display="flex"
                  marginLeft={1}
                >
                  <OperatorGoalIconography goal={goal} skill={skill} />
                  <Typography
                    className={classes.goalShortName}
                    component="h4"
                    variant="subtitle1"
                  >
                    {goal.goalShortName ?? goal.goalName}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box clone justifyContent="space-evenly">
                <Grid container>
                  {goal.ingredients.map((ingredient) => (
                    <Grid item xs={3} key={ingredient.name}>
                      <ItemStack
                        name={ingredient.name}
                        tier={ingredient.tier}
                        quantity={ingredient.quantity}
                        size={60}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <IconButton
            aria-label="Delete this goal"
            className={classes.deleteIconButton}
            onClick={handleClick}
          >
            <CancelIcon />
          </IconButton>
        </CardContent>
      </Card>
    </Box>
  );
});
export default OperatorGoalCard;
