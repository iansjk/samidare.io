/* eslint-disable react/no-array-index-key */
import { makeStyles } from "@material-ui/core";
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
    justifyContent: "center",
    gridTemplateAreas: `
        "L"
        "M"
        "R"
      `,
    rowGap: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      gridTemplateAreas: `
        "L L L L"
        ". M R ."
      `,
      gridTemplateColumns: "1fr max-content max-content 1fr",
      columnGap: theme.spacing(1),
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateAreas: `
      ". . . M ."
      "L L L M R"
      "L L L M R"
      "L L L M ."
      ". . . M ."
    `,
      gridTemplateColumns: "repeat(5, max-content)",
    },
  },
  leftSide: {
    gridArea: "L",
    display: "grid",
    rowGap: theme.spacing(1),
    columnGap: theme.spacing(1),
    justifyContent: "center",
    gridTemplateColumns: "repeat(2, max-content)",
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(3, max-content)",
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(3, max-content)",
      justifySelf: "center",
    },
  },
  middle: {
    gridArea: "M",
    display: "grid",
    gridTemplateRows: "repeat(5, 1fr)",
    rowGap: theme.spacing(1),
  },
  rightSide: {
    gridArea: "R",
    display: "grid",
    rowGap: theme.spacing(1),
    gridTemplateRows: "1fr 1fr",
    [theme.breakpoints.up("sm")]: {
      gridTemplateRows: "repeat(5, 1fr)",
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateRows: "1fr 1fr",
    },
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
    </div>
  );
};
export default Base;
