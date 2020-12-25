import { Box, makeStyles } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";
import slugify from "../utils";
import { Item } from "../types";
import tier1 from "../../../../data/arknights/images/tier1.png";
import tier2 from "../../../../data/arknights/images/tier2.png";
import tier3 from "../../../../data/arknights/images/tier3.png";
import tier4 from "../../../../data/arknights/images/tier4.png";
import tier5 from "../../../../data/arknights/images/tier5.png";

function itemBackgroundImage(tier: number) {
  if (tier === 1) {
    return tier1;
  }
  if (tier === 2) {
    return tier2;
  }
  if (tier === 3) {
    return tier3;
  }
  if (tier === 4) {
    return tier4;
  }
  if (tier === 5) {
    return tier5;
  }
  return "";
}

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

interface ItemBaseProps {
  size: number;
  complete?: boolean;
}
type Props = ItemBaseProps & Item;

const ItemBase = React.memo(function ItemBase({
  name,
  tier,
  size,
  complete = false,
}: Props): React.ReactElement {
  const classes = useStyles();
  const backgroundSize = Math.floor(size * (95 / 100));
  const itemBackgroundStyle = {
    backgroundImage:
      backgroundSize < 40 ? "" : `url(${itemBackgroundImage(tier)})`,
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
          src={`/arknights/images/items/${slugify(name)}.png`}
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
export default ItemBase;
