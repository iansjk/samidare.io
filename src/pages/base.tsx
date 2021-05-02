import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@material-ui/lab";
import { Grid } from "@material-ui/core";
import {
  PowerPlant,
  TradingPost,
  Factory,
  CommandCenter,
  Dorm,
  Office,
  ReceptionRoom,
} from "../components/base";

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
        <Grid container>
          <Grid item justify="center" xs={4}>
            <TradingPost
              level={3}
              operators={[
                ["Jaye", 0],
                ["Texas", 2],
                ["Lappland", 2],
              ]}
            />
            <TradingPost
              level={3}
              operators={[["Exusiai", 2], "Gummy", "Midnight"]}
            />
            <Factory
              level={3}
              operators={[
                ["Vermeil", 1],
                ["Ceobe", 2],
                ["Scene", 2],
              ]}
            />
            <Factory
              level={2}
              operators={[
                ["Spot", 1],
                ["Gravel", 1],
              ]}
            />
            <Factory
              level={2}
              operators={[
                ["Steward", 1],
                ["Ptilopsis", 2],
              ]}
            />
            <Factory level={2} operators={["Haze", ["Perfumer", 1]]} />
            <Factory
              level={2}
              operators={[
                ["Castle-3", -1],
                ["FEater", 0],
              ]}
            />
            <PowerPlant level={3} operator="Greyy" />
            <PowerPlant level={3} operator={["Shaw", 1]} />
          </Grid>
          <Grid item justify="center" xs={4}>
            <CommandCenter
              level={5}
              operators={["Amiya", "Dobermann", "Scavenger"]}
            />
            <Dorm level={2} />
            <Dorm level={1} />
            <Dorm level={1} />
            <Dorm level={1} />
          </Grid>
          <Grid item justify="center" xs={4}>
            <ReceptionRoom level={3} operators={[["Ch'en", 2], "Gitano"]} />
            <Office level={3} operator={["Orchid", 0]} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default Base;
