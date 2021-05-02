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
import { PowerPlant, TradingPost, Factory } from "../components/base";

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
      <Grid item>
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
    </Grid>
  );
};
export default Base;
