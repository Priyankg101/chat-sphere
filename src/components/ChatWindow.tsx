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
  Tooltip,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InfoIcon from "@mui/icons-material/Info";
import PushPinIcon from "@mui/icons-material/PushPin";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IChat } from "../types/chat";
import { IMessage, IMediaAttachment } from "../types/message";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import GroupInfo from "./GroupInfo";
import ReplyPreview from "./ReplyPreview";
import ForwardMessageDialog from "./ForwardMessageDialog";
import SavedMessages from "./SavedMessages";
import ChatBackground, { BackgroundType } from "./ChatBackground";
import AvatarPreview from "./AvatarPreview";
import { mockUsers } from "../mockData";
import { aiGenerateReplies } from "../utils/ai";

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
  onDeleteMessage?: (messageId: string, deleteType: "me" | "everyone") => void;
  onSetActiveChat?: (chatId: string) => void;
  backgroundType?: BackgroundType;
  onHighlightMessage?: (messageId: string) => void;
  onCreateDirectChat?: (userId: string) => void;
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
  onDeleteMessage = () => {},
  onSetActiveChat = () => {},
  backgroundType = "solid",
  onHighlightMessage = () => {},
  onCreateDirectChat = () => {},
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [mediaAttachment, setMediaAttachment] =
    useState<IMediaAttachment | null>(null);
  const [viewOnceEnabled, setViewOnceEnabled] = useState(false);
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
  const [avatarPreviewOpen, setAvatarPreviewOpen] = useState(false);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);

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

  // Mock typing indicators - improved to be more realistic
  useEffect(() => {
    // Clear typing users when chat changes
    setTypingUsers([]);

    if (!selectedChat) return;

    // Only use participants that are actually in the current chat
    const chatParticipants =
      selectedChat.members
        ?.filter((member) => member.id !== "user1") // Don't include current user
        ?.map((member) => member.name) || [];

    if (chatParticipants.length === 0) return;

    // Don't show typing indicators when focus is on input
    // This makes it more random and natural
    if (isFocused) return;

    // For individual chats, only the other person should be typing
    if (selectedChat.type === "individual") {
      // 15% chance the person will start typing
      const shouldType = Math.random() < 0.15;

      if (shouldType) {
        // The other person in the chat
        const otherPerson = chatParticipants[0];

        // Set typing indicator with a delayed timer
        const startTypingDelay = Math.floor(Math.random() * 5000) + 2000;
        const typingTimer = setTimeout(() => {
          setTypingUsers([otherPerson]);

          // Clear typing after 2-4 seconds
          const typingDuration = Math.floor(Math.random() * 2000) + 2000;
          setTimeout(() => {
            setTypingUsers([]);
          }, typingDuration);
        }, startTypingDelay);

        return () => clearTimeout(typingTimer);
      }
    }
    // For group chats, multiple people might be typing
    else if (selectedChat.type === "group") {
      // 20% chance someone will start typing
      const shouldAnybodyType = Math.random() < 0.2;

      if (shouldAnybodyType) {
        // Get 1-2 random participants (never more than the actual participants)
        const maxTypers = Math.min(2, chatParticipants.length);
        const numberOfTypers = Math.floor(Math.random() * maxTypers) + 1;

        // Randomly select participants
        const shuffled = [...chatParticipants].sort(() => 0.5 - Math.random());
        const selectedTypers = shuffled.slice(0, numberOfTypers);

        // Set typing indicator with a random delay
        const startTypingDelay = Math.floor(Math.random() * 5000) + 2000;
        const typingTimer = setTimeout(() => {
          setTypingUsers(selectedTypers);

          // Clear typing after 3-6 seconds
          const typingDuration = Math.floor(Math.random() * 3000) + 3000;
          setTimeout(() => {
            setTypingUsers([]);
          }, typingDuration);
        }, startTypingDelay);

        return () => clearTimeout(typingTimer);
      }
    }

    // Set up a periodic check for random typing
    const periodicCheck = setInterval(() => {
      // For individual chats
      if (selectedChat.type === "individual") {
        // 10% chance to start typing every 20-30 seconds
        if (Math.random() < 0.1) {
          setTypingUsers([chatParticipants[0]]);

          // Clear typing after 2-4 seconds
          const typingDuration = Math.floor(Math.random() * 2000) + 2000;
          setTimeout(() => {
            setTypingUsers([]);
          }, typingDuration);
        }
      }
      // For group chats
      else if (selectedChat.type === "group" && chatParticipants.length > 1) {
        // 15% chance someone will start typing every 20-30 seconds
        if (Math.random() < 0.15) {
          // Get 1-2 random participants
          const maxTypers = Math.min(2, chatParticipants.length);
          const numberOfTypers = Math.floor(Math.random() * maxTypers) + 1;

          // Randomly select participants
          const shuffled = [...chatParticipants].sort(
            () => 0.5 - Math.random()
          );
          const selectedTypers = shuffled.slice(0, numberOfTypers);

          setTypingUsers(selectedTypers);

          // Clear typing after 3-6 seconds
          const typingDuration = Math.floor(Math.random() * 3000) + 3000;
          setTimeout(() => {
            setTypingUsers([]);
          }, typingDuration);
        }
      }
    }, Math.floor(Math.random() * 10000) + 20000); // Check every 20-30 seconds

    return () => {
      clearInterval(periodicCheck);
    };
  }, [selectedChat, isFocused]);

  // Generate smart replies when selected chat or messages change
  useEffect(() => {
    const generateSmartReplies = async () => {
      if (!selectedChat || messages.length === 0) {
        setSmartReplies([]);
        return;
      }

      // Get the last message that isn't from the current user
      const lastOtherUserMessage = [...messages]
        .reverse()
        .find((msg) => msg.senderId !== "user1");

      if (lastOtherUserMessage) {
        try {
          const replies = await aiGenerateReplies(lastOtherUserMessage.text);
          setSmartReplies(replies);
        } catch (error) {
          console.error("Error generating smart replies:", error);
          setSmartReplies(["Got it", "Thanks", "I understand"]);
        }
      }
    };

    generateSmartReplies();
  }, [selectedChat, messages]);

  // Clear smart replies when user starts typing
  useEffect(() => {
    if (newMessage.trim() !== "") {
      setSmartReplies([]);
    }
  }, [newMessage]);

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
      setViewOnceEnabled(false);
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
        viewOnce:
          viewOnceEnabled && (mediaType === "image" || mediaType === "video"),
      });
    };
    reader.readAsDataURL(file);

    // Reset the input so the same file can be selected again
    event.target.value = "";
  };

  // Toggle view once option (only for image/video)
  const handleViewOnceToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setViewOnceEnabled(event.target.checked);

    // Update existing attachment if there is one
    if (
      mediaAttachment &&
      (mediaAttachment.type === "image" || mediaAttachment.type === "video")
    ) {
      setMediaAttachment({
        ...mediaAttachment,
        viewOnce: event.target.checked,
      });
    }
  };

  // Handle when view-once media is viewed
  const handleMediaViewed = () => {
    // We could update the UI or notify the user here if needed
    console.log("View-once media has been viewed");
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

  // Handle starting a direct chat with a user from their avatar
  const handleStartDirectChat = (userId: string) => {
    if (userId === "user1") return; // Don't create a chat with yourself

    // Check if there's already a direct chat with this user
    const existingChat = allChats.find(
      (chat) =>
        chat.type === "individual" &&
        chat.participants.includes(userId) &&
        chat.participants.includes("user1")
    );

    if (existingChat) {
      // If a chat already exists, just switch to it
      onSetActiveChat(existingChat.id);
    } else {
      // Otherwise create a new direct chat
      onCreateDirectChat(userId);
    }
  };

  // Function to determine avatar info based on chat type
  const getChatAvatarInfo = () => {
    if (!selectedChat) return null;

    if (selectedChat.type === "individual") {
      // For direct messages, get info of the other user
      const otherUserId = selectedChat.participants.find(
        (id) => id !== "user1"
      );
      if (otherUserId) {
        const user = mockUsers.find((user) => user.id === otherUserId);
        if (user) {
          return {
            name: user.name,
            avatar: user.avatar,
            status: user.status,
            email: user.email,
            lastSeen: user.lastSeen,
            isOnline: user.isOnline,
          };
        }
      }
    }

    // For group chats, use the group info
    return {
      name: selectedChat.groupName,
      avatar: selectedChat.avatar,
      status: undefined,
      email: undefined,
      lastSeen: undefined,
      isOnline: undefined,
    };
  };

  // Handle avatar click to open preview
  const handleAvatarClick = () => {
    setAvatarPreviewOpen(true);
  };

  // Get avatar info for preview
  const avatarInfo = getChatAvatarInfo();

  // Add handler for smart reply clicks
  const handleSmartReplyClick = (reply: string) => {
    setNewMessage(reply);
    // Optional: auto-send the message
    // setTimeout(() => handleSendMessage(), 100);
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
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <Tooltip title="View profile">
                <Avatar
                  src={selectedChat.avatar}
                  alt={selectedChat.groupName}
                  onClick={handleAvatarClick}
                  sx={{
                    width: 40,
                    height: 40,
                    cursor: "pointer",
                    mr: 2,
                    "&:hover": {
                      boxShadow: 2,
                    },
                    bgcolor: "primary.main",
                  }}
                >
                  {selectedChat.groupName.charAt(0)}
                </Avatar>
              </Tooltip>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {selectedChat.groupName}
              </Typography>
            </Box>

            <Box sx={{ marginLeft: "auto", display: "flex" }}>
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
          </Box>

          {/* Avatar Preview Dialog */}
          {avatarInfo && (
            <AvatarPreview
              open={avatarPreviewOpen}
              onClose={() => setAvatarPreviewOpen(false)}
              name={avatarInfo.name}
              avatar={avatarInfo.avatar}
              status={avatarInfo.status}
              email={avatarInfo.email}
              lastSeen={avatarInfo.lastSeen}
              isOnline={avatarInfo.isOnline}
            />
          )}

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
                sx={{
                  mb: 2,
                  position: "relative",
                  ...(msg.id === highlightedMessageId && {
                    scrollMarginTop: "120px",
                    scrollMarginBottom: "120px",
                  }),
                }}
                className={
                  msg.id === lastSentMessageId && msg.senderId === "user1"
                    ? "messageAnimation"
                    : ""
                }
              >
                {msg.id === highlightedMessageId && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      left: -8,
                      right: -8,
                      bottom: -8,
                      borderRadius: 2,
                      border: "2px solid",
                      borderColor: "primary.main",
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(38, 166, 154, 0.08)"
                          : "rgba(38, 166, 154, 0.04)",
                      zIndex: -1,
                    }}
                  />
                )}
                <Message
                  message={msg}
                  isCurrentUser={msg.senderId === "user1"}
                  onPinMessage={handlePinMessage}
                  onReply={handleReply}
                  onForward={handleForward}
                  onSave={handleSave}
                  onDelete={onDeleteMessage}
                  isPinned={pinnedMessage?.id === msg.id}
                  isHighlighted={highlightedMessageId === msg.id}
                  replyToMessage={getReplyToMessage(msg.replyToId)}
                  onStartDirectChat={handleStartDirectChat}
                  onMediaViewed={handleMediaViewed}
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

          {/* Smart Reply Suggestions */}
          {selectedChat && smartReplies.length > 0 && (
            <Box
              sx={{
                px: 2,
                pb: 0.75,
                pt: 0.75,
                bgcolor: "transparent",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 0.75,
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                {smartReplies.map((reply, index) => (
                  <Chip
                    key={index}
                    label={reply}
                    size="small"
                    onClick={() => handleSmartReplyClick(reply)}
                    sx={{
                      bgcolor: "rgba(38, 166, 154, 0.08)",
                      color: "primary.main",
                      fontSize: "0.75rem",
                      height: "28px",
                      border: "1px solid rgba(38, 166, 154, 0.2)",
                      "& .MuiChip-label": {
                        px: 1,
                      },
                      "&:hover": {
                        bgcolor: "rgba(38, 166, 154, 0.15)",
                        borderColor: "rgba(38, 166, 154, 0.3)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

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
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "secondary.light",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  justifyContent: "space-between",
                  border: (theme) =>
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.15)"
                      : "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: (theme) => theme.palette.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {mediaAttachment.name}{" "}
                    {mediaAttachment.size && (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          color: (theme) => theme.palette.text.secondary,
                          ml: 0.5,
                        }}
                      >
                        ({(mediaAttachment.size / 1024).toFixed(0)} KB)
                      </Typography>
                    )}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setMediaAttachment(null)}
                    sx={{
                      color: (theme) => theme.palette.text.primary,
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.12)"
                            : "rgba(0, 0, 0, 0.08)",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>

                {(mediaAttachment.type === "image" ||
                  mediaAttachment.type === "video") && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1.5,
                      borderTop: 1,
                      borderColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.12)"
                          : "rgba(0, 0, 0, 0.08)",
                      pt: 1,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={
                            viewOnceEnabled || Boolean(mediaAttachment.viewOnce)
                          }
                          onChange={handleViewOnceToggle}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <VisibilityOffIcon
                            sx={{
                              fontSize: 16,
                              mr: 0.5,
                              color: (theme) => theme.palette.text.secondary,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: (theme) => theme.palette.text.secondary,
                            }}
                          >
                            View once
                          </Typography>
                        </Box>
                      }
                      sx={{
                        margin: 0,
                        "& .MuiFormControlLabel-label": {
                          fontSize: "0.75rem",
                        },
                      }}
                    />
                  </Box>
                )}
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
