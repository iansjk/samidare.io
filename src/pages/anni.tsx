import React, { useState } from "react";
import { FormControl, InputLabel, NativeSelect } from "@material-ui/core";
import baseSlugify from "slugify";
import ValidatedTextField from "../components/ValidatedTextField";

const MIN_ORUNDUM_CAP = 1200;
const MAX_ORUNDUM_CAP = 1800;

const ANNI_STAGES = [
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

const Annihilation: React.FC = () => {
  const [orundum, setOrundum] = useState(0);
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
  return (
    <>
      <div>
        <ValidatedTextField
          defaultValue={orundum}
          label="Orundum obtained"
          type="number"
          helperText={`From 0 to ${orundumCap}`}
          onChange={(e) => setOrundum(parseInt(e.target.value, 10))}
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
            <InputLabel htmlFor={slugify(name)}>{name}</InputLabel>
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
    </>
  );
};
export default Annihilation;
