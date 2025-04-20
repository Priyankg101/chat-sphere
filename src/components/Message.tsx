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
} from "@mui/material";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import ReplyIcon from "@mui/icons-material/Reply";
import ForwardIcon from "@mui/icons-material/Forward";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PushPinIcon from "@mui/icons-material/PushPin";
import { IMessage, IReaction, MessageStatus } from "../types/message";
import MediaPreview from "./MediaPreview";
import ReplyMessageContent from "./ReplyMessageContent";
import ForwardedMessageInfo from "./ForwardedMessageInfo";

interface MessageProps {
  message: IMessage;
  isCurrentUser?: boolean;
  isPinned?: boolean;
  onReply?: (messageId: string) => void;
  onForward?: (messageId: string) => void;
  onSave?: (messageId: string) => void;
  onPinMessage?: (messageId: string, isPinned: boolean) => void;
  isHighlighted?: boolean;
  replyToMessage?: IMessage | null;
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
  isHighlighted = false,
  replyToMessage = null,
}) => {
  // Use refs for various DOM elements
  const messageRef = useRef<HTMLDivElement>(null);
  // const textfieldRef = useRef<HTMLDivElement>(null);

  // Hooks for different features
  const [messageStatus, setMessageStatus] = useState<MessageStatus>("sent");
  const [showActions, setShowActions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [reactions, setReactions] = useState<IReaction[]>(
    message.reactions || []
  );

  // Mobile-specific state
  // const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchTimer, setTouchTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

  // Visual effect states
  const [isBlinking, setIsBlinking] = useState(isHighlighted);
  const [blinkCount, setBlinkCount] = useState(0);

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

  // const reactionButtonRef = useRef<HTMLButtonElement>(null);

  // Check if reaction details popover should be open
  const reactionDetailsOpen = Boolean(reactionDetailsAnchor);
  // Check if reaction picker should be open
  const open = Boolean(anchorEl);

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

  // Handle blinking effect when a message is highlighted from search results
  useEffect(() => {
    if (isHighlighted) {
      // Scroll the message into view
      messageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Start blinking effect
      setBlinkCount(4); // 2 complete blink cycles
      setIsBlinking(true);

      // Set up timer to stop blinking after all cycles complete
      const timer = setTimeout(() => {
        setIsBlinking(false);
      }, 1200); // 4 * 300ms = 1200ms total for all blinks

      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

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
    handlePinMessage();
    setMobileActionsOpen(false);
  };

  // Handle pin message action
  const handlePinMessage = () => {
    // Toggle pinned status using the prop value from parent
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
        maxWidth: { xs: "85%", sm: "70%" },
        mb: 1,
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: isCurrentUser ? "flex-end" : "flex-start",
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
          onMouseEnter={() => !isMobile && setShowActions(true)}
          onMouseLeave={() => !isMobile && setShowActions(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: isBlinking
              ? blinkCount % 2 === 0
                ? "#FF6F61"
                : "background.paper"
              : isCurrentUser
              ? "#26A69A"
              : "background.paper",
            color: isBlinking
              ? blinkCount % 2 === 0
                ? "white"
                : "text.primary"
              : isCurrentUser
              ? "white"
              : "text.primary",
            maxWidth: "100%",
            position: "relative",
            transition:
              "background-color 300ms ease, color 300ms ease, transform 200ms ease-out",
            ...(isPinned && {
              border: "1px solid #26A69A",
            }),
            ...(message.isSaved && {
              borderRight: "3px solid #FFC107",
            }),
            boxShadow: isCurrentUser
              ? "0 1px 2px rgba(38, 166, 154, 0.3)"
              : "0 1px 2px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              boxShadow: isCurrentUser
                ? "0 3px 6px rgba(38, 166, 154, 0.4)"
                : "0 3px 6px rgba(0, 0, 0, 0.15)",
            },
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
              <MediaPreview media={message.media} />
            </Box>
          )}

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

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Desktop action buttons on hover */}
            {!isMobile && (
              <Fade in={showActions}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    position: "absolute",
                    bottom: "100%",
                    left: 0,
                    mb: 0.5,
                    zIndex: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 1,
                    p: 0.5,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={handleReactionClick}
                    sx={{
                      p: 0.5,
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      "&:hover": { bgcolor: "secondary.light" },
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
                      "&:hover": { bgcolor: "secondary.light" },
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
                      "&:hover": { bgcolor: "secondary.light" },
                    }}
                  >
                    <ForwardIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onSave(message.id)}
                    sx={{
                      p: 0.5,
                      fontSize: "0.75rem",
                      color: message.isSaved ? "#FFC107" : "text.secondary",
                      "&:hover": { bgcolor: "secondary.light" },
                    }}
                  >
                    <BookmarkIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handlePinMessage}
                    sx={{
                      p: 0.5,
                      fontSize: "0.75rem",
                      color: isPinned ? "#26A69A" : "text.secondary",
                      "&:hover": { bgcolor: "secondary.light" },
                    }}
                  >
                    <PushPinIcon fontSize="small" />
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
                        ? "rgba(255, 255, 255, 0.12)"
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
              </List>
            </Box>
          </SwipeableDrawer>
        )}
      </Box>
    </Box>
  );
};

export default Message;
