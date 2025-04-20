import { FC, useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  IconButton,
  Paper,
  Avatar,
  useMediaQuery,
  useTheme,
  Drawer,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { IMessage } from "../types/message";
import { formatDistanceToNow } from "date-fns";

interface SavedMessagesProps {
  open: boolean;
  onClose: () => void;
  messages: IMessage[];
  onUnsaveMessage: (messageId: string) => void;
  onJumpToMessage: (messageId: string, chatId: string) => void;
}

const SavedMessages: FC<SavedMessagesProps> = ({
  open,
  onClose,
  messages,
  onUnsaveMessage,
  onJumpToMessage,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchQuery, setSearchQuery] = useState("");
  const [savedMessages, setSavedMessages] = useState<IMessage[]>([]);

  // Filter messages by search query
  useEffect(() => {
    setSavedMessages(
      messages.filter((msg) =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [messages, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleUnsave = (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUnsaveMessage(messageId);
  };

  // Sort messages by saved timestamp (newest first)
  const sortedMessages = [...savedMessages].sort(
    (a, b) => (b.savedAt || 0) - (a.savedAt || 0)
  );

  const drawerWidth = isMobile ? "100%" : 350;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
    >
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <BookmarkIcon sx={{ mr: 1.5, color: "primary.main" }} />
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
            >
              Saved Messages
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{ p: { xs: 1, sm: 2 }, borderBottom: 1, borderColor: "divider" }}
      >
        <TextField
          fullWidth
          placeholder="Search saved messages"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {sortedMessages.length > 0 ? (
        <List sx={{ overflow: "auto", px: 0, py: 1 }}>
          {sortedMessages.map((message, index) => (
            <Box key={message.id}>
              <ListItem
                button
                onClick={() => onJumpToMessage(message.id, message.chatId)}
                sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    width: "100%",
                    borderRadius: 2,
                    bgcolor: "background.default",
                    border: 1,
                    borderColor: "divider",
                    position: "relative",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        width: { xs: 32, sm: 36 },
                        height: { xs: 32, sm: 36 },
                        mr: 1.5,
                        fontSize: { xs: "0.8rem", sm: "0.9rem" },
                      }}
                    >
                      {message.senderName.substring(0, 1)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {message.senderName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {formatDistanceToNow(message.timestamp, {
                          addSuffix: true,
                        })}
                        {message.savedAt && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ color: "text.secondary", ml: 1 }}
                          >
                            • Saved{" "}
                            {formatDistanceToNow(message.savedAt, {
                              addSuffix: true,
                            })}
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleUnsave(message.id, e)}
                      sx={{ ml: 1 }}
                    >
                      <BookmarkBorderIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {message.text}
                  </Typography>
                </Paper>
              </ListItem>
              {index < sortedMessages.length - 1 && (
                <Divider
                  variant="inset"
                  component="li"
                  sx={{ ml: { xs: 1.5, sm: 2 } }}
                />
              )}
            </Box>
          ))}
        </List>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100% - 120px)",
            p: 3,
            textAlign: "center",
          }}
        >
          <BookmarkBorderIcon
            sx={{ fontSize: "3rem", color: "text.secondary", mb: 2 }}
          />
          {searchQuery ? (
            <Typography variant="body1" color="text.secondary">
              No saved messages found matching "{searchQuery}"
            </Typography>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>
                No saved messages yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bookmark important messages for easy access later
              </Typography>
            </>
          )}
        </Box>
      )}
    </Drawer>
  );
};

export default SavedMessages;
