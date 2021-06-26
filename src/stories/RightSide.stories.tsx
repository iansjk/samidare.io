/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Story, Meta } from "@storybook/react";
import ReceptionRoomComponent from "../components/base/ReceptionRoom";
import OfficeComponent from "../components/base/Office";
import { BuildingProps } from "../components/base/Building";

export default {
  title: "Base/Right Side",
} as Meta;

const Template: Story<BuildingProps & { type: "office" | "receptionroom" }> = (
  args
) => {
  const { type } = args;
  switch (type) {
    case "office":
      return <OfficeComponent {...args} />;
    case "receptionroom":
      return <ReceptionRoomComponent {...args} />;
    default:
      return <div>Don&apos;t know how to render {type}</div>;
  }
};

export const ReceptionRoom = Template.bind({});
ReceptionRoom.args = {
  type: "receptionroom",
  operators: [
    ["Ch'en", 2],
    ["Projekt Red", 2],
  ],
};

export const Office = Template.bind({});
Office.args = {
  type: "office",
  level: 3,
  operator: ["Orchid", 0],
};
