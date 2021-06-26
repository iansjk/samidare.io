/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Story, Meta } from "@storybook/react";
import DormComponent from "../components/base/Dorm";
import CommandCenterComponent from "../components/base/CommandCenter";
import { BuildingProps } from "../components/base/Building";

export default {
  title: "Base/Middle",
} as Meta;

const Template: Story<BuildingProps & { type: "commandcenter" | "dorm" }> = (
  args
) => {
  const { type } = args;
  switch (type) {
    case "commandcenter":
      return <CommandCenterComponent {...args} />;
    case "dorm":
      return <DormComponent {...args} />;
    default:
      return <div>Don&apos;t know how to render {type}</div>;
  }
};

export const CommandCenter = Template.bind({});
CommandCenter.args = {
  type: "commandcenter",
  level: 5,
  operators: [
    ["Amiya", 2],
    ["Dobermann", 0],
    ["GreyThroat", 0],
    ["Schwarz", 0],
    ["Mountain", 1],
  ],
};

export const Dorm = Template.bind({});
Dorm.args = {
  type: "dorm",
  level: 1,
};
