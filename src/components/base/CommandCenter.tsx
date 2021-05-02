import React from "react";
import Building from "./Building";

const CommandCenter: React.FC<{ level: number }> = ({ level }) => (
  <Building name="Command Center" level={level} />
);
export default CommandCenter;
