/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  makeStyles,
  Divider,
} from "@material-ui/core";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import ItemStack from "./ItemStack";
import { Ingredient, Item } from "../types";

const useCommonStyles = makeStyles((theme) => ({
  itemInfoSection: {
    position: "relative",
    marginBottom: theme.spacing(1),
  },
  itemInfoSectionHeader: {
    display: "inline-block",
    position: "relative",
    backgroundColor: "#888",
    color: "#fff",
    borderRadius: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  itemInfoSectionDivider: {
    position: "absolute",
    left: 0,
    width: "100%",
    margin: 0,
    top: theme.spacing(1.5),
    backgroundColor: "#888",
  },
  resetText: {
    color: theme.palette.text.primary,
  },
}));

interface CraftingInfoProps {
  ingredients: Ingredient[];
}

function CraftingInfo(props: CraftingInfoProps): React.ReactElement {
  const { ingredients } = props;
  const commonClasses = useCommonStyles();

  return (
    <Box mt={1}>
      <div className={commonClasses.itemInfoSection}>
        <Divider className={commonClasses.itemInfoSectionDivider} />
        <Typography
          className={commonClasses.itemInfoSectionHeader}
          component="h4"
        >
          Crafting recipe
        </Typography>
      </div>
      <Grid container>
        {ingredients.map((ingredient) => (
          <Grid
            item
            key={ingredient.name}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            xs={(12 / ingredients.length) as any}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
            >
              <Box className={commonClasses.resetText} mb={0.5}>
                <ItemStack
                  name={ingredient.name}
                  tier={ingredient.tier}
                  quantity={ingredient.quantity}
                  size={75}
                />
              </Box>
              <Typography variant="body2">{ingredient.name}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// const useStageInfoStyles = makeStyles({
//   sanityIcon: {
//     display: "inline-block",
//     width: "18px",
//     verticalAlign: "text-top",
//   },
//   stageType: {
//     fontSize: "initial",
//   },
//   stageData: {
//     fontSize: "initial",
//     margin: 0,
//   },
// });

// interface StageInfoProps {
//   stages: RecommendedStages;
// }

// function StageInfo(props: StageInfoProps): React.ReactElement {
//   const { stages } = props;
//   const classes = useStageInfoStyles();
//   const commonClasses = useCommonStyles();
//   const hasTwoRecommended = !!stages.leastSanity;

//   function renderStage(stage: Stage) {
//     return (
//       <>
//         <Typography variant="h4" component="span">
//           {stage.name}
//         </Typography>
//         <Typography>{stage.dropRate}% chance</Typography>
//         <Typography>
//           {stage.sanityCost}
//           <img
//             className={classes.sanityIcon}
//             src={`${process.env.PUBLIC_URL}/images/icons/sanity.png`}
//             alt="Sanity"
//           />
//         </Typography>
//         {stage.extraMaterial && (
//           <Box
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//             mx={-0.5}
//             mt={-0.5}
//             mb={-1}
//           >
//             <Typography>Extra drop:</Typography>
//             <Box ml={0.5}>
//               <Item name={stage.extraMaterial} size={36} />
//             </Box>
//           </Box>
//         )}
//       </>
//     );
//   }

//   return (
//     <Box mt={1}>
//       <div className={commonClasses.itemInfoSection}>
//         <Divider className={commonClasses.itemInfoSectionDivider} />
//         <Typography
//           component="h4"
//           className={commonClasses.itemInfoSectionHeader}
//         >
//           Recommended {hasTwoRecommended ? "stages" : "stage"}
//         </Typography>
//       </div>
//       <Box whiteSpace="nowrap" textAlign="center">
//         {hasTwoRecommended ? (
//           <Box mt={1}>
//             <Grid container spacing={2}>
//               <Grid item className={classes.stageType} xs>
//                 <Typography>Most efficient</Typography>
//                 {renderStage(stages.mostEfficient)}
//               </Grid>
//               <Grid item className={classes.stageType} xs>
//                 <Typography>Least sanity</Typography>
//                 {renderStage(stages.leastSanity!)}
//               </Grid>
//             </Grid>
//           </Box>
//         ) : (
//           <div>{renderStage(stages.mostEfficient)}</div>
//         )}
//       </Box>
//     </Box>
//   );
// }

const craftingResultIconFontSize = "3rem";
const useIngredientForInfoStyles = makeStyles({
  craftingResultIcon: {
    fontSize: craftingResultIconFontSize,
    color: "rgba(255, 255, 255, 0.8)",
    stroke: "black",
    strokeWidth: "0.2px",
  },
});

interface IngredientForInfoProps {
  name: string;
  tier: number;
  ingredientFor: Ingredient[];
}

function IngredientForInfo(props: IngredientForInfoProps) {
  const { name, tier, ingredientFor } = props;
  const commonClasses = useCommonStyles();
  const classes = useIngredientForInfoStyles();

  return (
    <Box mt={1}>
      <div className={commonClasses.itemInfoSection}>
        <Divider className={commonClasses.itemInfoSectionDivider} />
        <Typography
          className={commonClasses.itemInfoSectionHeader}
          component="h4"
        >
          Needed to craft
        </Typography>
      </div>
      <Grid container spacing={1}>
        {ingredientFor.map((craftedItem) => (
          <Box clone textAlign="center" display="flex" flexDirection="column">
            <Grid item key={craftedItem.name} xs>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                className={commonClasses.resetText}
              >
                <ItemStack
                  name={name}
                  tier={tier}
                  quantity={craftedItem.quantity}
                  size={75}
                />
                <Box ml={-1} mr={-2} zIndex={1}>
                  <DoubleArrowIcon className={classes.craftingResultIcon} />
                </Box>
                <ItemStack
                  name={craftedItem.name}
                  tier={craftedItem.tier}
                  quantity={1}
                  size={75}
                />
              </Box>
              <Typography variant="body2">{craftedItem.name}</Typography>
            </Grid>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  itemInfoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    color: "#000",
  },
  itemName: {
    backgroundColor: theme.palette.background.default,
    color: "#fff",
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1),
    display: "inline-block",
  },
}));

type ItemInfoPopoverContentProps = Item & {
  ingredientFor?: Ingredient[];
};

const ItemInfoPopoverContent = React.memo(function ItemInfoPopoverContent(
  props: ItemInfoPopoverContentProps
): React.ReactElement {
  const { name, tier, ingredients, ingredientFor } = props;
  const classes = useStyles();

  return (
    <Card className={classes.itemInfoCard}>
      <CardContent>
        <Typography
          className={classes.itemName}
          component="h3"
          variant="h5"
          gutterBottom
        >
          {name}
        </Typography>
        {ingredients && <CraftingInfo ingredients={ingredients} />}
        {ingredientFor && (
          <IngredientForInfo
            name={name}
            tier={tier}
            ingredientFor={ingredientFor}
          />
        )}
        {/* {MATERIALS[name]!.recommendedStages &&
          !MATERIALS[name]!.craftingRecommended && (
            <StageInfo stages={MATERIALS[name]!.recommendedStages!} />
          )} */}
      </CardContent>
    </Card>
  );
});
export default ItemInfoPopoverContent;
