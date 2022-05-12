import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { FC } from "react";

interface GiftItemProps {
  img?: string;
  name?: string;
  content?: string;
}

const GiftItem: FC<GiftItemProps> = ({ img, name, content }) => {
  return (
    <Box>
      <Typography variant="caption">
        {img ? (
          <img
            style={{
              height: "1.5em",
            }}
            src={img}
            alt={name}
          />
        ) : (
          name
        )}
        {content}
      </Typography>
    </Box>
  );
};

export default GiftItem;
