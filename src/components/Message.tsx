import { FC, useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Popper,
  ClickAwayListener,
  Stack,
  Chip,
  Fade,
  useMediaQuery,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  useTheme,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  ListItemButton,
  keyframes,
} from "@mui/material";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import ReplyIcon from "@mui/icons-material/Reply";
import ForwardIcon from "@mui/icons-material/Forward";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PushPinIcon from "@mui/icons-material/PushPin";
import DescriptionIcon from "@mui/icons-material/Description";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IMessage, IReaction, MessageStatus } from "../types/message";
import MediaPreview from "./MediaPreview";
import ReplyMessageContent from "./ReplyMessageContent";
import ForwardedMessageInfo from "./ForwardedMessageInfo";
import AvatarPreview from "./AvatarPreview";
import UserProfilePopover from "./UserProfilePopover";
import { mockUsers } from "../mockData";
import { aiSummarizeMessage } from "../utils/ai";

// Define messageSlideIn animation
const messageSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface IUserData {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
  email?: string;
  lastSeen?: number;
  isOnline?: boolean;
}

interface MessageProps {
  message: IMessage;
  isCurrentUser?: boolean;
  isPinned?: boolean;
  onReply?: (messageId: string) => void;
  onForward?: (messageId: string) => void;
  onSave?: (messageId: string) => void;
  onPinMessage?: (messageId: string, isPinned: boolean) => void;
  onDelete?: (messageId: string, deleteType: "me" | "everyone") => void;
  isHighlighted?: boolean;
  replyToMessage?: IMessage | null;
  onStartDirectChat?: (userId: string) => void;
  showAvatar?: boolean;
  onMediaViewed?: () => void;
  lastSentMessageId?: string | null;
}

// Define available emoji reactions
const AVAILABLE_REACTIONS = [
  { emoji: "❤️", label: "Heart" },
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" },
] as const;

// Sample users for testing
const USERS = {
  user1: "You",
  user2: "Alex Johnson",
  user3: "Taylor Swift",
  user4: "John Doe",
};

