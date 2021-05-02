import React from "react";
import Building from "./Building";

const Office: React.FC<{ level: number }> = ({ level }) => (
  <Building name="Office" level={level} />
);
export default Office;
