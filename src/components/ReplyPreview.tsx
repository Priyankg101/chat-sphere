import { FC } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReplyIcon from "@mui/icons-material/Reply";
import { IMessage } from "../types/message";

interface ReplyPreviewProps {
  replyToMessage: IMessage | null;
  onCancelReply: () => void;
}

const ReplyPreview: FC<ReplyPreviewProps> = ({
  replyToMessage,
  onCancelReply,
}) => {
  if (!replyToMessage) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        p: 1.5,
        mb: 1,
        borderRadius: 1,
        bgcolor: "secondary.light",
        position: "relative",
        borderLeft: "3px solid",
        borderColor: "primary.main",
      }}
    >
      <ReplyIcon
        fontSize="small"
        sx={{
          mr: 1,
          color: "primary.main",
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      />

      <Box sx={{ flex: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "0.75rem", sm: "0.85rem" },
          }}
        >
          Replying to {replyToMessage.senderName}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
            mt: 0.5,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            maxWidth: { xs: "240px", sm: "300px", md: "400px" },
          }}
        >
          {replyToMessage.media
            ? `[${replyToMessage.media.type}] ${
                replyToMessage.text || "Media message"
              }`
            : replyToMessage.text}
        </Typography>
      </Box>

      <IconButton
        size="small"
        onClick={onCancelReply}
        sx={{
          p: { xs: 0.25, sm: 0.5 },
          ml: 1,
        }}
      >
        <CloseIcon
          fontSize="small"
          sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem" } }}
        />
      </IconButton>
    </Box>
  );
};

export default ReplyPreview;
