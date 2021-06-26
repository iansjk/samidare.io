/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Story, Meta } from "@storybook/react";
import FactoryComponent from "../components/base/Factory";
import TradingPostComponent from "../components/base/TradingPost";
import PowerPlantComponent from "../components/base/PowerPlant";
import { BuildingProps } from "../components/base/Building";

export default {
  title: "Base/Left Side",
  component: FactoryComponent,
} as Meta;

const Template: Story<
  BuildingProps & { type: "factory" | "tradingpost" | "powerplant" }
> = (args) => {
  const { type } = args;
  switch (type) {
    case "factory":
      return <FactoryComponent {...args} />;
    case "tradingpost":
      return <TradingPostComponent {...args} />;
    case "powerplant":
      return <PowerPlantComponent {...args} />;
    default:
      return <div>Don&apos;t know how to render {type}</div>;
  }
};

export const Factory = Template.bind({});
Factory.args = {
  type: "factory",
  level: 3,
  operators: [
    ["Vermeil", 1],
    ["Ceobe", 2],
    ["Scene", 2],
  ],
};

export const TradingPost = Template.bind({});
TradingPost.args = {
  type: "tradingpost",
  level: 3,
  operators: [
    ["Jaye", 0],
    ["Texas", 2],
    ["Lappland", 2],
  ],
};

export const PowerPlant = Template.bind({});
PowerPlant.args = {
  type: "powerplant",
  level: 3,
  operator: ["Greyy", 0],
};
