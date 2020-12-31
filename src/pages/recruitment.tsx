import React, { useState } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Box, Button, Divider } from "@material-ui/core";
import { Combination } from "js-combinatorics";

const tagsByCategory = {
  rarity: ["Top Operator", "Senior Operator", "Robot", "Starter"],
  position: ["Melee", "Ranged"],
  classes: [
    "Guard",
    "Sniper",
    "Defender",
    "Medic",
    "Supporter",
    "Caster",
    "Specialist",
    "Vanguard",
  ],
  other: [
    "Crowd-Control",
    "Nuker",
    "Healing",
    "Support",
    "DP-Recovery",
    "DPS",
    "Survival",
    "AoE",
    "Defense",
    "Slow",
    "Debuff",
    "Fast-Redeploy",
    "Shift",
    "Summon",
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
          .length === tagCombination.length
      ) {
        matchingOperators[tagCombination.join(",")] = [
          ...(matchingOperators[tagCombination.join(",")] || []),
          recruitmentData,
        ];
      }
    });
  });

  function handleTagToggle(tag: string) {
    if (!activeTags.find((existingTag) => existingTag === tag)) {
      setActiveTags([...activeTags, tag]);
    } else {
      setActiveTags(activeTags.filter((existingTag) => existingTag !== tag));
    }
  }

  return (
    <>
      {Object.entries(tagsByCategory).map(([category, tagnames]) => (
        <Box mb={2}>
          <h3>{category}</h3>
          <div>
            {tagnames.map((tag: string) => {
              const active =
                activeTags.find((existingTag) => existingTag === tag) != null;
              return (
                <Box clone mr={1} mb={1} key={tag}>
                  <Button
                    color="primary"
                    onClick={() => handleTagToggle(tag)}
                    variant={active ? "contained" : "outlined"}
                    disabled={activeTags.length === 5 && !active}
                  >
                    {tag}
                  </Button>
                </Box>
              );
            })}
          </div>
        </Box>
      ))}
      <Divider />
      <dl>
        {Object.entries(matchingOperators).map(([tagSet, recruitments]) => (
          <>
            <dt>{tagSet}</dt>
            <dd>{recruitments.map((r) => r.name).join(", ")}</dd>
          </>
        ))}
      </dl>
    </>
  );
}
export default Recruitment;