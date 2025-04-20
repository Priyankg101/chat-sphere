import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { IMessage } from "../types/message";

interface ReplyMessageContentProps {
  replyMessage: IMessage;
  isCurrentUserMessage: boolean;
}

const ReplyMessageContent: FC<ReplyMessageContentProps> = ({
  replyMessage,
  isCurrentUserMessage,
}) => {
  return (
    <Box
      sx={{
        p: 0.75,
        mb: 1,
        borderRadius: 1,
        bgcolor: isCurrentUserMessage
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.05)",
        borderLeft: "2px solid",
        borderColor: isCurrentUserMessage
          ? "rgba(255,255,255,0.5)"
          : "primary.main",
        maxWidth: "100%",
      }}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{
          fontWeight: 500,
          color: isCurrentUserMessage
            ? "rgba(255,255,255,0.8)"
            : "primary.main",
          fontSize: { xs: "0.65rem", sm: "0.7rem" },
          mb: 0.25,
        }}
      >
        {replyMessage.senderName}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: isCurrentUserMessage
            ? "rgba(255,255,255,0.9)"
            : "text.secondary",
          fontSize: { xs: "0.7rem", sm: "0.75rem" },
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {replyMessage.media
          ? `[${replyMessage.media.type}] ${
              replyMessage.text || "Media message"
            }`
          : replyMessage.text.length > 50
          ? `${replyMessage.text.substring(0, 50)}...`
          : replyMessage.text}
      </Typography>
    </Box>
  );
};

export default ReplyMessageContent;
