/* eslint-disable react/no-array-index-key */
import Grid from "@material-ui/core/Grid";
import React from "react";
import {
  TradingPost,
  Factory,
  PowerPlant,
  CommandCenter,
  Dorm,
  ReceptionRoom,
  Office,
} from ".";
import { BuildingOperator } from "./Building";

export interface Rotation {
  tradingPosts: BuildingOperator[][];
  factories: BuildingOperator[][];
  powerPlants: BuildingOperator[];
  commandCenter: BuildingOperator[];
  dorms: BuildingOperator[][];
  receptionRoom: BuildingOperator[];
  office: BuildingOperator;
}

const Base: React.FC<Rotation> = (props) => {
  const {
    tradingPosts,
    factories,
    powerPlants,
    commandCenter,
    dorms,
    receptionRoom,
    office,
  } = props;
  return (
    <Grid container>
      <Grid item xs={4}>
        {tradingPosts.map((tradingPost, j) => (
          <TradingPost
            key={j}
            level={tradingPost.length}
            operators={tradingPost}
          />
        ))}
        {factories.map((factory, j) => (
          <Factory key={j} level={factory.length} operators={factory} />
        ))}
        {powerPlants.map((powerPlant, j) => (
          <PowerPlant key={j} level={3} operator={powerPlant} />
        ))}
      </Grid>
      <Grid item xs={4}>
        <CommandCenter level={5} operators={commandCenter} />
        {dorms.map((dorm, j) => (
          <Dorm key={j} level={j === 0 ? 2 : 1} operators={dorm} />
        ))}
      </Grid>
      <Grid item xs={4}>
        <ReceptionRoom level={3} operators={receptionRoom} />
        <Office level={3} operator={office} />
      </Grid>
    </Grid>
  );
};
export default Base;
