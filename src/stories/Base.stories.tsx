import React from "react";
import { Story, Meta } from "@storybook/react";
import BaseComponent, { Rotation } from "../components/base/Base";

export default {
  title: "Base/Base",
  component: BaseComponent,
} as Meta;

const Template: Story<Rotation> = (args) => <BaseComponent {...args} />;

const exampleRotation = {
  tradingPosts: [
    [
      ["Jaye", 0],
      ["Texas", 2],
      ["Lappland", 2],
    ],
    [
      ["Exusiai", 2],
      ["Gummy", 0],
      ["Midnight", 0],
    ],
  ],
  factories: [
    [
      ["Vermeil", 1],
      ["Ceobe", 2],
      ["Scene", 2],
    ],
    [
      ["Spot", 1],
      ["Gravel", 1],
    ],
    [
      ["Steward", 1],
      ["Ptilopsis", 2],
    ],
    [
      ["Haze", 0],
      ["Perfumer", 1],
    ],
    [
      ["Castle-3", -1],
      ["FEater", 0],
    ],
  ],
  powerPlants: [
    ["Greyy", 0],
    ["Shaw", 1],
  ],
  commandCenter: [
    ["Amiya", 0],
    ["Dobermann", 0],
    ["Scavenger", 0],
  ],
  dorms: [[], [], [], []],
  receptionRoom: [
    ["Ch'en", 2],
    ["Gitano", 0],
  ],
  office: ["Orchid", 0],
};

export const Base = Template.bind({});
Base.args = (exampleRotation as unknown) as Rotation;
