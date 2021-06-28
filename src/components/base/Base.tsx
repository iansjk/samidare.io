/* eslint-disable react/no-array-index-key */
import { Box, makeStyles } from "@material-ui/core";
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

const useStyles = makeStyles((theme) => ({
  grid: {
    display: "grid",
    gridTemplateAreas: `
      "spacerL . . . M . spacerR"
      "spacerL L L L M R spacerR"
      "spacerL L L L M R spacerR"
      "spacerL L L L M . spacerR"
      "spacerL . . . M . spacerR"
      "spacerL . . . M . spacerR"
    `,
    gridTemplateColumns:
      "1fr max-content max-content max-content max-content max-content 1fr",
    columnGap: theme.spacing(1),
  },
  leftSide: {
    gridArea: "L",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    rowGap: theme.spacing(1),
    columnGap: theme.spacing(1),
  },
  middle: {
    gridArea: "M",
    display: "grid",
    gridTemplateRows: "repeat(6, 1fr)",
    rowGap: theme.spacing(1),
  },
  rightSide: {
    gridArea: "R",
    display: "grid",
    gridTemplateRows: "1fr 1fr",
    rowGap: theme.spacing(1),
  },
}));

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
  const classes = useStyles();
  return (
    <div className={classes.grid}>
      <Box gridArea="spacerL" />
      <div className={classes.leftSide}>
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
      </div>
      <div className={classes.middle}>
        <CommandCenter level={5} operators={commandCenter} />
        {dorms.map((dorm, j) => (
          <Dorm key={j} level={j === 0 ? 2 : 1} operators={dorm} />
        ))}
      </div>
      <div className={classes.rightSide}>
        <ReceptionRoom level={3} operators={receptionRoom} />
        <Office level={3} operator={office} />
      </div>
      <Box gridArea="spacerR" />
    </div>
  );
};
export default Base;
