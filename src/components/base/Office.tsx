import React from "react";
import Building from "./Building";

const Office: React.FC<{ level: number; operator?: string }> = ({
  level,
  operator,
}) => (
  <Building
    name="Office"
    level={level}
    slots={1}
    operators={operator ? [operator] : undefined}
  />
);
export default Office;
