/* eslint-disable no-plusplus */
import React, { useMemo, useState } from "react";
import { FormControl, InputLabel, NativeSelect } from "@material-ui/core";
import baseSlugify from "slugify";
import ValidatedTextField from "../components/ValidatedTextField";

const MIN_ORUNDUM_CAP = 1200;
const MAX_ORUNDUM_CAP = 1800;

interface StageReward {
  killCount: number;
  sanityCost: number;
  orundum: number;
}
interface Stage {
  number: number;
  name: string;
  rewards: StageReward[];
}

const ANNI_STAGES: Stage[] = [
  {
    number: 1,
    name: "Chernobog",
    rewards: [
      {
        killCount: 100,
        sanityCost: 6,
        orundum: 55,
      },
      {
        killCount: 200,
        sanityCost: 11,
        orundum: 105,
      },
      {
        killCount: 250,
        sanityCost: 14,
        orundum: 140,
      },
      {
        killCount: 300,
        sanityCost: 16,
        orundum: 165,
      },
      {
        killCount: 325,
        sanityCost: 17,
        orundum: 180,
      },
      {
        killCount: 350,
        sanityCost: 18,
        orundum: 200,
      },
      {
        killCount: 375,
        sanityCost: 19,
        orundum: 225,
      },
      {
        killCount: 400,
        sanityCost: 20,
        orundum: 255,
      },
    ],
  },
  {
    number: 2,
    name: "Lungmen Outskirts",
    rewards: [
      {
        killCount: 100,
        sanityCost: 8,
        orundum: 75,
      },
      {
        killCount: 200,
        sanityCost: 15,
        orundum: 145,
      },
      {
        killCount: 250,
        sanityCost: 18,
        orundum: 185,
      },
      {
        killCount: 300,
        sanityCost: 20,
        orundum: 215,
      },
      {
        killCount: 325,
        sanityCost: 22,
        orundum: 250,
      },
      {
        killCount: 350,
        sanityCost: 23,
        orundum: 270,
      },
      {
        killCount: 375,
        sanityCost: 24,
        orundum: 295,
      },
      {
        killCount: 400,
        sanityCost: 25,
        orundum: 325,
      },
    ],
  },
  {
    number: 3,
    name: "Lungmen Downtown",
    rewards: [
      {
        killCount: 100,
        sanityCost: 8,
        orundum: 78,
      },
      {
        killCount: 200,
        sanityCost: 15,
        orundum: 150,
      },
      {
        killCount: 250,
        sanityCost: 18,
        orundum: 192,
      },
      {
        killCount: 300,
        sanityCost: 20,
        orundum: 224,
      },
      {
        killCount: 325,
        sanityCost: 22,
        orundum: 262,
      },
      {
        killCount: 350,
        sanityCost: 23,
        orundum: 284,
      },
      {
        killCount: 375,
        sanityCost: 24,
        orundum: 312,
      },
      {
        killCount: 400,
        sanityCost: 25,
        orundum: 345,
      },
    ],
  },
  {
    number: 5,
    name: "Frozen Abandoned City",
    rewards: [
      {
        killCount: 100,
        sanityCost: 8,
        orundum: 80,
      },
      {
        killCount: 200,
        sanityCost: 15,
        orundum: 155,
      },
      {
        killCount: 250,
        sanityCost: 18,
        orundum: 200,
      },
      {
        killCount: 300,
        sanityCost: 20,
        orundum: 235,
      },
      {
        killCount: 325,
        sanityCost: 22,
        orundum: 275,
      },
      {
        killCount: 350,
        sanityCost: 23,
        orundum: 300,
      },
      {
        killCount: 375,
        sanityCost: 24,
        orundum: 330,
      },
      {
        killCount: 400,
        sanityCost: 25,
        orundum: 365,
      },
    ],
  },
];
const KILL_THRESHOLDS = [0, 100, 200, 250, 300, 325, 350, 375, 400].reverse();
const initialKillCounts: Record<number, number> = Object.fromEntries(
  ANNI_STAGES.map((stage) => [stage.number, 400])
);
const slugify = (str: string) => baseSlugify(str, { lower: true });

const inNumberRange = (value: string, min: number, max: number): boolean => {
  const intValue = parseInt(value, 10);
  if (Number.isNaN(intValue)) {
    return false;
  }
  return min <= intValue && intValue <= max;
};

