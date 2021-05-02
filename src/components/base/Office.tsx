import React from "react";
import Building, { SingleSlotBuildingProps } from "./Building";

const Office: React.FC<SingleSlotBuildingProps> = (props) => (
  <Building name="Office" slots={1} {...props} />
);
export default Office;
