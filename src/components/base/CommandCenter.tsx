import React from "react";
import Building, { BuildingProps } from "./Building";

const CommandCenter: React.FC<BuildingProps> = (props) => (
  <Building name="Command Center" {...props} />
);
export default CommandCenter;
