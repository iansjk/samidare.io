import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Select,
  TextField,
  Typography,
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
      .map(() =>
        Array(7)
          .fill(0)
          .map(() => Array(7).fill(0))
      );
    probabilities[pity][0][0] = 1;
    for (let a = 0; a < pulls; a++) {
      const newProbabilities = Array(99)
        .fill(0)
        .map(() =>
          Array(7)
            .fill(0)
            .map(() => Array(7).fill(0))
        );
      for (let i = 0; i < 99; i++) {
        const sixStarChance = i <= 49 ? 0.02 : 0.02 * (i - 48);
        for (let j = 0; j < 7; j++) {
          if (bannerType !== "event") {
            for (let k = 0; k < 7; k++) {
              newProbabilities[Math.min(i + 1, 98)][j][k] +=
                probabilities[i][j][k] * (1 - sixStarChance);
              newProbabilities[0][j][k] +=
                probabilities[i][j][k] * sixStarChance * (1 - subrate * 2);
              newProbabilities[0][Math.min(j + 1, 6)][k] +=
                probabilities[i][j][k] * sixStarChance * subrate;
              newProbabilities[0][j][Math.min(k + 1, 7)] +=
                probabilities[i][j][k] * sixStarChance * subrate;
            }
          } else {
            newProbabilities[Math.min(i + 1, 98)][j][0] +=
              probabilities[i][j][0] * (1 - sixStarChance);
            newProbabilities[0][j][0] +=
              probabilities[i][j][0] * sixStarChance * (1 - subrate);
            newProbabilities[0][Math.min(j + 1, 6)][0] +=
              probabilities[i][j][0] * sixStarChance * subrate;
          }
        }
      }
      probabilities = newProbabilities;
    }
    const finalOdds = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0));
    for (let i = 0; i < 99; i++) {
      for (let j = 0; j < 7; j++) {
        for (let k = 0; k < 7; k++) {
          finalOdds[j][k] += probabilities[i][j][k];
        }
      }
    }
    return finalOdds;
  }, [pity, pulls, subrate]);

  const toPercentage = (p: number) => {
    const percentage = p * 100;
    if (percentage > 1e-6) {
      return `${sprintf("%.4g", percentage)}%`;
    } else {
      return `${sprintf("%.12f", percentage)}%`;
    }
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
    <Box maxWidth="730px" margin="auto">
      <Grid container direction="column" spacing={2}>
        <Box clone display="flex" justifyContent="space-between">
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
        </Box>
        <Grid item>
          <Box clone pt={2} pr={2} pl={3} pb={3}>
            <Paper elevation={3}>
              <Typography variant="h6" component="h3" gutterBottom>
                Probabilities
              </Typography>
              <Box clone mt={2}>
                <Grid container alignItems="center">
                  {[...Array(7).keys()].map((i) => (
                    <React.Fragment key={i}>
                      <Grid item xs={8}>
                        <Typography variant="body1">
                          Chance of obtaining <strong>{i}</strong> rate-up
                          {i !== 1 && "s"}:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Box clone pl={2}>
                          <Typography variant="h6">
                            {toPercentage(
                              bannerType === "event"
                                ? finalOdds[i][0]
                                : chanceMultiRateups(finalOdds, i)
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </Box>
              <Box clone mt={1} mb={2}>
                <Divider />
              </Box>
              <Grid container alignItems="center">
                <Grid item xs={8}>
                  <Typography variant="body1">
                    Chance of obtaining <strong>at least 1</strong> rate-up:
                  </Typography>
                </Grid>
                <Grid item>
                  <Box clone pl={2}>
                    <Typography variant="h6">
                      {toPercentage(1 - finalOdds[0][0])}
                    </Typography>
                  </Box>
                </Grid>
                {(bannerType === "standard" || bannerType === "limited") && (
                  <>
                    <Grid item xs={8}>
                      <Typography variant="body1">
                        Chance of obtaining <strong>at least 1 of each</strong>{" "}
                        rate-up:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Box clone pl={2}>
                        <Typography variant="h6">
                          {toPercentage(
                            chanceOneOfEach(finalOdds)
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Box>
          <Box mt={3} fontSize="16px">
            <h3>
              <code>finalOdds</code>
            </h3>
            <pre>{JSON.stringify(finalOdds, null, 2)}</pre>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Gacha;

const chanceOneOfEach = (finalOdds: number[][]) => {
  let chance = 0;
  for (let j = 1; j < 7; j++) {
    for (let k = 1; k < 7; k++) {
      chance += finalOdds[j][k];
    }
  }
  return chance;
};

const chanceMultiRateups = (finalOdds: number[][], numRateups: number) => {
  let chance = 0;
  for (let i = 0; i <= numRateups; i++) {
    chance += finalOdds[i][numRateups - i];
  }
  return chance;
};
