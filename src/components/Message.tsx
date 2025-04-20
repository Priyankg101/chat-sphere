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
  Theme,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Popover,
} from "@mui/material";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import ReplyIcon from "@mui/icons-material/Reply";
import ForwardIcon from "@mui/icons-material/Forward";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IMessage, IReaction } from "../types/message";
import MediaPreview from "./MediaPreview";

interface MessageProps {
  message: IMessage;
  isCurrentUser?: boolean;
  onReply?: (messageId: string) => void;
  onForward?: (messageId: string) => void;
  onSave?: (messageId: string) => void;
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
  onReply = () => {},
  onForward = () => {},
  onSave = () => {},
}) => {
  // State for reaction picker popper
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reactions, setReactions] = useState<IReaction[]>(
    message.reactions?.length
      ? message.reactions
      : [
          // Add default reaction for testing
          {
            emoji: "❤️",
            userId: "user2",
            timestamp: Date.now() - 60000,
          },
          {
            emoji: "👍",
            userId: "user3",
            timestamp: Date.now() - 120000,
          },
        ]
  );
  const [showActions, setShowActions] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [reactionDetailsAnchor, setReactionDetailsAnchor] =
    useState<null | HTMLElement>(null);
  const [currentReactionDetails, setCurrentReactionDetails] = useState<{
    emoji: string;
    users: string[];
  }>({ emoji: "", users: [] });
  const reactionButtonRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

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
      setLongPressTimer(timer);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
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

  // Group reactions by emoji for display
  const groupedReactions = reactions.reduce<Record<string, number>>(
    (acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    },
    {}
  );

  const open = Boolean(anchorEl);
  const reactionDetailsOpen = Boolean(reactionDetailsAnchor);

  // Mobile action handlers with drawer closure
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
        maxWidth: { xs: "85%", sm: "70%" },
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
            bgcolor: isCurrentUser ? "primary.light" : "background.default",
            color: isCurrentUser ? "primary.contrastText" : "text.primary",
            maxWidth: "100%",
            position: "relative",
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

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 0.5,
            }}
          >
            {/* Desktop action buttons on hover */}
            {!isMobile && (
              <Fade in={showActions}>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={handleReactionClick}
                    sx={{
                      p: 0.5,
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      bgcolor: "background.paper",
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
                      bgcolor: "background.paper",
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
                      bgcolor: "background.paper",
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
                      color: "text.secondary",
                      bgcolor: "background.paper",
                      "&:hover": { bgcolor: "secondary.light" },
                    }}
                  >
                    <BookmarkIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Fade>
            )}
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
                  bgcolor: "secondary.main",
                  color: "text.primary",
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  height: "auto",
                  py: 0.25,
                  px: { xs: 0.5, sm: 0 },
                  borderRadius: "16px",
                  opacity: 0.8,
                  "&:hover": { opacity: 1 },
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
                    e as React.MouseEvent<HTMLElement>,
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
              </List>
            </Box>
          </SwipeableDrawer>
        )}
      </Box>
    </Box>
  );
};

export default Message;
