import React from "react";
import Building from "./Building";
import colors from "./colors";

const PowerPlant: React.FC<{ level: number; operator?: string }> = ({
  level,
  operator,
}) => (
  <Building
    name="Power Plant"
    level={level}
    color={colors.powerPlant.main}
    slots={1}
    operators={operator ? [operator] : undefined}
  />
);
export default PowerPlant;
