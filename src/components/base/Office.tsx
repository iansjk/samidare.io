import React from "react";
import Building, { SingleSlotBuildingProps } from "./Building";

const Office: React.FC<SingleSlotBuildingProps> = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Building name="Office" slots={1} {...props} />
);
export default Office;
