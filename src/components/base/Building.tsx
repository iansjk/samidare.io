/* eslint-disable react/destructuring-assignment */
import React from "react";
import {
  Avatar,
  Box,
  makeStyles,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { getOperatorImagePublicId } from "../../utils";
import elite1 from "../../data/images/elite1.png";
import elite2 from "../../data/images/elite2.png";

const LEFT_SIDE_BUILDING_NAMES = new Set([
  "Trading Post",
  "Factory",
  "Power Plant",
]);

const AVATAR_SIZE = 45;
const minLeftSideBuildingWidth = AVATAR_SIZE * 3 + 4;
const minRightSideBuildingWidth = 152; // magic number, width of the text "Reception Room" with 3 level chevrons

const useStyles = makeStyles({
  operatorAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    border: `1px solid rgba(255, 255, 255, 0.5)`,
  },
  operatorAvatarWrapper: {
    "&:not(:first-child)": {
      marginLeft: -1,
    },
  },
});

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
  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const operators = operator ? [operator] : props.operators ?? [];
  operators.length = slots;
  const ribbonWidth = isXSmallScreen ? theme.spacing(1) : theme.spacing(2);
  const isLeftSide = LEFT_SIDE_BUILDING_NAMES.has(name);

  return (
    <Box whiteSpace="nowrap" display="flex" justifyContent="center">
      {isLeftSide && (
        <Box clone width={ribbonWidth} flexShrink="0">
          <Paper elevation={3} style={{ backgroundColor: color }} />
        </Box>
      )}
      <Box
        clone
        display="flex"
        flexDirection="column"
        minWidth={
          isLeftSide ? minLeftSideBuildingWidth : minRightSideBuildingWidth
        }
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
                const op = operators[i];
                const opName = typeof op === "object" ? op[0] : op;
                const eliteLevel = typeof op === "object" ? op[1] : undefined;
                const url =
                  opName &&
                  `https://res.cloudinary.com/samidare/image/upload/f_auto,q_auto/v1/${getOperatorImagePublicId(
                    opName,
                    eliteLevel
                  )}`;
                return (
                  <Box
                    position="relative"
                    // eslint-disable-next-line react/no-array-index-key
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
                      aria-label={opName == null ? "Any Operator" : undefined}
                      alt={opName ?? "Any Operator"}
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
