import React from "react";
import Building from "./Building";

const ReceptionRoom: React.FC<{ level: number }> = ({ level }) => (
  <Building name="Reception Room" level={level} slots={2} />
);
export default ReceptionRoom;
