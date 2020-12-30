import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  ButtonBase,
  Backdrop,
  Popover,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import GavelIcon from "@material-ui/icons/Gavel";
import React from "react";
import {
  bindPopover,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import slugify from "../utils";
import ItemStack, { defaultSize } from "./ItemStack";
import { Ingredient, Item } from "../types";
import ItemInfoPopoverContent from "./ItemInfoPopoverContent";

const useOutlinedInputStyles = makeStyles((theme) => ({
  input: {
    textAlign: "center",
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
  },
  adornedStart: {
    paddingLeft: theme.spacing(1),
  },
  adornedEnd: {
    paddingRight: theme.spacing(1),
  },
}));

const useInputAdornmentStyles = makeStyles({
  positionStart: {
    marginRight: 0,
  },
  positionEnd: {
    marginLeft: 0,
  },
});

const useStyles = makeStyles({
  input: {
    "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "&": {
      "-moz-appearance": "textfield",
    },
  },
  notCraftableDisabledButton: {
    height: "2rem",
    fontSize: "smaller",
  },
  itemButton: {
    "&:focus, &:active": {
      filter: "brightness(0.5)",
    },
  },
  itemInfoPopover: {
    opacity: 0.9,
  },
});

interface ItemNeededProps {
  owned: number | null;
  needed: number;
  size?: number;
  complete?: boolean;
  crafting?: boolean;
  ingredientFor?: Ingredient[];
  onIncrement: (itemName: string) => void;
  onDecrement: (itemName: string) => void;
  onChange: (itemName: string, rawInput: string) => void;
  onCraftingToggle: (itemName: string) => void;
}
type Props = ItemNeededProps & Item;

const ItemNeeded = React.memo(function ItemNeeded({
  name,
  tier,
  ingredients,
  owned,
  needed,
  size = defaultSize,
  complete = false,
  crafting = false,
  ingredientFor,
  onIncrement,
  onDecrement,
  onChange,
  onCraftingToggle,
}: Props): React.ReactElement {
  const outlinedInputClasses = useOutlinedInputStyles();
  const inputAdornmentClasses = useInputAdornmentStyles();
  const classes = useStyles();
  const popoverState = usePopupState({
    variant: "popover",
    popupId: `${slugify(name)}-popover`,
  });

  return (
    <>
      <Box position="relative">
        <Box width="100%" textAlign="center">
          <ButtonBase
            className={classes.itemButton}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...bindTrigger(popoverState)}
            disableRipple
          >
            <ItemStack {...{ name, tier, size, complete }} quantity={needed} />
          </ButtonBase>
        </Box>
        <Popover
          BackdropProps={{
            invisible: false,
            transitionDuration: 250,
          }}
          className={classes.itemInfoPopover}
          hideBackdrop={false}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          transitionDuration={{
            appear: 0,
            enter: 250,
            exit: 0,
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...bindPopover(popoverState)}
        >
          <ItemInfoPopoverContent
            name={name}
            tier={tier}
            ingredients={ingredients}
            ingredientFor={ingredientFor}
          />
        </Popover>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          value={owned}
          onFocus={(event) => event.target.select()}
          onChange={(event) => onChange(name, event.target.value)}
          inputProps={{
            type: "number",
            className: classes.input,
            min: 0,
            step: 1,
          }}
          InputProps={{
            classes: outlinedInputClasses,
            startAdornment: (
              <InputAdornment position="start" classes={inputAdornmentClasses}>
                <IconButton
                  aria-label="remove 1 from owned amount"
                  edge="start"
                  disabled={owned === 0}
                  onClick={() => onDecrement(name)}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" classes={inputAdornmentClasses}>
                <IconButton
                  aria-label="add 1 to owned amount"
                  edge="end"
                  onClick={() => onIncrement(name)}
                >
                  <AddCircleIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {ingredients ? (
          <Button
            size="small"
            fullWidth
            color="secondary"
            variant={crafting ? "contained" : "outlined"}
            onClick={() => onCraftingToggle(name)}
          >
            <GavelIcon />
            {crafting ? "Crafting" : "Craft"}
          </Button>
        ) : (
          <Button
            className={classes.notCraftableDisabledButton}
            size="small"
            fullWidth
            variant="outlined"
            disabled
          >
            (Uncraftable)
          </Button>
        )}
      </Box>
    </>
  );
});
export default ItemNeeded;