import React from "react";
import Building, { MultiSlotBuildingProps } from "./Building";

const CommandCenter: React.FC<MultiSlotBuildingProps> = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Building name="Command Center" {...props} />
);
export default CommandCenter;
