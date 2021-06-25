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
import BaseComponent, { Rotation } from "../components/base/Base";
import rotationsJson from "./rotations.json";

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
            // eslint-disable-next-line react/jsx-props-no-spreading
            <BaseComponent key={i} {...(rotation as Rotation)} />
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};
export default Base;
