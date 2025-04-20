import { FC } from "react";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import { IMessage } from "../types/message";
import MediaPreview from "./MediaPreview";

interface MessageProps {
  message: IMessage;
  isCurrentUser?: boolean;
}

const Message: FC<MessageProps> = ({ message, isCurrentUser = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
        maxWidth: "70%",
        mb: 1,
      }}
    >
      {!isCurrentUser && (
        <Avatar
          sx={{
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            mr: 1,
            fontSize: { xs: "0.75rem", sm: "1rem" },
          }}
        >
          {message.senderName.substring(0, 1)}
        </Avatar>
      )}
      <Box>
        {!isCurrentUser && (
          <Typography
            variant="caption"
            sx={{
              ml: 1,
              mb: 0.5,
              display: "block",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
            }}
          >
            {message.senderName}
          </Typography>
        )}
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: isCurrentUser ? "primary.light" : "background.default",
            color: isCurrentUser ? "primary.contrastText" : "text.primary",
            maxWidth: "100%",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
            }}
          >
            {message.text}
          </Typography>

          {message.media && (
            <Box sx={{ mt: 1 }}>
              <MediaPreview media={message.media} />
            </Box>
          )}

          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "right",
              mt: 0.5,
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
              opacity: 0.8,
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Message;
