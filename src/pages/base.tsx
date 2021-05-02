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
} from "../components/base";
import Office from "../components/base/Office";
import ReceptionRoom from "../components/base/ReceptionRoom";

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
            <TradingPost level={3} />
            <TradingPost level={3} />
            <Factory level={3} />
            <Factory level={2} />
            <Factory level={2} />
            <Factory level={2} />
            <Factory level={2} />
            <PowerPlant level={3} />
            <PowerPlant level={3} />
          </Grid>
          <Grid item justify="center" xs={4}>
            <CommandCenter level={5} />
            <Dorm level={2} />
            <Dorm level={1} />
            <Dorm level={1} />
            <Dorm level={1} />
          </Grid>
          <Grid item justify="center" xs={4}>
            <ReceptionRoom level={3} />
            <Office level={3} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default Base;
