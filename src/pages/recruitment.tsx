import React, { useState } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Box, Button, Divider, NoSsr, TextField } from "@material-ui/core";
import { Combination } from "js-combinatorics";
import Autocomplete from "@material-ui/lab/Autocomplete";

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

interface RecruitmentData {
  name: string;
  rarity: number;
  tags: string[];
}

function getTagCombinations(activeTags: string[]) {
  if (activeTags.length === 0) {
    return [];
  }
  const range = Array(activeTags.length)
    .fill(0)
    .map((_, i) => i + 1);
  return range.flatMap((k) => [...new Combination<string>(activeTags, k)]);
}

function Recruitment(): React.ReactElement {
  const data = useStaticQuery(graphql`
    query {
      allRecruitmentJson {
        nodes {
          name
          rarity
          tags
        }
      }
    }
  `);
  const recruitableOperators: RecruitmentData[] = data.allRecruitmentJson.nodes;
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const tagCombinations = getTagCombinations(activeTags);
  const matchingOperators: Record<string, RecruitmentData[]> = {};
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
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            label="Available recruitment tags"
            variant="outlined"
          />
        )}
        value={activeTags}
        onChange={handleTagsChanged}
      />
      <Divider />
      <dl>
        <NoSsr>
          {Object.entries(matchingOperators)
            .sort(
              ([tagSetA, _], [tagSetB, __]) =>
                tagSetB.split(",").length - tagSetA.split(",").length
            )
            .map(([tagSet, recruitments]) => (
              <>
                <dt>{tagSet}</dt>
                <dd>{recruitments.map((r) => r.name).join(", ")}</dd>
              </>
            ))}
        </NoSsr>
      </dl>
    </>
  );
}
export default Recruitment;
