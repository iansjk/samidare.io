import React from "react";
import Building from "./Building";
import colors from "./colors";

const TradingPost: React.FC<{ level: number }> = ({ level }) => (
  <Building name="Trading Post" level={level} color={colors.tradingPost.main} />
);
export default TradingPost;