const expectedSanityCost = (
  orundumEarned: number,
  orundumCap: number,
  expectedSanityToFinish: number[],
  reward: StageReward
) => {
  let result = reward.sanityCost;
  [-5, 0, 5].forEach((modifier) => {
    let newOrundum = orundumEarned + reward.orundum + modifier;
    newOrundum = Math.min(newOrundum, orundumCap);
    result += expectedSanityToFinish[newOrundum] / 3;
  });
  return result;
};

const bestNextStage = (
  orundumEarned: number,
  orundumCap: number,
  // mapping of anni stage number to max kill count
  killCounts: Record<number, number>
) => {
  const expectedSanityToFinish = Array(orundumCap + 1);
  for (let i = 0; i < expectedSanityToFinish.length; i++) {
    expectedSanityToFinish[i] = Number.MAX_SAFE_INTEGER;
  }
  expectedSanityToFinish[orundumCap] = 0;

  const anniOptions = Object.entries(killCounts).flatMap(
    ([anniNumber, killCount]) => {
      const stage = ANNI_STAGES.find(
        (s) => s.number === parseInt(anniNumber, 10)
      )!;
      return stage.rewards
        .filter((r) => r.killCount <= killCount)
        .map((r) => ({
          number: stage.number,
          name: stage.name,
          ...r,
        }));
    }
  );

  for (let i = orundumCap; i >= 0; i--) {
    for (let j = 0; j < anniOptions.length; j++) {
      expectedSanityToFinish[i] = Math.min(
        expectedSanityToFinish[i],
        expectedSanityCost(
          i,
          orundumCap,
          expectedSanityToFinish,
          anniOptions[j]
        )
      );
    }
  }

  const bestOption = anniOptions.find(
    (option) =>
      expectedSanityCost(
        orundumEarned,
        orundumCap,
        expectedSanityToFinish,
        option
      ) === expectedSanityToFinish[orundumEarned]
  );
  return {
    bestOption,
    expectedSanity: expectedSanityToFinish[orundumEarned],
  };
};

const Annihilation: React.FC = () => {
  const [orundumEarned, setOrundumEarned] = useState(0);
  const [orundumCap, setOrundumCap] = useState(MAX_ORUNDUM_CAP);
  const [killCounts, setKillCounts] = useState(initialKillCounts);

  const handleChangeKillCount = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    const key = e.target.getAttribute("data-anni-stage-number");
    if (key) {
      setKillCounts((oldCounts) => {
        const newCounts = { ...oldCounts };
        newCounts[parseInt(key, 10)] = newValue;
        return newCounts;
      });
    }
  };

  const output = useMemo(
    () => bestNextStage(orundumEarned, orundumCap, killCounts),
    [orundumEarned, orundumCap, killCounts]
  );

  return (
    <>
      <div>
        <ValidatedTextField
          defaultValue={orundumEarned}
          label="Orundum obtained"
          type="number"
          helperText={`From 0 to ${orundumCap}`}
          onChange={(e) => setOrundumEarned(parseInt(e.target.value, 10))}
          validator={(value) => inNumberRange(value, 0, orundumCap)}
          variant="outlined"
        />
        <ValidatedTextField
          defaultValue={orundumCap}
          label="Your orundum cap"
          type="number"
          helperText={`From ${MIN_ORUNDUM_CAP} to ${MAX_ORUNDUM_CAP}`}
          validator={(value) =>
            inNumberRange(value, MIN_ORUNDUM_CAP, MAX_ORUNDUM_CAP)
          }
          onChange={(e) => setOrundumCap(parseInt(e.target.value, 10))}
          variant="outlined"
        />
      </div>
      <div>
        {ANNI_STAGES.map(({ number, name }) => (
          <FormControl key={name} fullWidth>
            <InputLabel htmlFor={slugify(name)}>
              Annihilation {number}: {name}
            </InputLabel>
            <NativeSelect
              value={killCounts[number]}
              onChange={handleChangeKillCount}
              inputProps={
                {
                  id: slugify(name),
                  "data-anni-stage-number": number,
                } as any
              }
            >
              {KILL_THRESHOLDS.map((threshold) => (
                <option key={threshold} value={threshold}>
                  {threshold}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        ))}
      </div>
      <pre>{JSON.stringify(output, null, 2)}</pre>
    </>
  );
};
export default Annihilation;
