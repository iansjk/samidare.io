import React from "react";
import Building from "./Building";

const Dorm: React.FC<{ level: number }> = ({ level }) => (
  <Building name="Dormitory" level={level} />
);
export default Dorm;
