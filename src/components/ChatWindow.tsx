import { FC, useState } from "react";
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { IChat } from "../types/chat";
import { IMessage } from "../types/message";
import Message from "./message";

interface ChatWindowProps {
  selectedChat?: IChat;
  messages: IMessage[];
  onSendMessage: (text: string) => void;
}

const ChatWindow: FC<ChatWindowProps> = ({
  selectedChat,
  messages,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        bgcolor: "background.paper",
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {selectedChat ? (
        <>
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {selectedChat.groupName}
            </Typography>
          </Box>

          {/* Messages Container */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
            }}
          >
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === "user1"}
              />
            ))}
          </Box>

          {/* Input Area */}
          <Box
            sx={{ p: 2, borderTop: 1, borderColor: "divider", width: "100%" }}
          >
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                borderRadius: 4,
                boxShadow: 1,
                width: "100%",
              }}
            >
              <IconButton sx={{ p: "10px" }} aria-label="attach file">
                <AttachFileIcon />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={4}
              />
              <IconButton
                sx={{ p: "10px" }}
                aria-label="send"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <SendIcon />
              </IconButton>
            </Paper>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Select a conversation to start messaging
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatWindow;
