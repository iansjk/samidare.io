import React from "react";
import Building, { MultiSlotBuildingProps } from "./Building";

const ReceptionRoom: React.FC<MultiSlotBuildingProps> = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Building name="Reception Room" slots={2} {...props} />
);
export default ReceptionRoom;
