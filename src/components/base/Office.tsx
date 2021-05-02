import React from "react";
import Building from "./Building";

const Office: React.FC<{ level: number }> = ({ level }) => (
  <Building name="Office" level={level} slots={1} />
);
export default Office;
