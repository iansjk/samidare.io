import React from "react";
import Building, { BuildingProps } from "./Building";
import colors from "./colors";

const Factory: React.FC<BuildingProps> = (props) => (
  <Building name="Factory" color={colors.factory.main} {...props} />
);
export default Factory;
