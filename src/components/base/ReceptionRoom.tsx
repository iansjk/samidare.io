import React from "react";
import Building, { BuildingProps } from "./Building";

const ReceptionRoom: React.FC<BuildingProps> = (props) => (
  <Building name="Reception Room" slots={2} {...props} />
);
export default ReceptionRoom;
