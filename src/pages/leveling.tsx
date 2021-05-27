import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Paper,
  Select,
  TextField,
} from "@material-ui/core";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import { Autocomplete } from "@material-ui/lab";
import { graphql, useStaticQuery } from "gatsby";
import React, { useState } from "react";
import { Operator } from "../types";
import { getOperatorImagePublicId } from "../utils";
import leveling from "../data/leveling.json";

const useStyles = makeStyles((theme) => ({
  arrowIcon: {
    fontSize: "3rem",
    color: "rgba(255, 255, 255, 0.8)",
    stroke: "black",
    strokeWidth: "0.2px",
    margin: theme.spacing(2),
  },
  startOrEndWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    flexBasis: "100%",
    padding: theme.spacing(2),
  },
}));

interface LevelingCost {
  xp: number;
  lmd: number;
  levelingLmd: number;
  eliteLmd: number;
}

function levelingCost(
  rarity: number,
  startingElite: number,
  startingLevel: number,
  targetElite: number,
  targetLevel: number
): LevelingCost {
  const costsByElite = Array(targetElite - startingElite + 1)
    .fill(0)
    .map((_, elite) => {
      const eliteStartingLevel = elite === startingElite ? startingLevel : 1;
      const eliteTargetLevel =
        elite === targetElite
          ? targetLevel
          : leveling.maxLevelByRarity[rarity - 1][elite];
      const xp = leveling.expCostByElite[elite]
        .slice(eliteStartingLevel - 1, eliteTargetLevel - 1)
        .reduce((a, b) => a + b);
      const levelingLmd = leveling.lmdCostByElite[elite]
        .slice(eliteStartingLevel - 1, eliteTargetLevel - 1)
        .reduce((a, b) => a + b);
      const eliteLmd =
        elite === 0 ? 0 : leveling.eliteLmdCost[rarity - 1][elite - 1];
      return {
        xp,
        lmd: levelingLmd + eliteLmd,
        eliteLmd,
        levelingLmd,
      };
    });
  return costsByElite.reduce((a, b) => ({
    xp: a.xp + b.xp,
    lmd: a.lmd + b.lmd,
    eliteLmd: a.eliteLmd + b.eliteLmd,
    levelingLmd: a.levelingLmd + b.levelingLmd,
  }));
}

const Leveling: React.FC = () => {
  const data = useStaticQuery(
    graphql`
      query {
        allOperatorsJson(sort: { fields: name, order: ASC }) {
          nodes {
            name
            rarity
          }
        }
      }
    `
  );
  const operators: Operator[] = data.allOperatorsJson.nodes;
  const [operatorName, setOperatorName] = useState<string | null>(null);
  const [startingElite, setStartingElite] = useState(0);
  const [startingLevel, setStartingLevel] = useState(1);
  const [targetElite, setTargetElite] = useState(0);
  const [targetLevel, setTargetLevel] = useState(1);
  const classes = useStyles();
  const operator = operators.find((op) => op.name === operatorName);
  const { xp, lmd, levelingLmd, eliteLmd } = operator
    ? levelingCost(
        operator.rarity,
        startingElite,
        startingLevel,
        targetElite,
        targetLevel
      )
    : { xp: 0, lmd: 0, levelingLmd: 0, eliteLmd: 0 };

  return (
    <Grid container spacing={2}>
      <Grid container item xs={12} lg={8}>
        <Autocomplete
          fullWidth
          options={operators.map((op) => op.name)}
          autoComplete
          autoHighlight
          value={operatorName}
          onChange={(_, value) => setOperatorName(value)}
          id="operator-name"
          renderInput={(params) => (
            <TextField
              {...params}
              name="operator-name"
              label="Operator name"
              variant="outlined"
              autoFocus
            />
          )}
        />
        <Box display="flex" alignItems="center" mt={2}>
          <Paper elevation={3} className={classes.startOrEndWrapper}>
            <Box mr={1} lineHeight={0}>
              {operator && (
                <img
                  src={`https://res.cloudinary.com/samidare/image/upload/c_pad,h_125,w_125/f_auto/v1/${getOperatorImagePublicId(
                    operator.name,
                    startingElite
                  )}`}
                  alt={`${operator.name} Elite ${startingElite}`}
                  width={125}
                  height={125}
                />
              )}
            </Box>
            <Box>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="starting-elite">Starting elite</InputLabel>
                <Select
                  native
                  value={startingElite}
                  label="Starting elite"
                  onChange={(e) => {
                    setStartingElite(parseInt(e.target.value as string, 10));
                  }}
                  inputProps={{
                    name: "starting-elite",
                    id: "starting-elite",
                  }}
                >
                  <option value={0}>Elite 0</option>
                  {Array(operator && operator.rarity >= 4 ? 2 : 1)
                    .fill(0)
                    .map((_, i) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <option key={i + 1} value={i + 1}>
                        Elite {i + 1}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <TextField
                id="starting-level"
                label="Starting level"
                type="numeric"
                value={startingLevel}
                onChange={(e) => setStartingLevel(parseInt(e.target.value, 10))}
                helperText="Between x and y"
                variant="outlined"
                fullWidth
              />
            </Box>
          </Paper>
          <TrendingFlatIcon className={classes.arrowIcon} />
          <Paper elevation={3} className={classes.startOrEndWrapper}>
            <Box mr={1} lineHeight={0}>
              {operator && (
                <img
                  src={`https://res.cloudinary.com/samidare/image/upload/c_pad,h_125,w_125/f_auto/v1/${getOperatorImagePublicId(
                    operator.name,
                    targetElite
                  )}`}
                  alt={`${operator.name} Elite ${targetElite}`}
                  width={125}
                  height={125}
                />
              )}
            </Box>
            <Box>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="starting-elite">Ending elite</InputLabel>
                <Select
                  native
                  value={targetElite}
                  label="Target elite"
                  onChange={(e) => {
                    setTargetElite(parseInt(e.target.value as string, 10));
                  }}
                  inputProps={{
                    name: "target-elite",
                    id: "target-elite",
                  }}
                >
                  <option value={0}>Elite 0</option>
                  {Array(operator && operator.rarity >= 4 ? 2 : 1)
                    .fill(0)
                    .map((_, i) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <option key={i + 1} value={i + 1}>
                        Elite {i + 1}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <TextField
                id="target-level"
                label="Target level"
                type="numeric"
                value={targetLevel}
                onChange={(e) => setTargetLevel(parseInt(e.target.value, 10))}
                helperText="Between x and y"
                variant="outlined"
                fullWidth
              />
            </Box>
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={12} lg={4}>
        <Card>
          <CardContent>
            Total LMD cost: {lmd}
            <br />
            Total XP cost: {xp}
            <Divider />
            LMD cost for leveling: {levelingLmd}
            <br />
            LMD cost for elite promotions: {eliteLmd}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
export default Leveling;
