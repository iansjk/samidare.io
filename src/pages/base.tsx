/* eslint-disable react/no-array-index-key */
import React from "react";
import SwipeableViews from "react-swipeable-views";
import BaseComponent, { Rotation } from "../components/base/Base";
import rotationsJson from "./rotations.json";

const containerStyle = {
  display: "grid",
  gridAutoFlow: "column",
  gridAutoColumns: "100%",
};

const Base: React.FC = () => {
  return (
    <SwipeableViews enableMouseEvents containerStyle={containerStyle}>
      {rotationsJson.rotations.map((rotation, i) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <BaseComponent key={i} {...(rotation as Rotation)} />
      ))}
    </SwipeableViews>
  );
};
export default Base;
