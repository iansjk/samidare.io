import { Chip, Avatar, makeStyles } from "@material-ui/core";
import React from "react";
import { getOperatorImagePath } from "../utils";

export interface RecruitableOperator {
  name: string;
  rarity: number;
  tags: string[];
}

const useChipStyles = makeStyles((theme) => ({
  root: {
    color: "#000000",
    "&.rarity-6": {
      backgroundColor: "#f96601",
    },
    "&.rarity-5": {
      backgroundColor: "#fbae02",
    },
    "&.rarity-4": {
      backgroundColor: "#dbb1db",
    },
    "&.rarity-3": {
      backgroundColor: "#00b2f6",
    },
    "&.rarity-2": {
      backgroundColor: "#dce537",
    },
    "&.rarity-1": {
      backgroundColor: "#9f9f9f",
    },
  },
  label: {
    fontSize: theme.typography.body1.fontSize,
  },
}));

function RecruitableOperatorChip({
  name,
  rarity,
  tags,
}: RecruitableOperator): React.ReactElement {
  const chipClasses = useChipStyles();

  return (
    <Chip
      className={`rarity-${rarity}`}
      classes={{
        root: chipClasses.root,
        label: chipClasses.label,
      }}
      avatar={<Avatar alt="" src={getOperatorImagePath(name)} />}
      label={name}
    />
  );
}
export default RecruitableOperatorChip;
