/* eslint-disable react/no-array-index-key */
import React from "react";
import SwipeableViews from "react-swipeable-views";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  makeStyles,
  Typography,
} from "@material-ui/core";
import FirstPage from "@material-ui/icons/FirstPage";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import BaseComponent, { Rotation } from "../components/base/Base";
import rotationsJson from "./rotations.json";

const containerStyle = {
  display: "grid",
  gridAutoFlow: "column",
  gridAutoColumns: "100%",
};

const useStyles = makeStyles((theme) => ({
  toolbar: {
    margin: theme.spacing(-2, -2, 3, -2),
    background: theme.palette.secondary.main,
    zIndex: 1200,
    color: "#000",
  },
}));

const Base: React.FC = () => {
  const classes = useStyles();
  return (
    <Box ml={2}>
      <SwipeableViews enableMouseEvents containerStyle={containerStyle}>
        {rotationsJson.rotations.map((rotation, i) => (
          <Box clone mr={3}>
            <Card>
              <CardHeader
                title={`${i === 0 ? "Initial Setup" : `${12 * i} hours later`}`}
              />
              <CardContent>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <BaseComponent key={i} {...(rotation as Rotation)} />
              </CardContent>
              <CardActions></CardActions>
            </Card>
          </Box>
        ))}
      </SwipeableViews>
    </Box>
  );
};
export default Base;
