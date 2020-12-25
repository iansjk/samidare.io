import {
  AppBar,
  Box,
  Button,
  Container,
  createMuiTheme,
  CssBaseline,
  Grid,
  responsiveFontSizes,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  makeStyles,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  ListSubheader,
} from "@material-ui/core";
import { pink, blue } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useState } from "react";
import { useStaticQuery, graphql } from "gatsby";
import useLocalStorage from "./hooks/useLocalStorage";
import GoalOverview from "./components/GoalOverview";
import AppFooter from "./components/AppFooter";
import OperatorGoalIconography from "./components/OperatorGoalIconography";
import {
  isEliteGoal,
  isMasteryGoal,
  Operator,
  OperatorSkill,
  OperatorGoal,
  Goal,
} from "./types";

let appTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: blue[700],
      light: "rgb(104, 179, 255)",
    },
    secondary: {
      main: pink[100],
    },
  },
  overrides: {
    MuiMenuItem: {
      root: {
        "&$selected": {
          "&, &:hover": {
            backgroundColor: blue[700],
          },
        },
      },
    },
    MuiFormLabel: {
      root: {
        "&$focused": {
          color: "white",
        },
      },
    },
    MuiMenu: {
      paper: {
        maxHeight: "65%",
      },
    },
    MuiListSubheader: {
      sticky: {
        position: "static",
      },
    },
  },
});
appTheme = responsiveFontSizes(appTheme);
appTheme.typography.h4.fontSize = "1.55rem";

const useStyles = makeStyles((theme) => ({
  appContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    marginTop: theme.spacing(2),
  },
}));

function Planner(): React.ReactElement {
  const data = useStaticQuery(
    graphql`
      query {
        allOperatorsJson {
          nodes {
            name
            rarity
            elite {
              eliteLevel
              goalCategory
              goalName
              ingredients {
                name
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
  const classes = useStyles();

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

  // FIXME
  const handleAddGoals = () => {};

  const handleGoalDeleted = () => {};

  const handleClearAllGoals = () => {};

  const handleGoalsChanged = () => {};

  const handleOperatorNameChanged = () => {};

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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const operator = operators.find((op) => op.name === operatorName)!;

    const elite = [
      <ListSubheader>Elite Levels</ListSubheader>,
      ...operator.elite.map((goal) => renderGoalMenuItem(goal)),
    ];
    const masteries = [
      <ListSubheader>Masteries</ListSubheader>,
      ...operator.skills.map((skill) =>
        skill.masteries.map((goal) => renderGoalMenuItem(goal, skill))
      ),
    ];
    const skillLevels = [
      <ListSubheader>Skill Levels</ListSubheader>,
      ...operator.skillLevels.map((goal) => renderGoalMenuItem(goal)),
    ];
    return [...elite, ...masteries, ...skillLevels];
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <div className={classes.appContainer}>
        <Container maxWidth="lg">
          <AppBar>
            <Toolbar>
              <Typography component="h1" variant="h4">
                Arknights Materials Checklist
              </Typography>
            </Toolbar>
          </AppBar>
          <Toolbar />
          <Grid component="main" className={classes.main} container spacing={2}>
            <Grid item xs={12} lg={3}>
              <Autocomplete
                options={operators.map((operator) => operator.name).sort()}
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
        </Container>
        <Box flexGrow={1} />
        <AppFooter />
      </div>
    </ThemeProvider>
  );
}

export default Planner;
