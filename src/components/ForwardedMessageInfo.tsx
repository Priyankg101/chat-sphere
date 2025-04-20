import { FC } from "react";
import { Box, Typography } from "@mui/material";
import ForwardIcon from "@mui/icons-material/Forward";

interface ForwardedMessageInfoProps {
  chatName: string;
  senderName: string;
}

const ForwardedMessageInfo: FC<ForwardedMessageInfoProps> = ({
  chatName,
  senderName,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
      <ForwardIcon
        fontSize="small"
        sx={{
          mr: 0.5,
          color: "text.secondary",
          fontSize: { xs: "0.8rem", sm: "0.9rem" },
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontSize: { xs: "0.65rem", sm: "0.7rem" },
          fontStyle: "italic",
        }}
      >
        Forwarded from {chatName} • {senderName}
      </Typography>
    </Box>
  );
};

export default ForwardedMessageInfo;