const Message: FC<MessageProps> = ({
  message,
  isCurrentUser = false,
  isPinned = false,
  onReply = () => {},
  onForward = () => {},
  onSave = () => {},
  onPinMessage = () => {},
  onDelete = () => {},
  isHighlighted = false,
  replyToMessage = null,
  onStartDirectChat = () => {},
  onMediaViewed = () => {},
  lastSentMessageId,
}) => {
  // Use refs for various DOM elements
  const messageRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Hooks for different features
  const [messageStatus, setMessageStatus] = useState<MessageStatus>("sent");
  const [showActions, setShowActions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reactions, setReactions] = useState<IReaction[]>(
    message.reactions || []
  );

  // Avatar preview and profile popover states
  const [avatarPreviewOpen, setAvatarPreviewOpen] = useState(false);
  const [profilePopoverAnchor, setProfilePopoverAnchor] =
    useState<HTMLElement | null>(null);
  const [currentUserData, setCurrentUserData] = useState<IUserData | null>(
    null
  );

  // Mobile-specific state
  const [touchTimer, setTouchTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

  // Get browser window width
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for reaction picker popper
  const [reactionDetailsAnchor, setReactionDetailsAnchor] =
    useState<null | HTMLElement>(null);
  const [currentReactionDetails, setCurrentReactionDetails] = useState<{
    emoji: string;
    users: string[];
  }>({ emoji: "", users: [] });

  // Check if reaction details popover should be open
  const reactionDetailsOpen = Boolean(reactionDetailsAnchor);
  // Check if reaction picker should be open
  const open = Boolean(anchorEl);
  // Check if profile popover is open
  const isProfilePopoverOpen = Boolean(profilePopoverAnchor);

  // Add a timeout ref to manage the avatar hover timeout
  const avatarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Add summarization state variables
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [messageSummary, setMessageSummary] = useState<string | null>(null);

  // Add delete handlers
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<null | HTMLElement>(
    null
  );

  // Check if message is deleted
  const isDeletedForMe = message.deletedFor?.includes("user1");
  const isDeletedForEveryone = message.isDeleted === true;
  const isMessageDeleted = isDeletedForEveryone || isDeletedForMe;

  // Mock status changes for current user's messages
  useEffect(() => {
    if (!isCurrentUser) return;

    // Initialize with the message's status or default to "sent"
    const initialStatus = message.status || "sent";
    setMessageStatus(initialStatus);

    // If status is already at final state, no need to proceed
    if (initialStatus === "read") return;

    // Simulate "delivered" status after 1.5 seconds if not already delivered
    if (initialStatus === "sent") {
      const deliveredTimer = setTimeout(() => {
        setMessageStatus("delivered");
        // Save to localStorage to persist the state
        saveMessageStatus("delivered");
      }, 1500);

      return () => clearTimeout(deliveredTimer);
    }

    // Simulate "read" status after 3 seconds if already delivered
    if (initialStatus === "delivered") {
      const readTimer = setTimeout(() => {
        setMessageStatus("read");
        // Save to localStorage to persist the state
        saveMessageStatus("read");
      }, 3000);

      return () => clearTimeout(readTimer);
    }
  }, [isCurrentUser, message.id, message.status]);

  // Save message status to localStorage
  const saveMessageStatus = (status: MessageStatus) => {
    try {
      const key = `message_status_${message.id}`;
      localStorage.setItem(key, status);
    } catch (error) {
      console.error("Error saving message status:", error);
    }
  };

  // Load message status from localStorage on component mount
  useEffect(() => {
    if (!isCurrentUser) return;

    try {
      const key = `message_status_${message.id}`;
      const savedStatus = localStorage.getItem(key) as MessageStatus | null;

      if (savedStatus && ["sent", "delivered", "read"].includes(savedStatus)) {
        setMessageStatus(savedStatus);
      }
    } catch (error) {
      console.error("Error loading message status:", error);
    }
  }, [message.id, isCurrentUser]);

  // Load reactions from localStorage on component mount
  useEffect(() => {
    const storedReactions = localStorage.getItem(`reactions_${message.id}`);
    if (storedReactions) {
      try {
        const parsedReactions = JSON.parse(storedReactions);
        setReactions(parsedReactions);
      } catch (error) {
        console.error("Error parsing stored reactions:", error);
      }
    }
  }, [message.id]);

  // Save reactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`reactions_${message.id}`, JSON.stringify(reactions));
  }, [reactions, message.id]);

  // Handle mobile touch interactions
  const handleTouchStart = () => {
    if (isMobile) {
      const timer = setTimeout(() => {
        setMobileActionsOpen(true);
      }, 500); // 500ms long press
      setTouchTimer(timer);
    }
  };

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
  };

  const handleTouchMove = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
  };

  const handleReactionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseReactions = () => {
    setAnchorEl(null);
  };

  const handleAddReaction = (emoji: IReaction["emoji"]) => {
    // Using 'user1' as the current user ID - in a real app, this would come from auth context
    const currentUserId = "user1";

    // Check if the user has already used this reaction
    const existingReactionIndex = reactions.findIndex(
      (r) => r.emoji === emoji && r.userId === currentUserId
    );

    if (existingReactionIndex !== -1) {
      // User has already used this reaction, remove it (toggle behavior)
      setReactions((prev) => [
        ...prev.slice(0, existingReactionIndex),
        ...prev.slice(existingReactionIndex + 1),
      ]);
    } else {
      // User hasn't used this reaction yet, add it
      const newReaction: IReaction = {
        emoji,
        userId: currentUserId,
        timestamp: Date.now(),
      };
      setReactions((prev) => [...prev, newReaction]);
    }

    // Close the reaction picker and mobile actions
    handleCloseReactions();
    setMobileActionsOpen(false);

    // Also close reaction details if open
    setReactionDetailsAnchor(null);
  };

  // Handle showing reaction details on hover/click
  const handleShowReactionDetails = (
    event: React.MouseEvent<HTMLElement>,
    emoji: string
  ) => {
    event.preventDefault();
    event.stopPropagation();

    // Find all users who used this emoji
    const usersWithReaction = reactions
      .filter((r) => r.emoji === emoji)
      .map((r) => USERS[r.userId as keyof typeof USERS] || r.userId);

    setCurrentReactionDetails({
      emoji,
      users: usersWithReaction,
    });

    setReactionDetailsAnchor(event.currentTarget);
  };

  const handleHideReactionDetails = () => {
    setReactionDetailsAnchor(null);
  };

  // Mobile action handlers
  const handleMobileReply = () => {
    onReply(message.id);
    setMobileActionsOpen(false);
  };

  const handleMobileForward = () => {
    onForward(message.id);
    setMobileActionsOpen(false);
  };

  const handleMobileSave = () => {
    onSave(message.id);
    setMobileActionsOpen(false);
  };

  const handleMobilePin = () => {
    setMobileActionsOpen(false);
    onPinMessage(message.id, !isPinned);
  };

  const handleMobileSummarize = () => {
    setMobileActionsOpen(false);
    handleSummarize();
  };

  // Handle pin message action
  const handlePinMessage = () => {
    onPinMessage(message.id, !isPinned);
  };

  // Get the appropriate status icon based on message status
  const getStatusIcon = () => {
    // Always show status icon for current user's messages
    // Previously had: if (!isCurrentUser) return null;

    // Use white color for better visibility on teal background
    const iconColor = isCurrentUser ? "white" : "#26A69A";
    const iconSize = isMobile ? "small" : "small";

    switch (messageStatus) {
      case "delivered":
        return (
          <DoneAllIcon
            fontSize={iconSize}
            sx={{ color: iconColor, opacity: 0.8 }}
          />
        );
      case "read":
        return <DoneAllIcon fontSize={iconSize} sx={{ color: iconColor }} />;
      case "sent":
      default:
        return (
          <DoneIcon
            fontSize={iconSize}
            sx={{ color: iconColor, opacity: 0.8 }}
          />
        );
    }
  };

  // Group reactions by emoji for display
  const groupedReactions = reactions.reduce<Record<string, number>>(
    (acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    },
    {}
  );

  // Handle avatar click to show the enlarged preview
  const handleAvatarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    // Find the user data for the sender
    const userData = mockUsers.find((user) => user.id === message.senderId);
    if (userData) {
      setCurrentUserData(userData);
      setAvatarPreviewOpen(true);
    }
  };

  // Handle avatar hover to show profile details
  const handleAvatarHover = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // Don't show popover on mobile

    clearAvatarTimeout();

    // Find the user data for the sender
    const userData = mockUsers.find((user) => user.id === message.senderId);
    if (userData) {
      setCurrentUserData(userData);
      setProfilePopoverAnchor(event.currentTarget);
    }
  };

  const handleAvatarLeave = () => {
    // Add a small delay before closing the popover
    // This gives time for the mouse to enter the popover if that's where it's headed
    avatarTimeoutRef.current = setTimeout(() => {
      setProfilePopoverAnchor(null);
    }, 500); // Increased timeout for better user experience
  };

  const clearAvatarTimeout = () => {
    if (avatarTimeoutRef.current !== null) {
      clearTimeout(avatarTimeoutRef.current);
      avatarTimeoutRef.current = null;
    }
  };

  // Handle starting a direct chat with the user
  const handleStartChat = () => {
    if (currentUserData) {
      onStartDirectChat(currentUserData.id);
      setProfilePopoverAnchor(null); // Close the popover
    }
  };

  // Clear any avatar timeouts on unmount
  useEffect(() => {
    return () => {
      clearAvatarTimeout();
    };
  }, []);

  // Handle summarize button click
  const handleSummarize = async () => {
    if (message.summary) {
      // If we already have a summary, just show it
      setMessageSummary(message.summary);

      // If summary is long, show in dialog, otherwise tooltip will display it
      if (message.summary.length > 80) {
        setSummaryDialogOpen(true);
      }
      return;
    }

    // Otherwise generate a new summary
    setIsSummarizing(true);
    try {
      const summary = await aiSummarizeMessage(message.text, message.id);
      setMessageSummary(summary);

      // Also cache the summary in the message object
      message.summary = summary;

      // If summary is long, show in dialog
      if (summary.length > 80) {
        setSummaryDialogOpen(true);
      }
    } catch (error) {
      console.error("Error summarizing message:", error);
      // Use fallback
      const fallbackSummary = message.text.substring(0, 50) + "...";
      setMessageSummary(fallbackSummary);
      message.summary = fallbackSummary;
    } finally {
      setIsSummarizing(false);
    }
  };

  // Close summary dialog
  const handleCloseSummaryDialog = () => {
    setSummaryDialogOpen(false);
  };

  // Add delete handlers
  const handleDeleteForMe = () => {
    onDelete(message.id, "me");
    setMobileActionsOpen(false);
    setDeleteAnchorEl(null); // Close the delete menu
  };

  const handleDeleteForEveryone = () => {
    onDelete(message.id, "everyone");
    setMobileActionsOpen(false);
    setDeleteAnchorEl(null); // Close the delete menu
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isCurrentUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        mb: 2,
        maxWidth: "100%",
        px: { xs: 1, sm: 2 },
        position: "relative",
      }}
    >
      {isPinned && (
        <Box
          sx={{
            position: "absolute",
            top: -8,
            right: isCurrentUser ? -8 : "auto",
            left: isCurrentUser ? "auto" : -8,
            transform: "rotate(45deg)",
            color: "#26A69A",
            zIndex: 2,
          }}
        >
          <PushPinIcon fontSize="small" />
        </Box>
      )}

      {!isCurrentUser && (
        <Box
          ref={avatarRef}
          onClick={handleAvatarClick}
          onMouseEnter={handleAvatarHover}
          onMouseLeave={handleAvatarLeave}
          sx={{
            cursor: "pointer",
            borderRadius: "50%",
            position: "relative",
          }}
        >
          <Avatar
            sx={{
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              mr: 1,
              fontSize: { xs: "0.75rem", sm: "1rem" },
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            {message.senderName.substring(0, 1)}
          </Avatar>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: isCurrentUser ? "flex-end" : "flex-start",
          position: "relative",
          width: "auto",
          maxWidth: "80%",
          overflow: "visible",
        }}
      >
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
          ref={messageRef}
          onMouseEnter={() =>
            !isMobile && !isMessageDeleted && setShowActions(true)
          }
          onMouseLeave={() => !isMobile && setShowActions(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          sx={{
            p: 1.5,
            maxWidth: "100%",
            minWidth: "30px",
            wordBreak: "break-word",
            borderRadius: 2,
            transition: "background-color 0.2s",
            position: "relative",
            bgcolor: isMessageDeleted
              ? theme.palette.mode === "dark"
                ? "rgba(64, 64, 64, 0.5)"
                : "rgba(240, 240, 240, 0.5)"
              : isCurrentUser
              ? theme.palette.primary.main
              : theme.palette.background.paper,
            color: isMessageDeleted
              ? theme.palette.text.secondary
              : isCurrentUser
              ? "#fff"
              : theme.palette.text.primary,
            borderTopRightRadius: isCurrentUser ? 4 : 20,
            borderTopLeftRadius: isCurrentUser ? 20 : 4,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            mr: isCurrentUser ? 1 : 0,
            ml: isCurrentUser ? 0 : 1,
            boxShadow: isHighlighted
              ? `0 0 0 2px ${theme.palette.warning.main}`
              : isPinned
              ? `0 0 0 1px ${theme.palette.primary.main}`
              : 1,
            animation:
              lastSentMessageId === message.id
                ? `${messageSlideIn} 0.3s ease-out`
                : "none",
            opacity: isMessageDeleted ? 0.8 : 1,
          }}
        >
          {/* Forwarded message info */}
          {message.forwardedFrom && (
            <ForwardedMessageInfo
              chatName={message.forwardedFrom.chatName}
              senderName={message.forwardedFrom.senderName}
            />
          )}

          {/* Reply to message content */}
          {message.replyToId && replyToMessage && (
            <ReplyMessageContent
              replyMessage={replyToMessage}
              isCurrentUserMessage={isCurrentUser}
            />
          )}

          {message.media && (
            <Box sx={{ mb: 1 }}>
              <MediaPreview
                media={message.media}
                onMediaViewed={onMediaViewed}
              />
            </Box>
          )}

          {isMessageDeleted ? (
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                color: "text.disabled",
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
              }}
            >
              {isDeletedForEveryone
                ? "This message was deleted"
                : "You deleted this message"}
            </Typography>
          ) : (
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
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Desktop action buttons on hover */}
            {!isMobile && !isMessageDeleted && (
              <Fade in={showActions}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    position: "absolute",
                    bottom: "100%",
                    left: 0,
                    mb: 0.5,
                    zIndex: 10,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 1,
                    p: 0.5,
                    minWidth: "fit-content",
                    whiteSpace: "nowrap",
                    overflow: "visible",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={handleReactionClick}
                    sx={{
                      p: 0.5,
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.12)"
                            : "secondary.light",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? "#fff"
                            : theme.palette.text.primary,
                      },
                    }}
                  >
                    <AddReactionIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onReply(message.id)}
                    sx={{
                      p: 0.5,
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.12)"
                            : "secondary.light",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? "#fff"
                            : theme.palette.text.primary,
                      },
                    }}
                  >
                    <ReplyIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onForward(message.id)}
                    sx={{
                      p: 0.5,
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.12)"
                            : "secondary.light",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? "#fff"
                            : theme.palette.text.primary,
                      },
                    }}
                  >
                    <ForwardIcon fontSize="small" />
                  </IconButton>
                  {/* Add Summarize button for messages longer than 100 characters */}
                  {message.text.length > 100 && (
                    <Tooltip
                      title={
                        isSummarizing
                          ? "Generating summary..."
                          : messageSummary && messageSummary.length <= 80
                          ? messageSummary
                          : "Summarize"
                      }
                      arrow
                      sx={{
                        maxWidth: { xs: "100%", md: "600px" },
                        "& .MuiTooltip-tooltip": {
                          bgcolor: "#FF6F61",
                          color: "white",
                          fontSize: "0.8rem",
                          px: 1.5,
                          py: 1,
                          borderRadius: 1,
                        },
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={handleSummarize}
                        disabled={isSummarizing}
                        sx={{
                          p: 0.5,
                          fontSize: "0.75rem",
                          color: (theme) =>
                            isSummarizing
                              ? "text.disabled"
                              : theme.palette.mode === "dark"
                              ? "#fff"
                              : theme.palette.text.primary,
                          "&:hover": {
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.12)"
                                : "secondary.light",
                            color: (theme) =>
                              isSummarizing
                                ? "text.disabled"
                                : theme.palette.mode === "dark"
                                ? "#fff"
                                : theme.palette.text.primary,
                          },
                        }}
                      >
                        <DescriptionIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => onSave(message.id)}
                    sx={{
                      p: 0.5,
                      fontSize: "0.75rem",
                      color: (theme) =>
                        message.isSaved
                          ? "#FFC107"
                          : theme.palette.mode === "dark"
                          ? "#fff"
                          : theme.palette.text.primary,
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.12)"
                            : "secondary.light",
                        color: (theme) =>
                          message.isSaved
                            ? "#FFC107"
                            : theme.palette.mode === "dark"
                            ? "#fff"
                            : theme.palette.text.primary,
                      },
                    }}
                  >
                    {message.isSaved ? (
                      <BookmarkIcon fontSize="small" />
                    ) : (
                      <BookmarkBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handlePinMessage}
                    sx={{
                      p: 0.5,
                      fontSize: "0.75rem",
                      color: (theme) =>
                        isPinned
                          ? "#26A69A"
                          : theme.palette.mode === "dark"
                          ? "#fff"
                          : theme.palette.text.primary,
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.12)"
                            : "secondary.light",
                        color: (theme) =>
                          isPinned
                            ? "#26A69A"
                            : theme.palette.mode === "dark"
                            ? "#fff"
                            : theme.palette.text.primary,
                      },
                    }}
                  >
                    <PushPinIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Show context menu for delete options
                      setDeleteAnchorEl(e.currentTarget);
                    }}
                    sx={{
                      p: 0.5,
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.12)"
                            : "secondary.light",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? "#fff"
                            : theme.palette.text.primary,
                      },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Fade>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {isCurrentUser && getStatusIcon()}
              <Typography
                variant="caption"
                sx={{
                  textAlign: "right",
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                  opacity: 0.8,
                }}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Emoji Reactions - Always horizontally stacked */}
        {Object.keys(groupedReactions).length > 0 && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              mt: 0.5,
              ml: isCurrentUser ? 0 : 1,
              mr: isCurrentUser ? 1 : 0,
              flexWrap: "wrap",
              gap: 0.5,
            }}
          >
            {Object.entries(groupedReactions).map(([emoji, count]) => (
              <Chip
                key={emoji}
                label={`${emoji} ${count}`}
                size="small"
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "secondary.main",
                  color: "text.primary",
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  height: "auto",
                  py: 0.25,
                  px: { xs: 0.5, sm: 0 },
                  borderRadius: "16px",
                  opacity: 0.8,
                  "&:hover": {
                    opacity: 1,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.16)"
                        : "secondary.light",
                  },
                  "& .MuiChip-label": { px: 1 },
                }}
                onClick={() => handleAddReaction(emoji as IReaction["emoji"])}
                onMouseEnter={(e) =>
                  !isMobile && handleShowReactionDetails(e, emoji)
                }
                onMouseLeave={!isMobile ? handleHideReactionDetails : undefined}
                onTouchStart={(e) =>
                  isMobile &&
                  handleShowReactionDetails(
                    {
                      currentTarget: e.currentTarget,
                      clientX: e.touches[0].clientX,
                      clientY: e.touches[0].clientY,
                    } as unknown as React.MouseEvent<HTMLElement>,
                    emoji
                  )
                }
                onTouchEnd={isMobile ? handleHideReactionDetails : undefined}
              />
            ))}
          </Stack>
        )}

        {/* Desktop Emoji Reaction Picker Popper */}
        {!isMobile && (
          <Popper
            open={open}
            anchorEl={anchorEl}
            placement="top"
            sx={{ zIndex: 1300 }}
          >
            <ClickAwayListener onClickAway={handleCloseReactions}>
              <Paper
                elevation={3}
                sx={{
                  p: 1,
                  display: "flex",
                  flexDirection: "row",
                  gap: 0.5,
                  borderRadius: "20px",
                  bgcolor: "background.paper",
                }}
              >
                {AVAILABLE_REACTIONS.map(({ emoji, label }) => (
                  <IconButton
                    key={emoji}
                    onClick={() =>
                      handleAddReaction(emoji as IReaction["emoji"])
                    }
                    size="small"
                    title={label}
                    sx={{
                      fontSize: "1.2rem",
                      p: 0.5,
                    }}
                  >
                    {emoji}
                  </IconButton>
                ))}
              </Paper>
            </ClickAwayListener>
          </Popper>
        )}

        {/* Reaction Details Popover */}
        <Popover
          open={reactionDetailsOpen}
          anchorEl={reactionDetailsAnchor}
          onClose={handleHideReactionDetails}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{ pointerEvents: "none" }}
        >
          <Paper sx={{ p: 1.5, maxWidth: 200 }}>
            {currentReactionDetails.users.map((user, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{ fontSize: "0.85rem" }}
              >
                {user}
              </Typography>
            ))}
          </Paper>
        </Popover>

        {/* Delete options menu */}
        <Menu
          anchorEl={deleteAnchorEl}
          open={Boolean(deleteAnchorEl)}
          onClose={() => setDeleteAnchorEl(null)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <MenuItem onClick={handleDeleteForMe} sx={{ minWidth: 150 }}>
            <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
            Delete for me
          </MenuItem>
          {isCurrentUser && (
            <MenuItem onClick={handleDeleteForEveryone} sx={{ minWidth: 150 }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete for everyone
            </MenuItem>
          )}
        </Menu>

        {/* Mobile Action Bottom Sheet */}
        {isMobile && (
          <SwipeableDrawer
            anchor="bottom"
            open={mobileActionsOpen}
            onClose={() => setMobileActionsOpen(false)}
            onOpen={() => setMobileActionsOpen(true)}
            disableSwipeToOpen
            PaperProps={{
              sx: {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Message Actions
              </Typography>

              {/* Emoji Reactions */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  React with
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {AVAILABLE_REACTIONS.map(({ emoji, label }) => (
                    <IconButton
                      key={emoji}
                      onClick={() =>
                        handleAddReaction(emoji as IReaction["emoji"])
                      }
                      size="large"
                      title={label}
                      sx={{
                        fontSize: "1.5rem",
                        p: 1.5,
                        bgcolor: "background.default",
                      }}
                    >
                      {emoji}
                    </IconButton>
                  ))}
                </Box>
              </Box>

              <List sx={{ p: 0 }}>
                <ListItem button onClick={handleMobileReply} sx={{ py: 2 }}>
                  <ListItemIcon>
                    <ReplyIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reply" />
                </ListItem>
                <ListItem button onClick={handleMobileForward} sx={{ py: 2 }}>
                  <ListItemIcon>
                    <ForwardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Forward" />
                </ListItem>
                <ListItem button onClick={handleMobileSave} sx={{ py: 2 }}>
                  <ListItemIcon>
                    <BookmarkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Save" />
                </ListItem>
                <ListItem button onClick={handleMobilePin} sx={{ py: 2 }}>
                  <ListItemIcon>
                    <PushPinIcon
                      sx={{ color: isPinned ? "#26A69A" : "inherit" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={isPinned ? "Unpin Message" : "Pin Message"}
                  />
                </ListItem>
                {message.text.length > 100 && (
                  <ListItem
                    button
                    onClick={handleMobileSummarize}
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Summarize" />
                  </ListItem>
                )}
              </List>

              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Delete options
                </Typography>
                <List disablePadding>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDeleteForMe}>
                      <ListItemIcon>
                        <DeleteOutlineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Delete for me" />
                    </ListItemButton>
                  </ListItem>
                  {isCurrentUser && (
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleDeleteForEveryone}>
                        <ListItemIcon>
                          <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Delete for everyone" />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </Box>
            </Box>
          </SwipeableDrawer>
        )}
      </Box>

      {/* Avatar Preview Dialog */}
      {currentUserData && (
        <AvatarPreview
          open={avatarPreviewOpen}
          onClose={() => setAvatarPreviewOpen(false)}
          name={currentUserData.name}
          avatar={currentUserData.avatar}
          status={currentUserData.status}
          email={currentUserData.email}
          lastSeen={currentUserData.lastSeen}
          isOnline={currentUserData.isOnline}
        />
      )}

      {/* User Profile Popover */}
      {currentUserData && (
        <UserProfilePopover
          open={isProfilePopoverOpen}
          anchorEl={profilePopoverAnchor}
          onClose={() => setProfilePopoverAnchor(null)}
          user={currentUserData}
          onStartChat={handleStartChat}
          currentUserId="user1" // Current user ID
          clearAvatarTimeout={clearAvatarTimeout}
        />
      )}

      {/* Summary Dialog for longer summaries */}
      <Dialog
        open={summaryDialogOpen}
        onClose={handleCloseSummaryDialog}
        maxWidth="md"
        PaperProps={{
          sx: {
            width: { xs: "100%", md: "600px" },
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#FF6F61",
            color: "white",
            borderRadius: "8px 8px 0 0",
            py: 1.5,
          }}
        >
          Message Summary
        </DialogTitle>
        <DialogContent sx={{ mt: 2, mb: 1 }}>
          {isSummarizing ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <Typography>Generating summary...</Typography>
            </Box>
          ) : (
            <Typography variant="body1">{messageSummary}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSummaryDialog}
            sx={{
              color: "#FF6F61",
              "&:hover": { bgcolor: "rgba(255, 111, 97, 0.08)" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Message;
