import React from "react";
import Building from "./Building";
import colors from "./colors";

const Factory: React.FC<{ level: number }> = ({ level }) => (
  <Building name="Factory" level={level} color={colors.factory.main} />
);
export default Factory;
