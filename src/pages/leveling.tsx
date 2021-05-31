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
  Typography,
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
  eliteInput: {
    marginBottom: theme.spacing(2),
  },
}));

interface LevelingCost {
  exp: number;
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
      const exp = leveling.expCostByElite[elite]
        .slice(eliteStartingLevel - 1, eliteTargetLevel - 1)
        .reduce((a, b) => a + b, 0);
      const levelingLmd = leveling.lmdCostByElite[elite]
        .slice(eliteStartingLevel - 1, eliteTargetLevel - 1)
        .reduce((a, b) => a + b, 0);
      const eliteLmd =
        elite === 0 ? 0 : leveling.eliteLmdCost[rarity - 1][elite - 1];
      return {
        exp,
        lmd: levelingLmd + eliteLmd,
        eliteLmd,
        levelingLmd,
      };
    });
  const initialValue = {
    exp: 0,
    lmd: 0,
    eliteLmd: 0,
    levelingLmd: 0,
  };
  return costsByElite.reduce(
    (a, b) => ({
      exp: a.exp + b.exp,
      lmd: a.lmd + b.lmd,
      eliteLmd: a.eliteLmd + b.eliteLmd,
      levelingLmd: a.levelingLmd + b.levelingLmd,
    }),
    initialValue
  );
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
  const { exp, lmd, levelingLmd, eliteLmd } = operator
    ? levelingCost(
        operator.rarity,
        startingElite,
        startingLevel,
        targetElite,
        targetLevel
      )
    : { exp: 0, lmd: 0, levelingLmd: 0, eliteLmd: 0 };
  const startingLevelHelpText = operator
    ? `Between 1 and ${
        leveling.maxLevelByRarity[operator.rarity][startingElite]
      }`
    : "";
  const targetLevelHelpText = operator
    ? `Between 1 and ${leveling.maxLevelByRarity[operator.rarity][targetElite]}`
    : "";

  const handleChangeStartingElite = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const newStartingElite = parseInt(e.target.value as string, 10);
    setStartingElite(newStartingElite);
    if (targetElite < newStartingElite) {
      setTargetElite(newStartingElite);
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid container item xs={12} md={7}>
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
              <img
                src={
                  operator
                    ? `https://res.cloudinary.com/samidare/image/upload/c_pad,h_100,w_100/v1/${getOperatorImagePublicId(
                        operator.name,
                        startingElite
                      )}`
                    : ""
                }
                alt={operator ? `${operator.name} Elite ${startingElite}` : ""}
                width={100}
                height={100}
              />
            </Box>
            <Box>
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.eliteInput}
              >
                <InputLabel htmlFor="starting-elite">Starting elite</InputLabel>
                <Select
                  disabled={!operator}
                  native
                  value={startingElite}
                  label="Starting elite"
                  onChange={handleChangeStartingElite}
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
                disabled={!operator}
                id="starting-level"
                label="Starting level"
                type="numeric"
                value={startingLevel}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setStartingLevel(parseInt(e.target.value, 10))}
                helperText={startingLevelHelpText}
                variant="outlined"
                fullWidth
              />
            </Box>
          </Paper>
          <TrendingFlatIcon className={classes.arrowIcon} />
          <Paper elevation={3} className={classes.startOrEndWrapper}>
            <Box mr={1} lineHeight={0}>
              <img
                src={
                  operator
                    ? `https://res.cloudinary.com/samidare/image/upload/c_pad,h_100,w_100/v1/${getOperatorImagePublicId(
                        operator.name,
                        targetElite
                      )}`
                    : ""
                }
                alt={operator ? `${operator.name} Elite ${targetElite}` : ""}
                width={100}
                height={100}
              />
            </Box>
            <Box>
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.eliteInput}
              >
                <InputLabel htmlFor="starting-elite">Target elite</InputLabel>
                <Select
                  disabled={!operator}
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
                disabled={!operator}
                id="target-level"
                label="Target level"
                type="numeric"
                value={targetLevel}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setTargetLevel(parseInt(e.target.value, 10))}
                helperText={targetLevelHelpText}
                variant="outlined"
                fullWidth
              />
            </Box>
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="body1" component="span">
              Total <strong>LMD</strong> cost:{" "}
              <span data-cy="lmd" data-lmd={lmd}>
                {lmd.toLocaleString()}
              </span>
            </Typography>
            <br />
            <Typography variant="body1" component="span">
              Total <strong>EXP</strong> cost:{" "}
              <span data-cy="exp" data-exp={exp}>
                {exp.toLocaleString()}
              </span>
            </Typography>
            <Divider />
            <Typography variant="body1" component="span">
              LMD cost for leveling:{" "}
              <span data-cy="levelingLmd" data-levelingLmd={levelingLmd}>
                {levelingLmd.toLocaleString()}
              </span>
            </Typography>
            <br />
            <Typography variant="body1" component="span">
              LMD cost for elite promotions:{" "}
              <span data-cy="eliteLmd" data-eliteLmd={eliteLmd}>
                {eliteLmd.toLocaleString()}
              </span>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
export default Leveling;
