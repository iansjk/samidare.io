import React from "react";
import { Box } from "@material-ui/core";
import { getOperatorImagePublicId } from "../utils";

const DEFAULT_SIZE = 100;

export interface OperatorImageProps {
  name: string;
  size?: number;
  elite?: 0 | 1 | 2;
}

function OperatorImage({
  name,
  size = DEFAULT_SIZE,
  elite,
}: OperatorImageProps): React.ReactElement {
  const eliteAltText = elite != null ? `Elite ${elite}` : "";
  const eliteIconSize = Math.max(Math.floor(size / 3), 35);
  return (
    <Box position="relative" width={size} height={size}>
      <img
        width={size}
        height={size}
        src={`https://res.cloudinary.com/samidare/image/upload/f_auto,q_auto/${getOperatorImagePublicId(
          name,
          elite
        )}`}
        alt={`${name}${eliteAltText}`}
      />
      {elite != null && (
        <Box clone position="absolute" right={0} bottom={0}>
          <img
            src={`https://res.cloudinary.com/samidare/image/upload/e_outline:1,f_auto,q_auto,w_${eliteIconSize},h_${eliteIconSize}/v1/arknights/elite/${elite}`}
            alt=""
            width={eliteIconSize}
            height={eliteIconSize}
          />
        </Box>
      )}
    </Box>
  );
}
export default OperatorImage;
