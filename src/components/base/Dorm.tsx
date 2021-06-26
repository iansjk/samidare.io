import React from "react";
import Building, { MultiSlotBuildingProps } from "./Building";

const Dorm: React.FC<MultiSlotBuildingProps> = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Building name="Dormitory" slots={5} {...props} />
);
export default Dorm;
