import React, { useMemo, useState } from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
} from "@material-ui/core";
import { sprintf } from "sprintf-js";

const Gacha: React.FC = () => {
  const [pulls, setPulls] = useState(0);
  const [pullsHasError, setPullsHasError] = useState(false);
  const [pity, setPity] = useState(0);
  const [pityHasError, setPityHasError] = useState(false);
  const [bannerType, setBannerType] = useState<
    "event" | "standard" | "limited"
  >("event");
  let subrate = 0.5;
  if (bannerType === "standard") {
    subrate = 0.25;
  } else if (bannerType === "limited") {
    subrate = 0.35;
  }

  const finalOdds = useMemo(() => {
    let probabilities = Array(99)
      .fill(0)
      .map(() => Array(7).fill(0));
    probabilities[pity][0] = 1;
    for (let a = 0; a < pulls; a++) {
      const newProbabilities = Array(99)
        .fill(0)
        .map(() => Array(7).fill(0));
      for (let i = 0; i < 99; i++) {
        const sixStarChance = i <= 49 ? 0.02 : 0.02 * (i - 48);
        for (let j = 0; j < 7; j++) {
          newProbabilities[Math.min(i + 1, 98)][j] +=
            probabilities[i][j] * (1 - sixStarChance);
          newProbabilities[0][j] +=
            probabilities[i][j] * sixStarChance * (1 - subrate);
          newProbabilities[0][Math.min(j + 1, 6)] +=
            probabilities[i][j] * sixStarChance * subrate;
        }
      }
      probabilities = newProbabilities;
    }
    const finalOdds = Array(7).fill(0);
    for (let i = 0; i < 99; i++) {
      for (let j = 0; j < 7; j++) {
        finalOdds[j] += probabilities[i][j];
      }
    }
    return finalOdds;
  }, [pity, pulls, subrate]);

  const toPercentage = (p: number) => {
    return `${sprintf("%.4g", p * 100)}%`;
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    e.target.select();

  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    if (e.target.name === "pulls" || e.target.name === "pity") {
      const toInt = parseInt(e.target.value as string, 10);
      if (!Number.isNaN(toInt) && 0 <= toInt) {
        if (e.target.name === "pulls") {
          setPulls(toInt);
          setPullsHasError(false);
        } else {
          setPity(toInt);
          setPityHasError(false);
        }
      } else {
        if (e.target.name === "pulls") {
          setPullsHasError(true);
        } else {
          setPityHasError(true);
        }
      }
    } else if (e.target.name === "banner-type") {
      setBannerType(e.target.value as "event" | "standard" | "limited");
    }
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <TextField
          label="Number of pulls"
          variant="outlined"
          type="number"
          defaultValue="0"
          name="pulls"
          error={pullsHasError}
          onFocus={handleFocus}
          onChange={handleChange}
        />
        <TextField
          label="Initial pity"
          variant="outlined"
          type="number"
          defaultValue="0"
          name="pity"
          error={pityHasError}
          onFocus={handleFocus}
          onChange={handleChange}
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="banner-type">Banner type</InputLabel>
          <Select
            native
            label="Banner type"
            inputProps={{
              name: "banner-type",
              id: "banner-type",
            }}
            onChange={handleChange}
          >
            <option value="event">Event (one rate-up 6⭐️, 50%)</option>
            <option value="standard">
              Standard (two rate-up 6⭐️, each 25%)
            </option>
            <option value="limited">
              Limited (two rate-up 6⭐️, each 35%)
            </option>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <h3>Probabilities</h3>
        <dl>
          {[...Array(7).keys()].map((i) => (
            <React.Fragment key={i}>
              <dt>
                Chance of obtaining {i + 1} rate-up{i >= 1 && "s"}
              </dt>
              <dd>{toPercentage(finalOdds[i])}</dd>
            </React.Fragment>
          ))}
        </dl>
      </Grid>
    </Grid>
  );
};
export default Gacha;
