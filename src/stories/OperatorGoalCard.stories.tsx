import React from "react";
import { Story, Meta } from "@storybook/react";
import { Grid } from "@material-ui/core";
import OperatorGoalCard, {
  OperatorGoalCardProps,
} from "../components/OperatorGoalCard";
import { OperatorGoalCategory } from "../types";

export default {
  title: "Planner/OperatorGoalCard",
  component: OperatorGoalCard,
} as Meta;

const Template: Story<OperatorGoalCardProps> = (args) => (
  <Grid item xs={12} md={5}>
    <OperatorGoalCard {...args} />
  </Grid>
);

export const OperatorGoalCardDefault = Template.bind({});
OperatorGoalCardDefault.args = {
  goal: {
    operatorName: "Skadi the Corrupting Heart",
    eliteLevel: 2,
    goalCategory: 0,
    goalName: "Elite 2",
    ingredients: [
      { name: "LMD", tier: 4, quantity: 180000 },
      { name: "Supporter Dualchip", tier: 5, quantity: 4 },
      { name: "Polymerization Preparation", tier: 5, quantity: 4 },
      { name: "Grindstone Pentahydrate", tier: 4, quantity: 5 },
    ],
  },
  onDelete: () => alert("onDelete called"),
};
