import React from "react";
import Building, { BuildingProps } from "./Building";
import colors from "./colors";

const TradingPost: React.FC<BuildingProps> = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Building name="Trading Post" color={colors.tradingPost.main} {...props} />
);
export default TradingPost;
