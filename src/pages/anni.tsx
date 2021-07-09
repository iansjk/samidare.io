import React, { useState } from "react";
import ValidatedTextField from "../components/ValidatedTextField";

const STARTING_ORUNDUM_CAP = 1200;
const MAX_ORUNDUM_CAP = 1800;

const inNumberRange = (value: string, min: number, max: number): boolean => {
  const intValue = parseInt(value, 10);
  if (Number.isNaN(intValue)) {
    return false;
  }
  return min <= intValue && intValue <= max;
};

const Annihilation: React.FC = (props) => {
  const [orundum, setOrundum] = useState(0);
  const [orundumCap, setOrundumCap] = useState(MAX_ORUNDUM_CAP);

  return (
    <>
      <ValidatedTextField
        defaultValue={orundum}
        label="Orundum obtained"
        helperText={`From 0 to ${orundumCap}`}
        onChange={(e) => setOrundum(parseInt(e.target.value, 10))}
        validator={(value) => inNumberRange(value, 0, orundumCap)}
        variant="outlined"
      />
      <ValidatedTextField
        defaultValue={orundumCap}
        label="Your orundum cap"
        helperText={`From ${STARTING_ORUNDUM_CAP} to ${MAX_ORUNDUM_CAP}`}
        validator={(value) =>
          inNumberRange(value, STARTING_ORUNDUM_CAP, MAX_ORUNDUM_CAP)
        }
        onChange={(e) => setOrundumCap(parseInt(e.target.value, 10))}
        variant="outlined"
      />
    </>
  );
};
export default Annihilation;
