import {
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  Divider,
  NoSsr,
} from "@material-ui/core";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import { useStaticQuery, graphql } from "gatsby";
import React from "react";
import { Ingredient, Item, OperatorGoal } from "../types";
import ItemNeeded from "./ItemNeeded";
import OperatorGoalCard from "./OperatorGoalCard";
import lmdIcon from "../data/images/lmd.png";
import usePersistence from "../hooks/usePersistence";
import { Virtuoso, VirtuosoGrid } from "react-virtuoso";

const useStyles = makeStyles((theme) => ({
  lmdIcon: {
    marginLeft: theme.spacing(0.5),
    position: "relative",
    top: theme.spacing(0.25),
  },
  totalCostHeader: {
    fontWeight: "initial",
  },
  OperatorGoalCardsHeaderContent: {
    "&:last-child": {
      paddingBottom: theme.spacing(2),
    },
  },
}));

interface GoalOverviewProps {
  goals: OperatorGoal[];
  onGoalDeleted: (goal: OperatorGoal) => void;
  onClearAllGoals: () => void;
}

const GoalOverview = React.memo(function GoalOverview(
  props: GoalOverviewProps
): React.ReactElement {
  const data = useStaticQuery(graphql`
    query {
      allItemsJson(sort: { order: DESC, fields: tier }) {
        nodes {
          name
          tier
          sortId
          ingredients {
            name
            quantity
            tier
            sortId
          }
        }
      }
    }
  `);
  const items: Record<string, Item & { sortId: number }> = Object.fromEntries(
    data.allItemsJson.nodes.map((node: { name: string }) => [node.name, node])
  );
  const { goals, onGoalDeleted, onClearAllGoals } = props;
  const {
    materialsOwned,
    setMaterialsOwned,
    itemsToCraft,
    setItemsToCraft,
  } = usePersistence();
  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const classes = useStyles();
  const ingredientMapping: Record<string, Ingredient[]> = {};
  const isComplete: Record<string, boolean> = {};
  const materialsNeeded: Record<string, number> = {};
  goals.forEach((goal) =>
    goal.ingredients.forEach((item) => {
      materialsNeeded[item.name] =
        item.quantity + (materialsNeeded[item.name] || 0);
    })
  );
  Object.values(items).forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(materialsNeeded, item.name)) {
      const needed = Math.max(
        materialsNeeded[item.name] - (materialsOwned[item.name] || 0),
        0
      );
      if (needed === 0) {
        isComplete[item.name] = true;
      } else if (
        needed > 0 &&
        Object.prototype.hasOwnProperty.call(itemsToCraft, item.name)
      ) {
        item?.ingredients?.forEach((ingredient) => {
          ingredientMapping[ingredient.name] = [
            ...(ingredientMapping[ingredient.name] || []),
            { name: item.name, tier: item.tier, quantity: ingredient.quantity },
          ];
          materialsNeeded[ingredient.name] =
            (materialsNeeded[ingredient.name] || 0) +
            needed * ingredient.quantity;
        });
      }
    }
  });
  const craftingMaterialsOwned = { ...materialsOwned };
  Object.keys(itemsToCraft)
    .filter(
      (itemName) => materialsNeeded[itemName] && materialsNeeded[itemName] > 0
    )
    .sort((a, b) => itemsToCraft[a].tier - itemsToCraft[b].tier)
    .forEach((craftedItemName) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ingredients = itemsToCraft[craftedItemName].ingredients!.filter(
        (ingredient) => ingredient.name !== "LMD"
      );
      const numCraftable = Math.min(
        ...ingredients.map((ingredient) => {
          return Math.floor(
            (craftingMaterialsOwned[ingredient.name] || 0) / ingredient.quantity
          );
        })
      );
      ingredients?.forEach((ingredient) => {
        craftingMaterialsOwned[ingredient.name] = Math.max(
          (craftingMaterialsOwned[ingredient.name] || 0) -
            ingredient.quantity * numCraftable,
          0
        );
      });
      if (materialsNeeded[craftedItemName] - numCraftable <= 0) {
        isComplete[craftedItemName] = true;
      }
      craftingMaterialsOwned[craftedItemName] =
        (craftingMaterialsOwned[craftedItemName] || 0) + numCraftable;
    });

  const handleIncrementOwned = React.useCallback(
    function handleIncrementOwned(itemName: string): void {
      setMaterialsOwned((prevOwned) => ({
        ...prevOwned,
        [itemName]: 1 + (prevOwned[itemName] || 0),
      }));
    },
    [setMaterialsOwned]
  );

  const handleDecrementOwned = React.useCallback(
    function handleDecrementOwned(itemName: string): void {
      setMaterialsOwned((prevOwned) => ({
        ...prevOwned,
        [itemName]: Math.max(0, (prevOwned[itemName] || 0) - 1),
      }));
    },
    [setMaterialsOwned]
  );

  const handleChangeOwned = React.useCallback(
    function handleChangeOwned(itemName: string, rawInput: string): void {
      const newValue: number | null = !rawInput ? null : parseInt(rawInput, 10);
      if (newValue === null || !Number.isNaN(newValue)) {
        setMaterialsOwned((prevOwned) => ({
          ...prevOwned,
          [itemName]: newValue,
        }));
      }
    },
    [setMaterialsOwned]
  );

  const handleCraftingToggle = React.useCallback(
    function handleCraftingToggle(itemName: string) {
      const item = items[itemName];
      setItemsToCraft((prevObj) => {
        if (Object.prototype.hasOwnProperty.call(prevObj, item.name)) {
          const newObj = { ...prevObj };
          delete newObj[item.name];
          return newObj;
        }
        return { ...prevObj, [item.name]: item };
      });
    },
    [setItemsToCraft, items]
  );

  const handleCraftOne = React.useCallback(
    function handleCraftOne(itemName: string) {
      const item = itemsToCraft[itemName];
      setMaterialsOwned((prevOwned) => {
        const newOwned = { ...prevOwned };
        item.ingredients
          ?.filter((ingredient) => ingredient.name !== "LMD")
          .forEach((ingredient) => {
            newOwned[ingredient.name] = Math.max(
              (newOwned[ingredient.name] || 0) - ingredient.quantity,
              0
            );
          });
        newOwned[itemName] = (newOwned[itemName] || 0) + 1;
        return newOwned;
      });
    },
    [itemsToCraft, setMaterialsOwned]
  );

  const handleReset = React.useCallback(
    function handleReset() {
      setItemsToCraft({});
      setMaterialsOwned({});
    },
    [setItemsToCraft, setMaterialsOwned]
  );

  const requiredMaterials = Object.entries(materialsNeeded)
    .filter(([name, _]) => name !== "LMD")
    .sort(
      ([nameA, _], [nameB, __]) =>
        (isComplete[nameA] ? 1 : 0) - (isComplete[nameB] ? 1 : 0) ||
        items[nameB].tier - items[nameA].tier ||
        items[nameA].sortId - items[nameB].sortId ||
        nameA.localeCompare(nameB)
    );

  return (
    <Grid container spacing={2}>
      <Grid component="section" item md={7} data-testid="materialsLists">
        <Card>
          <CardContent>
            <Box clone mb={1}>
              <Grid container>
                <Grid item xs={8}>
                  <Typography component="h2" variant="h5">
                    Required materials
                  </Typography>
                  <Box my={1} width="90%">
                    <Divider />
                  </Box>
                  <Typography
                    className={classes.totalCostHeader}
                    component="span"
                    variant="h6"
                  >
                    Total cost:&nbsp;
                    <b>{(materialsNeeded.LMD ?? 0).toLocaleString()}</b>
                    <img
                      className={classes.lmdIcon}
                      src={lmdIcon}
                      alt="LMD"
                      width={26}
                      height={18}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="end">
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      startIcon={<RotateLeftIcon />}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <VirtuosoGrid
              overscan={{ main: 171, reverse: 171 }}
              useWindowScroll
              totalCount={requiredMaterials.length}
              components={{
                Item: ({ children }) => (
                  <Grid item xs={3}>
                    {children}
                  </Grid>
                ),
                List: React.forwardRef(({ children }, listRef) => (
                  <Grid container spacing={1} ref={listRef}>
                    {children}
                  </Grid>
                )),
              }}
              itemContent={(i) => {
                const [name, needed] = requiredMaterials[i];
                const item = items[name];
                return (
                  <ItemNeeded
                    name={name}
                    tier={item.tier}
                    ingredients={item.ingredients}
                    size={isXSmallScreen ? 75 : undefined}
                    needed={needed}
                    owned={
                      !Object.prototype.hasOwnProperty.call(
                        materialsOwned,
                        name
                      )
                        ? 0
                        : materialsOwned[name]
                    }
                    complete={isComplete[name]}
                    crafting={Object.prototype.hasOwnProperty.call(
                      itemsToCraft,
                      name
                    )}
                    ingredientFor={ingredientMapping[name]}
                    onIncrement={handleIncrementOwned}
                    onDecrement={handleDecrementOwned}
                    onChange={handleChangeOwned}
                    onCraftingToggle={handleCraftingToggle}
                    onCraftOne={handleCraftOne}
                  />
                );
              }}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid component="section" item xs={12} md={5}>
        <>
          <Box clone mb={1}>
            <Card>
              <CardContent className={classes.OperatorGoalCardsHeaderContent}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography component="h2" variant="h5">
                      Operator goals
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="end">
                      <Button
                        variant="outlined"
                        onClick={onClearAllGoals}
                        startIcon={<ClearAllIcon />}
                      >
                        Clear All
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
          <Virtuoso
            useWindowScroll
            overscan={{ main: 107, reverse: 107 }}
            data={goals}
            itemContent={(_, goal) => (
              <OperatorGoalCard
                key={`${goal.operatorName}${goal.goalName}`}
                goal={goal}
                skill={goal.skill}
                onDelete={onGoalDeleted}
              />
            )}
          />
        </>
      </Grid>
    </Grid>
  );
});
export default GoalOverview;
