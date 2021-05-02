import React from "react";
import Building, { SingleSlotBuildingProps } from "./Building";
import colors from "./colors";

const PowerPlant: React.FC<SingleSlotBuildingProps> = (props) => (
  <Building
    name="Power Plant"
    color={colors.powerPlant.main}
    slots={1}
    {...props}
  />
);
export default PowerPlant;
