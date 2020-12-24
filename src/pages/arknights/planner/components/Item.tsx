import { Box, makeStyles } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";
import slugify from "../../../../utils/slugify";

const useStyles = makeStyles({
  itemBackground: {
    position: "relative",
    margin: "auto",
  },
  itemImage: {
    objectFit: "contain",
  },
  overlay: {
    display: "flex",
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

interface ItemProps {
  name: string;
  size: number;
  complete?: boolean;
}

const Item = React.memo(function Item({
  name,
  size,
  complete = false,
}: ItemProps): React.ReactElement {
  const classes = useStyles();
  const backgroundSize = Math.floor(size * (95 / 100));
  const itemBackgroundStyle = {
    backgroundImage:
      backgroundSize < 40
        ? ""
        : `url(${process.env.PUBLIC_URL}/images/item-bgs/tier${MATERIALS[name].tier}.png)`,
    opacity: complete ? 0.3 : 1,
    width: backgroundSize,
    height: backgroundSize,
    backgroundSize: `${backgroundSize}px ${backgroundSize}px`,
  };

  return (
    <Box position="relative">
      <div className={classes.itemBackground} style={itemBackgroundStyle}>
        <img
          className={classes.itemImage}
          style={{
            width: size,
            height: size,
          }}
          src={`${process.env.PUBLIC_URL}/images/items/${slugify(name, {
            lower: true,
          })}.png`}
          alt={name}
          title={name}
        />
      </div>
      {complete && (
        <Box
          data-testid="complete"
          className={classes.overlay}
          top="0"
          zIndex="1"
        >
          <CheckCircleIcon htmlColor="greenyellow" fontSize="large" />
        </Box>
      )}
    </Box>
  );
});
export default Item;
