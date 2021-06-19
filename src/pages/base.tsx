/* eslint-disable react/no-array-index-key */
import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@material-ui/lab";
import { Box, Grid } from "@material-ui/core";
import {
  PowerPlant,
  TradingPost,
  Factory,
  CommandCenter,
  Dorm,
  Office,
  ReceptionRoom,
} from "../components/base";
import rotationsJson from "./rotations.json";
import { BuildingOperator } from "../components/base/Building";

const Base: React.FC = () => {
  return (
    <Grid container>
      <Grid item xs={2}>
        <Timeline align="right">
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>0:00</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>12:00</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>24:00</TimelineContent>
          </TimelineItem>
        </Timeline>
      </Grid>
      <Grid item xs={10}>
        <Box>
          {rotationsJson.rotations.map((rotation, i) => (
            <Grid container key={i}>
              <Grid item xs={4}>
                {rotation.tradingPosts.map((tradingPost, j) => (
                  <TradingPost
                    key={j}
                    level={tradingPost.length}
                    operators={tradingPost as BuildingOperator[]}
                  />
                ))}
                {rotation.factories.map((factory, j) => (
                  <Factory
                    key={j}
                    level={factory.length}
                    operators={factory as BuildingOperator[]}
                  />
                ))}
                {rotation.powerPlants.map((powerPlant, j) => (
                  <PowerPlant
                    key={j}
                    level={3}
                    operator={powerPlant as BuildingOperator}
                  />
                ))}
              </Grid>
              <Grid item xs={4}>
                <CommandCenter
                  level={5}
                  operators={rotation.commandCenter as BuildingOperator[]}
                />
                {rotation.dorms.map((dorm, j) => (
                  <Dorm
                    key={j}
                    level={j === 0 ? 2 : 1}
                    operators={dorm as BuildingOperator[]}
                  />
                ))}
              </Grid>
              <Grid item xs={4}>
                <ReceptionRoom
                  level={3}
                  operators={rotation.receptionRoom as BuildingOperator[]}
                />
                <Office
                  level={3}
                  operator={rotation.office as BuildingOperator}
                />
              </Grid>
            </Grid>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};
export default Base;
