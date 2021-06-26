/* eslint-disable react/destructuring-assignment */
import React from "react";
import {
  Avatar,
  Box,
  createStyles,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { getOperatorImagePublicId } from "../../utils";
import elite1 from "../../data/images/elite1.png";
import elite2 from "../../data/images/elite2.png";

const LEFT_SIDE_BUILDING_NAMES = new Set([
  "Trading Post",
  "Factory",
  "Power Plant",
]);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    facilityRibbon: {
      flexShrink: 0,
      width: theme.spacing(2),
    },
    operatorAvatar: {
      width: 50,
      height: 50,
      border: `1px solid rgba(255, 255, 255, 0.5)`,
    },
    operatorAvatarWrapper: {
      "&:not(:first-child)": {
        marginLeft: -1,
      },
    },
  })
);

const LevelIndicator: React.FC<{ color: string }> = (props) => {
  const { color } = props;

  return (
    <Box clone mr="1px">
      <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 11 26.4">
        <path d="M5.5 0.7 0.5 5.7v15l5 5 5-5V5.7Z" style={{ fill: color }} />
      </svg>
    </Box>
  );
};

export type BuildingOperator = [string, number];
export interface MultiSlotBuildingProps {
  level: number;
  operators?: BuildingOperator[];
}

export interface SingleSlotBuildingProps {
  level: number;
  operator?: BuildingOperator;
}

interface BuildingBaseProps {
  name: string;
  slots?: number;
  color?: string;
}

export type BuildingProps = MultiSlotBuildingProps &
  SingleSlotBuildingProps &
  BuildingBaseProps;

const Building: React.FC<BuildingProps> = (props) => {
  const { level, name, color, operator } = props;
  const slots = props.slots ?? props.level;
  const classes = useStyles();
  const operators = operator ? [operator] : props.operators ?? [];
  operators.length = slots;

  return (
    <Box whiteSpace="nowrap" display="flex" justifyContent="center" m={1}>
      {LEFT_SIDE_BUILDING_NAMES.has(name) && (
        <Paper
          elevation={3}
          className={classes.facilityRibbon}
          style={{ backgroundColor: color }}
        />
      )}
      <Box
        clone
        display="flex"
        flexDirection="column"
        minWidth={156}
        pb={1}
        px={LEFT_SIDE_BUILDING_NAMES.has(name) ? 1 : 1.5}
      >
        <Paper elevation={3}>
          <Box display="flex" alignItems="flex-end">
            <Typography
              variant="subtitle1"
              aria-label={`${name} level ${level}`}
            >
              {name}
            </Typography>
            <Box ml={0.5}>
              {Array(level)
                .fill(0)
                .map((_, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <LevelIndicator key={i} color={color || "#ffffff"} />
                ))}
            </Box>
          </Box>
          <Box display="flex">
            {Array(slots)
              .fill(0)
              .map((_, i) => {
                const operator = operators[i];
                const name =
                  typeof operator === "object" ? operator[0] : operator;
                const eliteLevel =
                  typeof operator === "object" ? operator[1] : undefined;
                const url =
                  name &&
                  `https://res.cloudinary.com/samidare/image/upload/f_auto,q_auto/v1/${getOperatorImagePublicId(
                    name,
                    eliteLevel
                  )}`;
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Box
                    position="relative"
                    key={i}
                    className={classes.operatorAvatarWrapper}
                  >
                    {(eliteLevel === 1 || eliteLevel === 2) && (
                      <Box position="absolute" right={0} bottom={-6} zIndex={1}>
                        <img
                          src={eliteLevel === 1 ? elite1 : elite2}
                          width="20"
                          height="20"
                          alt={`Elite ${eliteLevel}`}
                          style={{
                            filter:
                              "drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black)",
                          }}
                        />
                      </Box>
                    )}
                    <Avatar
                      className={classes.operatorAvatar}
                      variant="square"
                      aria-label={name == null ? "Any Operator" : undefined}
                      alt={name ?? "Any Operator"}
                      src={url}
                    />
                  </Box>
                );
              })}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
export default Building;
