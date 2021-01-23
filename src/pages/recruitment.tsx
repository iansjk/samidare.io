import React, { useState } from "react";
import { useStaticQuery, graphql } from "gatsby";
import {
  Box,
  Chip,
  Grid,
  makeStyles,
  TextField,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Combination } from "js-combinatorics";
import Autocomplete from "@material-ui/lab/Autocomplete";
import RecruitableOperatorChip, {
  RecruitableOperator,
} from "../components/RecruitableOperatorChip";

const tagsByCategory = {
  rarity: ["Top Operator", "Senior Operator", "Starter", "Robot"],
  position: ["Melee", "Ranged"],
  classes: [
    "Caster",
    "Defender",
    "Guard",
    "Medic",
    "Sniper",
    "Specialist",
    "Supporter",
    "Vanguard",
  ],
  other: [
    "AoE",
    "Crowd-Control",
    "DP-Recovery",
    "DPS",
    "Debuff",
    "Defense",
    "Fast-Redeploy",
    "Healing",
    "Nuker",
    "Shift",
    "Slow",
    "Summon",
    "Support",
    "Survival",
  ],
};

function getTagCombinations(activeTags: string[]) {
  if (activeTags.length === 0) {
    return [];
  }
  const range = Array(activeTags.length)
    .fill(0)
    .map((_, i) => i + 1);
  return range.flatMap((k) => [...new Combination<string>(activeTags, k)]);
}

const useStyles = makeStyles((theme) => ({
  chipContainer: {
    gap: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  recruitmentResult: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    "& ~ &": {
      borderTop: "1px solid #4d4d4d",
      paddingTop: theme.spacing(2),
    },
  },
}));

function Recruitment(): React.ReactElement {
  const data = useStaticQuery(graphql`
    query {
      allRecruitmentJson(sort: { order: DESC, fields: rarity }) {
        nodes {
          name
          rarity
          tags
        }
      }
    }
  `);
  const recruitableOperators: RecruitableOperator[] =
    data.allRecruitmentJson.nodes;
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const tagCombinations = getTagCombinations(activeTags);
  const matchingOperators: Record<string, RecruitableOperator[]> = {};
  recruitableOperators.forEach((recruitmentData) => {
    tagCombinations.forEach((tagCombination) => {
      if (
        tagCombination.filter((tag) => recruitmentData.tags.includes(tag))
          .length === tagCombination.length &&
        (recruitmentData.rarity < 6 || tagCombination.includes("Top Operator"))
      ) {
        matchingOperators[tagCombination.join(",")] = [
          ...(matchingOperators[tagCombination.join(",")] || []),
          recruitmentData,
        ];
      }
    });
  });
  const classes = useStyles();
  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  function handleTagsChanged(_: unknown, value: string[]) {
    if (value.length <= 5) {
      setActiveTags(value);
    }
  }

  return (
    <>
      <Autocomplete
        options={Object.values(tagsByCategory).flat()}
        multiple
        autoHighlight
        disableCloseOnSelect
        renderInput={(params) => (
          <TextField
            {...params}
            autoFocus
            label="Available recruitment tags"
            variant="outlined"
          />
        )}
        value={activeTags}
        onChange={handleTagsChanged}
      />
      {Object.entries(matchingOperators)
        .sort(
          ([tagSetA, opSetA], [tagSetB, opSetB]) =>
            Math.min(...opSetB.map((op) => (op.rarity === 1 ? 4 : op.rarity))) -
              Math.min(
                ...opSetA.map((op) => (op.rarity === 1 ? 4 : op.rarity))
              ) || tagSetB.split(",").length - tagSetA.split(",").length
        )
        .map(([tagSet, recruitments]) => (
          <>
            <Grid container className={classes.recruitmentResult} spacing={2}>
              <Box
                clone
                justifyContent={isXSmallScreen ? "center" : "flex-end"}
              >
                <Grid item xs={12} sm={3} className={classes.chipContainer}>
                  {tagSet.split(",").map((tag) => (
                    <Chip key={tag} label={tag} />
                  ))}
                </Grid>
              </Box>
              <Grid item xs={12} sm={9} className={classes.chipContainer}>
                {recruitments.map(({ name, rarity, tags }) => (
                  <RecruitableOperatorChip {...{ name, rarity, tags }} />
                ))}
              </Grid>
            </Grid>
          </>
        ))}
    </>
  );
}
export default Recruitment;
