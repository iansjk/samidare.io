import React, { useState } from "react";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useStaticQuery, graphql } from "gatsby";
import {
  eliteLmdCost,
  expCostByElite,
  lmdCostByElite,
  maxLevelByRarity,
} from "../data/leveling.json";
import { Operator } from "../types";

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
): LevelingCost {
  return {
    xp: 0,
    lmd: 0,
    levelingLmd: 0,
    eliteLmd: 0,
  };
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
  const operator = operators.find((op) => op.name === operatorName);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Autocomplete
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
            />
          )}
        />
        <Card>
          <CardContent>
            <Typography>Start</Typography>
            Starting elite
            <br />
            Starting level
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography>End</Typography>
            Target elite
            <br />
            Target level
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardContent>
            Total LMD cost:
            <br />
            Total XP cost:
            <br />
            LMD cost for leveling:
            <br />
            LMD cost for elite promotions:
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
export default Leveling;
