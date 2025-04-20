import { FC, useState, useRef, useEffect } from "react";
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
import InfoIcon from "@mui/icons-material/Info";
import { IChat } from "../types/chat";
import { IMessage, IMediaAttachment } from "../types/message";
import Message from "./message";
import TypingIndicator from "./TypingIndicator";
import GroupInfo from "./GroupInfo";

interface ChatWindowProps {
  selectedChat?: IChat;
  messages: IMessage[];
  onSendMessage: (text: string, media?: IMediaAttachment) => void;
  onMuteToggle?: (chatId: string, muted: boolean) => void;
}

const ChatWindow: FC<ChatWindowProps> = ({
  selectedChat,
  messages,
  onSendMessage,
  onMuteToggle = () => {},
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [mediaAttachment, setMediaAttachment] =
    useState<IMediaAttachment | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [groupInfoOpen, setGroupInfoOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mock typing indicators
  useEffect(() => {
    // For both cases (typing or not typing), generate random users
    // but never include the current user

    // When user is typing, simulate others typing with higher probability
    if (isFocused && newMessage) {
      // Randomly choose one or more users to show as typing
      const mockTypers = [];

      // Alex has a 70% chance of typing when you're typing
      if (Math.random() < 0.7) {
        mockTypers.push("Alex");
      }

      // Taylor has a 40% chance of typing when you're typing
      if (Math.random() < 0.4) {
        mockTypers.push("Taylor");
      }

      // John has a 20% chance of typing when you're typing
      if (Math.random() < 0.2) {
        mockTypers.push("John");
      }

      setTypingUsers(mockTypers);
      return;
    }

    // Randomly simulate users typing with a timer when not typing
    const randomInterval = Math.floor(Math.random() * 10000) + 5000; // 5-15 seconds

    const timer = setTimeout(() => {
      if (selectedChat) {
        const randomUsers = [];
        const userCount = Math.floor(Math.random() * 3) + 1; // 1-3 users

        // Never include the current user (Jamie Doe)
        const possibleUsers = ["Alex", "Taylor", "John", "Emma", "Michael"];
        for (let i = 0; i < userCount; i++) {
          const randomIndex = Math.floor(Math.random() * possibleUsers.length);
          randomUsers.push(possibleUsers[randomIndex]);
          possibleUsers.splice(randomIndex, 1); // Remove this user so we don't pick them again
        }

        setTypingUsers(randomUsers);

        // Clear typing indicator after 2-5 seconds
        const typingDuration = Math.floor(Math.random() * 3000) + 2000;
        setTimeout(() => {
          setTypingUsers([]);
        }, typingDuration);
      }
    }, randomInterval);

    return () => clearTimeout(timer);
  }, [isFocused, newMessage, selectedChat]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "" || mediaAttachment) {
      onSendMessage(newMessage, mediaAttachment || undefined);
      setNewMessage("");
      setMediaAttachment(null);
      setTypingUsers([]); // Clear typing indicators when sending a message
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleOpenGroupInfo = () => {
    setGroupInfoOpen(true);
  };

  const handleCloseGroupInfo = () => {
    setGroupInfoOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;

      // Determine file type
      let type: IMediaAttachment["type"] = "file";
      if (file.type.startsWith("image/")) {
        type = "image";
      } else if (file.type.startsWith("video/")) {
        type = "video";
      }

      setMediaAttachment({
        type,
        url: result,
        name: file.name,
        size: file.size,
      });
    };

    reader.readAsDataURL(file);

    // Clear the input value so the same file can be selected again
    event.target.value = "";
  };

  const handleCancelAttachment = () => {
    setMediaAttachment(null);
  };

  const handleMuteToggle = (chatId: string, muted: boolean) => {
    onMuteToggle(chatId, muted);
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
            <IconButton
              onClick={handleOpenGroupInfo}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "#26A69A" },
              }}
            >
              <InfoIcon />
            </IconButton>
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

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <TypingIndicator typingUsers={typingUsers} />
            )}

            {/* Empty div for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{ p: 2, borderTop: 1, borderColor: "divider", width: "100%" }}
          >
            {/* Media Preview */}
            {mediaAttachment && (
              <Box
                sx={{
                  mb: 2,
                  position: "relative",
                  maxWidth: "200px",
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {mediaAttachment.type === "image" && (
                  <Box
                    component="img"
                    src={mediaAttachment.url}
                    alt={mediaAttachment.name || "Image attachment"}
                    sx={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "150px",
                      objectFit: "cover",
                    }}
                  />
                )}
                {mediaAttachment.type === "video" && (
                  <Box
                    component="video"
                    src={mediaAttachment.url}
                    sx={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "150px",
                    }}
                  />
                )}
                {mediaAttachment.type === "file" && (
                  <Typography variant="body2" sx={{ p: 1 }}>
                    {mediaAttachment.name}
                  </Typography>
                )}
                <IconButton
                  size="small"
                  onClick={handleCancelAttachment}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "white",
                    p: 0.5,
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.7)",
                    },
                  }}
                >
                  ✕
                </IconButton>
              </Box>
            )}

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
              <IconButton
                sx={{ p: "10px" }}
                aria-label="attach file"
                onClick={handleAttachClick}
              >
                <AttachFileIcon />
              </IconButton>
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                multiline
                maxRows={4}
              />
              <IconButton
                sx={{ p: "10px" }}
                aria-label="send"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && !mediaAttachment}
              >
                <SendIcon />
              </IconButton>
            </Paper>
          </Box>

          {/* Group Info Drawer */}
          <GroupInfo
            chat={selectedChat}
            open={groupInfoOpen}
            onClose={handleCloseGroupInfo}
            onMuteToggle={handleMuteToggle}
          />
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
