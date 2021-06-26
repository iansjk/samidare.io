import React from "react";
import Building, { MultiSlotBuildingProps } from "./Building";
import colors from "./colors";

const Factory: React.FC<MultiSlotBuildingProps> = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Building name="Factory" color={colors.factory.main} {...props} />
);
export default Factory;
