import React from "react";
import {
  Box,
  createStyles,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import colors from "./colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    facilityRibbon: {
      flexShrink: 0,
      width: theme.spacing(2),
    },
    facilityInfo: {
      flexGrow: 1,
      padding: theme.spacing(1),
    },
  })
);

const LevelIndicator: React.FC<{ color: string }> = (props) => {
  const { color } = props;

  return (
    <Box mr="1px">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="26"
        viewBox="0 0 11 26.4"
      >
        <path d="M5.5 0.7 0.5 5.7v15l5 5 5-5V5.7Z" style={{ fill: color }} />
      </svg>
    </Box>
  );
};

interface Props {
  level: number;
  name: "Factory" | "Power Plant" | "Trading Post";
}
const Building: React.FC<Props> = (props) => {
  const { level, name } = props;
  const classes = useStyles();

  return (
    <Box whiteSpace="nowrap" display="flex" mb={1} position="relative">
      <Paper
        elevation={3}
        className={classes.facilityRibbon}
        style={{ backgroundColor: colors[name].main }}
      />
      <Paper elevation={3} className={classes.facilityInfo}>
        <Box display="flex">
          <Box mr={0.5}>
            <Typography variant="subtitle1">{name}</Typography>
          </Box>
          {Array(level)
            .fill(0)
            .map((_, i) => (
              <LevelIndicator key={i} color={colors[name].main} />
            ))}
        </Box>
      </Paper>
    </Box>
  );
};
export default Building;
