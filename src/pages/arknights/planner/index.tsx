import {
  Box,
  Button,
  Grid,
  TextField,
  makeStyles,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  ListSubheader,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useState } from "react";
import { useStaticQuery, graphql } from "gatsby";
import useLocalStorage from "../../../hooks/useLocalStorage";
import GoalOverview from "../../../components/GoalOverview";
import OperatorGoalIconography from "../../../components/OperatorGoalIconography";
import {
  isEliteGoal,
  isMasteryGoal,
  Operator,
  OperatorSkill,
  OperatorGoal,
  Goal,
} from "../../../types";

function Planner(): React.ReactElement {
  const data = useStaticQuery(
    graphql`
      query {
        allOperatorsJson(sort: { fields: name, order: ASC }) {
          nodes {
            name
            rarity
            elite {
              eliteLevel
              goalCategory
              goalName
              ingredients {
                name
                tier
                quantity
              }
            }
            skillLevels {
              goalCategory
              goalName
              goalShortName
              skillLevel
              ingredients {
                name
                tier
                quantity
              }
            }
            skills {
              iconId
              masteries {
                goalCategory
                goalName
                goalShortName
                ingredients {
                  name
                  tier
                  quantity
                }
                masteryLevel
              }
              skillId
              skillName
              slot
            }
          }
        }
      }
    `
  );
  const operators: Operator[] = data.allOperatorsJson.nodes;
  const [operatorName, setOperatorName] = useState<string | null>(null);
  const [goalNames, setGoalNames] = useState<string[]>([] as string[]);
  const [operatorGoals, setOperatorGoals] = useLocalStorage<OperatorGoal[]>(
    "operatorGoals",
    []
  );
  const operator = operators.find((op) => op.name === operatorName);
  const goalSelectMenuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom" as const,
      horizontal: "left" as const,
    },
    transformOrigin: {
      vertical: "top" as const,
      horizontal: "left" as const,
    },
  };

  const handleAddGoals = () => {
    setOperatorGoals((prevOperatorGoals) => {
      const goalNamesSet = new Set(goalNames);
      const masteries =
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        operator!.rarity <= 3
          ? []
          : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            operator!.skills.flatMap((skill) => skill.masteries);
      const goalsToAdd = [
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...operator!.elite,
        ...masteries,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...operator!.skillLevels,
      ].filter((goal) => goalNamesSet.has(goal.goalName));
      const deduplicated = Object.fromEntries([
        ...prevOperatorGoals.map((opGoal) => [
          `${opGoal.operatorName}${opGoal.goalName}`,
          opGoal,
        ]),
        ...goalsToAdd.map((goal) => {
          const key = `${operatorName}${goal.goalName}`;
          const goalObject = { operatorName, ...goal };
          if (isMasteryGoal(goal)) {
            const slot = parseInt(goal.goalShortName.charAt(1), 10); // FIXME hacky
            return [
              key,
              Object.assign(goalObject, {
                skill: operator?.skills.find((skill) => skill.slot === slot),
              }),
            ];
          }
          return [key, goalObject];
        }),
      ]);
      return Object.values(deduplicated);
    });
    setGoalNames([]);
  };

  const handleGoalDeleted = (toDelete: OperatorGoal) => {
    setOperatorGoals((prevOperatorGoals) =>
      prevOperatorGoals.filter(
        (opGoal) =>
          !(
            opGoal.goalName === toDelete.goalName &&
            opGoal.operatorName === toDelete.operatorName
          )
      )
    );
  };

  const handleClearAllGoals = () => {
    setOperatorGoals([]);
  };

  const handleGoalsChanged = (e) => {
    setGoalNames((e.target.value as string[]).filter((name) => !!name));
  };

  const handleOperatorNameChanged = (_: unknown, value: string | null) => {
    setOperatorName(value);
    setGoalNames([]);
  };

  const renderGoalMenuItem = (goal: Goal, skill?: OperatorSkill) => {
    let child: React.ReactElement | null = null;
    if (isEliteGoal(goal)) {
      child = (
        <OperatorGoalIconography
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          goal={{ ...goal, operatorName: operatorName! }}
        />
      );
    } else if (isMasteryGoal(goal)) {
      child = (
        <OperatorGoalIconography
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          goal={{ ...goal, operatorName: operatorName! }}
          skill={skill}
        />
      );
    }
    return (
      <MenuItem key={goal.goalName} value={goal.goalName}>
        {child}
        {goal.goalName}
      </MenuItem>
    );
  };

  const renderGoalSelectOptions = () => {
    if (!operatorName) {
      return <MenuItem>Please select an operator first.</MenuItem>;
    }

    const elite = [
      <ListSubheader key="elite">Elite Levels</ListSubheader>,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...operator!.elite.map((goal) => renderGoalMenuItem(goal)),
    ];
    const masteries =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      operator!.rarity <= 3
        ? []
        : [
            <ListSubheader key="masteries">Masteries</ListSubheader>,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ...operator!.skills.map((skill) =>
              skill.masteries.map((goal) => renderGoalMenuItem(goal, skill))
            ),
          ];
    const skillLevels = [
      <ListSubheader key="skillLevels">Skill Levels</ListSubheader>,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...operator!.skillLevels.map((goal) => renderGoalMenuItem(goal)),
    ];
    return [...elite, ...masteries, ...skillLevels];
  };

  return (
    <Grid component="main" container spacing={2}>
      <Grid item xs={12} lg={3}>
        <Autocomplete
          options={operators.map((op) => op.name)}
          autoComplete
          autoHighlight
          value={operatorName}
          onChange={handleOperatorNameChanged}
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label="Operator name"
              variant="outlined"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} lg={9}>
        <Box display="flex">
          <Box mr={2} flexGrow={1} minWidth={0} width="100%">
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="goal-select">Goals</InputLabel>
              <Select
                id="goal-select"
                autoWidth
                multiple
                displayEmpty
                value={goalNames}
                MenuProps={goalSelectMenuProps}
                renderValue={(selected: unknown) =>
                  (selected as string[])
                    .sort((a, b) => a.localeCompare(b))
                    .join(", ")
                }
                onChange={handleGoalsChanged}
              >
                {renderGoalSelectOptions()}
              </Select>
            </FormControl>
          </Box>
          <Button
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddGoals}
          >
            Add
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <GoalOverview
          goals={operatorGoals}
          onGoalDeleted={handleGoalDeleted}
          onClearAllGoals={handleClearAllGoals}
        />
      </Grid>
    </Grid>
  );
}

export default Planner;
