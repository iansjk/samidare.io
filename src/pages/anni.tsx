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
  },
  {
    number: 2,
    name: "Lungmen Outskirts",
  },
  {
    number: 3,
    name: "Lungmen Downtown",
  },
  {
    number: 5,
    name: "Frozen Abandoned City",
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
