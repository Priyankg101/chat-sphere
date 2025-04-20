import { FC, useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Typography,
  Collapse,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InfoIcon from "@mui/icons-material/Info";
import PushPinIcon from "@mui/icons-material/PushPin";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IChat } from "../types/chat";
import { IMessage, IMediaAttachment } from "../types/message";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import GroupInfo from "./GroupInfo";
import ReplyPreview from "./ReplyPreview";
import ForwardMessageDialog from "./ForwardMessageDialog";
import SavedMessages from "./SavedMessages";
import ChatBackground, { BackgroundType } from "./ChatBackground";

interface ChatWindowProps {
  selectedChat?: IChat;
  messages: IMessage[];
  allChats: IChat[];
  onSendMessage: (
    text: string,
    media?: IMediaAttachment,
    replyToId?: string
  ) => void;
  onMuteToggle?: (chatId: string, muted: boolean) => void;
  highlightedMessageId?: string;
  onForwardMessage?: (messageId: string, targetChatId: string) => void;
  onSaveMessage?: (messageId: string, isSaved: boolean) => void;
  onSetActiveChat?: (chatId: string) => void;
  backgroundType?: BackgroundType;
  onHighlightMessage?: (messageId: string) => void;
}

const ChatWindow: FC<ChatWindowProps> = ({
  selectedChat,
  messages,
  allChats,
  onSendMessage,
  onMuteToggle = () => {},
  highlightedMessageId,
  onForwardMessage = () => {},
  onSaveMessage = () => {},
  onSetActiveChat = () => {},
  backgroundType = "solid",
  onHighlightMessage = () => {},
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [mediaAttachment, setMediaAttachment] =
    useState<IMediaAttachment | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [groupInfoOpen, setGroupInfoOpen] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState<IMessage | null>(null);
  const [showPinnedMessage, setShowPinnedMessage] = useState(true);
  const [replyToMessage, setReplyToMessage] = useState<IMessage | null>(null);
  const [messageToForward, setMessageToForward] = useState<IMessage | null>(
    null
  );
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [savedMessagesOpen, setSavedMessagesOpen] = useState(false);
  const [lastSentMessageId, setLastSentMessageId] = useState<string | null>(
    null
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculate background opacity based on screen size to ensure text readability on mobile
  const backgroundOpacity = isMobile ? 0.7 : 0.85;

  // Auto scroll to the bottom when new messages arrive
  useEffect(() => {
    // Only auto-scroll if no message is highlighted (from search)
    if (!highlightedMessageId) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, highlightedMessageId]);

  // Reset animation after a short delay
  useEffect(() => {
    if (lastSentMessageId) {
      const timer = setTimeout(() => {
        setLastSentMessageId(null);
      }, 300); // Slightly longer than animation duration
      return () => clearTimeout(timer);
    }
  }, [lastSentMessageId]);

  // Load pinned message on startup and when messages change
  useEffect(() => {
    if (!selectedChat) return;

    try {
      const key = `pinned_message_${selectedChat.id}`;
      const pinnedMessageId = localStorage.getItem(key);

      if (pinnedMessageId) {
        const foundMessage = messages.find(
          (message) => message.id === pinnedMessageId
        );
        if (foundMessage) {
          setPinnedMessage(foundMessage);
          return;
        }
      }

      // If no pinned message found or if it was removed
      setPinnedMessage(null);
    } catch (error) {
      console.error("Error loading pinned message:", error);
    }
  }, [selectedChat, messages]);

  // Cancel reply if selected chat changes
  useEffect(() => {
    setReplyToMessage(null);
    setMessageToForward(null);
  }, [selectedChat]);

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
    const randomInterval = Math.floor(Math.random() * 10000) + 5000;

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
    if ((newMessage.trim() !== "" || mediaAttachment) && selectedChat) {
      onSendMessage(
        newMessage,
        mediaAttachment || undefined,
        replyToMessage?.id
      );

      // Track the last sent message to trigger animation
      // Since we can't directly get the ID of the newly created message here,
      // we'll use the timestamp to identify it in the messages array after a short delay
      setTimeout(() => {
        const userMessages = messages.filter(
          (msg) => msg.senderId === "user1" && msg.chatId === selectedChat.id
        );
        if (userMessages.length > 0) {
          // Get the most recent user message
          const mostRecentMessage = userMessages.reduce((latest, msg) =>
            msg.timestamp > latest.timestamp ? msg : latest
          );
          setLastSentMessageId(mostRecentMessage.id);
        }
      }, 10);

      setNewMessage("");
      setMediaAttachment(null);
      setReplyToMessage(null);
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

  const handleReply = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      setReplyToMessage(message);
    }
  };

  const handleCancelReply = () => {
    setReplyToMessage(null);
  };

  const handleForward = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      setMessageToForward(message);
      setForwardDialogOpen(true);
    }
  };

  const handleSave = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      onSaveMessage(messageId, !message.isSaved);
    }
  };

  const handleOpenSavedMessages = () => {
    setSavedMessagesOpen(true);
  };

  const handleForwardMessage = (messageId: string, targetChatId: string) => {
    onForwardMessage(messageId, targetChatId);
    setMessageToForward(null);
    setForwardDialogOpen(false);
  };

  const handleJumpToMessage = (messageId: string, chatId: string) => {
    if (selectedChat?.id !== chatId) {
      onSetActiveChat(chatId);
    }
    // TODO: Implement scroll to message and highlighting
    setSavedMessagesOpen(false);
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    let mediaType: "image" | "video" | "file" = "file";

    // Determine media type based on file mime type
    if (file.type.startsWith("image/")) {
      mediaType = "image";
    } else if (file.type.startsWith("video/")) {
      mediaType = "video";
    }

    // Create a data URL for the file
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setMediaAttachment({
        type: mediaType,
        url: result,
        name: file.name,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);

    // Reset the input so the same file can be selected again
    event.target.value = "";
  };

  const handlePinMessage = (messageId: string, isPinned: boolean) => {
    if (!selectedChat) return;

    if (isPinned) {
      // Find the message and set it as pinned
      const messageToPin = messages.find((msg) => msg.id === messageId);
      if (messageToPin) {
        setPinnedMessage(messageToPin);

        // Save to localStorage
        try {
          const key = `pinned_message_${selectedChat.id}`;
          localStorage.setItem(key, messageId);
        } catch (error) {
          console.error("Error saving pinned message:", error);
        }
      }
    } else if (pinnedMessage?.id === messageId) {
      // Only unpin if this was the pinned message
      setPinnedMessage(null);

      // Remove from localStorage
      try {
        const key = `pinned_message_${selectedChat.id}`;
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing pinned message:", error);
      }
    }
  };

  const handleClosePinnedMessage = () => {
    if (!selectedChat || !pinnedMessage) return;

    // Remove pinned status from localStorage
    try {
      const key = `pinned_message_${selectedChat.id}`;
      localStorage.removeItem(key);
      setPinnedMessage(null);
    } catch (error) {
      console.error("Error removing pinned message:", error);
    }
  };

  const togglePinnedMessageVisibility = () => {
    setShowPinnedMessage((prev) => !prev);
  };

  // Get count of saved messages
  const savedMessagesCount = messages.filter((msg) => msg.isSaved).length;

  // Find the message being replied to based on replyToId for each message
  const getReplyToMessage = (replyToId?: string) => {
    if (!replyToId) return null;
    return messages.find((msg) => msg.id === replyToId) || null;
  };

  const handlePinnedMessageClick = (messageId: string) => {
    // Highlight the message in the chat
    onHighlightMessage(messageId);

    // Find and scroll to the message
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
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
        position: "relative",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Apply dynamic background */}
      <ChatBackground
        backgroundType={backgroundType}
        opacity={backgroundOpacity}
      />

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
              position: "relative",
              zIndex: 1,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {selectedChat.groupName}
            </Typography>

            <IconButton
              onClick={handleOpenSavedMessages}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "#FFC107" },
                mr: 1,
              }}
            >
              <Badge
                badgeContent={savedMessagesCount}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.6rem",
                    height: "16px",
                    minWidth: "16px",
                  },
                }}
              >
                <BookmarkIcon />
              </Badge>
            </IconButton>

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

          {/* Pinned Message Bar */}
          {pinnedMessage && (
            <Box
              sx={{
                width: "100%",
                borderBottom: 1,
                borderColor: "#26A69A",
                position: "relative",
                zIndex: 1,
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 0.5,
                  bgcolor: "rgba(38, 166, 154, 0.1)",
                }}
              >
                <PushPinIcon
                  fontSize="small"
                  sx={{ color: "#26A69A", mr: 1 }}
                />

                <Typography variant="body2" sx={{ mr: 1 }}>
                  Pinned Message
                </Typography>

                <IconButton
                  size="small"
                  onClick={togglePinnedMessageVisibility}
                  sx={{ ml: "auto", color: "text.secondary" }}
                >
                  {showPinnedMessage ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>

                <IconButton
                  size="small"
                  onClick={handleClosePinnedMessage}
                  sx={{ ml: 0.5, color: "text.secondary" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              <Collapse in={showPinnedMessage}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "rgba(38, 166, 154, 0.05)",
                    borderRadius: 1,
                    mx: 2,
                    mb: 1,
                    mt: 1,
                    maxHeight: { xs: "100px", sm: "120px" },
                    overflow: "auto",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(38, 166, 154, 0.1)",
                    },
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                    border: "1px solid rgba(38, 166, 154, 0.15)",
                  }}
                  onClick={() => handlePinnedMessageClick(pinnedMessage.id)}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <Avatar
                      sx={{
                        width: { xs: 24, sm: 32 },
                        height: { xs: 24, sm: 32 },
                        fontSize: { xs: "0.75rem", sm: "1rem" },
                      }}
                    >
                      {pinnedMessage.senderName.substring(0, 1)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.primary">
                        {pinnedMessage.senderName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                          mt: 0.5,
                          wordBreak: "break-word",
                        }}
                      >
                        {pinnedMessage.text}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </Box>
          )}

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
              position: "relative",
              zIndex: 1,
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                id={`message-${msg.id}`}
                sx={{ mb: 2 }}
                className={
                  msg.id === lastSentMessageId && msg.senderId === "user1"
                    ? "messageAnimation"
                    : ""
                }
              >
                <Message
                  message={msg}
                  isCurrentUser={msg.senderId === "user1"}
                  onPinMessage={handlePinMessage}
                  onReply={handleReply}
                  onForward={handleForward}
                  onSave={handleSave}
                  isPinned={pinnedMessage?.id === msg.id}
                  isHighlighted={highlightedMessageId === msg.id}
                  replyToMessage={getReplyToMessage(msg.replyToId)}
                />
              </Box>
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
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Reply Preview */}
            {replyToMessage && (
              <ReplyPreview
                replyToMessage={replyToMessage}
                onCancelReply={handleCancelReply}
              />
            )}

            {mediaAttachment && (
              <Box
                sx={{
                  mb: 2,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: "secondary.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">
                  {mediaAttachment.name}{" "}
                  {mediaAttachment.size && (
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      ({(mediaAttachment.size / 1024).toFixed(0)} KB)
                    </Typography>
                  )}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setMediaAttachment(null)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            <Paper
              elevation={1}
              sx={{
                p: 0.5,
                display: "flex",
                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <IconButton
                sx={{ p: 1 }}
                aria-label="attach file"
                onClick={handleAttachClick}
              >
                <AttachFileIcon />
              </IconButton>
              <InputBase
                multiline
                maxRows={4}
                sx={{ ml: 1, flex: 1 }}
                placeholder={
                  replyToMessage ? "Type a reply..." : "Type a message"
                }
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <IconButton
                color="primary"
                sx={{ p: 1 }}
                aria-label="send message"
                onClick={handleSendMessage}
                disabled={newMessage.trim() === "" && !mediaAttachment}
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
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Select a conversation to start chatting
          </Typography>
        </Box>
      )}

      {/* Group Info Drawer */}
      <GroupInfo
        chat={selectedChat}
        open={groupInfoOpen}
        onClose={handleCloseGroupInfo}
        onMuteToggle={onMuteToggle}
      />

      {/* Forward Message Dialog */}
      <ForwardMessageDialog
        open={forwardDialogOpen}
        onClose={() => setForwardDialogOpen(false)}
        chats={allChats}
        messageToForward={messageToForward}
        onForward={handleForwardMessage}
      />

      {/* Saved Messages Drawer */}
      <SavedMessages
        open={savedMessagesOpen}
        onClose={() => setSavedMessagesOpen(false)}
        messages={messages.filter((msg) => msg.isSaved)}
        onUnsaveMessage={(messageId) => onSaveMessage(messageId, false)}
        onJumpToMessage={handleJumpToMessage}
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelected}
        accept="image/*,video/*,application/*"
      />
    </Box>
  );
};

export default ChatWindow;
