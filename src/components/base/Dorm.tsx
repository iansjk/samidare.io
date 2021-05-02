import React from "react";
import Building, { BuildingProps } from "./Building";

const Dorm: React.FC<BuildingProps> = (props) => (
  <Building name="Dormitory" slots={5} {...props} />
);
export default Dorm;
