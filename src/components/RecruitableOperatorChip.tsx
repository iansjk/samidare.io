import { Chip, Avatar, makeStyles, Tooltip, Hidden } from "@material-ui/core";
import { Image, Transformation } from "cloudinary-react";
import React, { useState } from "react";
import { getOperatorImagePublicId } from "../utils";

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

const RecruitableOperatorChip = React.memo(function RecruitableOperatorChip({
  name,
  rarity,
  tags,
}: RecruitableOperator): React.ReactElement {
  const chipClasses = useChipStyles();
  const [operatorImageUrl, setOperatorImageUrl] = useState("");

  const callbackRef = (ref) => {
    if (ref) {
      setOperatorImageUrl(ref.getAttributes().src);
    }
  };

  return (
    <>
      <Tooltip
        title={tags.join(", ")}
        arrow
        placement="bottom"
        enterTouchDelay={1}
        key="chipWrapper"
      >
        <Chip
          className={`rarity-${rarity}`}
          classes={{
            root: chipClasses.root,
            label: chipClasses.label,
          }}
          avatar={<Avatar alt="" src={operatorImageUrl} />}
          label={name}
        />
      </Tooltip>
      <Hidden xlDown implementation="css" key="imageProvider">
        <Image
          ref={callbackRef}
          cloudName={process.env.GATSBY_CLOUDINARY_CLOUD_NAME}
          publicId={getOperatorImagePublicId(name)}
          alt=""
          width={24}
          height={24}
        >
          <Transformation width={24} height={24} crop="pad" />
          <Transformation effect="sharpen" />
          <Transformation quality="auto" fetchFormat="auto" />
        </Image>
      </Hidden>
    </>
  );
});
export default RecruitableOperatorChip;
