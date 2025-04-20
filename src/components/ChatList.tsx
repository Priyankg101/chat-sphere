import { FC, useState, useMemo } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import SearchIcon from "@mui/icons-material/Search";
import { IChat } from "../types/chat";
import { formatDistanceToNow } from "date-fns";
import NewChatMenu from "./NewChatMenu";
import { mockUsers } from "../mockData";

interface ChatListProps {
  chats: IChat[];
  selectedChat?: IChat;
  onSelectChat: (chat: IChat) => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onCreateChat?: (chat: IChat) => void;
}

const ChatList: FC<ChatListProps> = ({
  chats,
  selectedChat,
  onSelectChat,
  onSearch = () => {},
  searchQuery = "",
  onCreateChat,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // Use either the external search query or the local one
  const effectiveSearchQuery = searchQuery || localSearchQuery;

  // Get last message text for display
  const getLastMessageText = (chat: IChat): string => {
    if (typeof chat.lastMessage === "string") {
      // This shouldn't happen with our current IChat interface
      return "No message";
    } else {
      return chat.lastMessage.text;
    }
  };

  // Get timestamp for display
  const getTimestamp = (chat: IChat): number => {
    if (typeof chat.lastMessage === "string") {
      // This shouldn't happen with our current IChat interface
      return chat.timestamp;
    } else {
      return chat.lastMessage.timestamp;
    }
  };

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!effectiveSearchQuery.trim()) {
      // If no search query, just sort by timestamp
      return [...chats].sort((a, b) => getTimestamp(b) - getTimestamp(a));
    }

    const query = effectiveSearchQuery.toLowerCase().trim();

    // Filter and then sort by timestamp
    const filtered = chats.filter((chat) => {
      // Check if query matches chat name
      if (chat.groupName.toLowerCase().includes(query)) {
        return true;
      }

      // Check if query matches last message
      if (typeof chat.lastMessage === "string") {
        // This condition shouldn't be hit with our current IChat interface
        // but kept for backward compatibility
        return false;
      } else if (chat.lastMessage.text.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });

    // Sort filtered chats by timestamp (newest first)
    return filtered.sort((a, b) => getTimestamp(b) - getTimestamp(a));
  }, [chats, effectiveSearchQuery]);

  // Highlight matching text with a coral background
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <Box
              component="span"
              key={i}
              sx={{
                bgcolor: "#FF6F61",
                color: "white",
                borderRadius: "2px",
                px: 0.5,
              }}
            >
              {part}
            </Box>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setLocalSearchQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Conversations</Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search chats & messages..."
          value={effectiveSearchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              px: 1,
              py: 0.5,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "divider",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
              width: { xs: "100%", md: "95%" },
              mx: { xs: 0, md: "2.5%" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              height: { xs: 44, sm: "auto" },
              "& input": {
                py: { xs: 0.5, sm: 1 },
              },
            },
          }}
        />
      </Box>

      <List
        sx={{
          width: "100%",
          overflow: "auto",
          flexGrow: 1,
        }}
      >
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ListItem
              key={chat.id}
              alignItems="flex-start"
              button
              selected={chat.id === selectedChat?.id}
              onClick={() => onSelectChat(chat)}
              sx={{
                borderRadius: 1,
                m: 0.5,
                "&.Mui-selected": {
                  bgcolor: "action.selected",
                },
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  color="primary"
                  badgeContent={chat.unreadCount}
                  invisible={!chat.unreadCount}
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.6rem",
                      height: 16,
                      minWidth: 16,
                    },
                  }}
                >
                  <Avatar
                    src={chat.avatar}
                    alt={chat.groupName}
                    sx={{ bgcolor: "primary.main" }}
                  >
                    {chat.groupName.charAt(0)}
                  </Avatar>
                </Badge>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: chat.unreadCount ? 600 : 400,
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        maxWidth: "180px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {effectiveSearchQuery
                        ? highlightMatch(chat.groupName, effectiveSearchQuery)
                        : chat.groupName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        minWidth: { xs: "50px", sm: "60px" },
                        textAlign: "right",
                      }}
                    >
                      {formatDistanceToNow(getTimestamp(chat), {
                        addSuffix: false,
                      })}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: chat.unreadCount ? 500 : 400,
                        fontSize: { xs: "0.75rem", sm: "0.8rem" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: { xs: "190px", sm: "210px" },
                        flex: 1,
                      }}
                    >
                      {effectiveSearchQuery
                        ? highlightMatch(
                            getLastMessageText(chat),
                            effectiveSearchQuery
                          )
                        : getLastMessageText(chat)}
                    </Typography>
                    {chat.muted && (
                      <Tooltip title="Muted" arrow>
                        <VolumeOffIcon
                          fontSize="small"
                          sx={{
                            ml: 0.5,
                            fontSize: "1rem",
                            color: "text.disabled",
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 3,
            }}
          >
            <Typography color="text.secondary" align="center">
              {effectiveSearchQuery
                ? `No chats found matching "${effectiveSearchQuery}"`
                : "No chats available"}
            </Typography>
          </Box>
        )}
      </List>

      <NewChatMenu
        users={mockUsers.filter((user) => user.id !== "user1")} // Exclude current user
        onCreateIndividualChat={(userId) => {
          // Find if chat already exists
          const existingChat = chats.find(
            (chat) =>
              chat.type === "individual" &&
              chat.participants.includes(userId) &&
              chat.participants.includes("user1")
          );

          if (existingChat) {
            onSelectChat(existingChat);
          } else {
            // Create a new chat
            const user = mockUsers.find((u) => u.id === userId);
            if (user) {
              const newChat: IChat = {
                id: `new-chat-${Date.now()}`,
                type: "individual",
                groupName: user.name,
                participants: ["user1", userId],
                timestamp: Date.now(),
                lastMessage: {
                  text: "Start a conversation",
                  timestamp: Date.now(),
                },
                unreadCount: 0,
                members: [
                  { id: "user1", name: "You" },
                  { id: user.id, name: user.name },
                ],
                avatar: user.avatar,
              };

              if (onCreateChat) {
                onCreateChat(newChat);
              }
            }
          }
        }}
        onCreateGroupChat={(name, userIds, groupAvatar) => {
          // Create a new group chat
          const members = [
            { id: "user1", name: "You", isAdmin: true },
            ...userIds.map((userId) => {
              const user = mockUsers.find((u) => u.id === userId);
              return { id: userId, name: user?.name || `User ${userId}` };
            }),
          ];

          const newGroupChat: IChat = {
            id: `new-group-${Date.now()}`,
            type: "group",
            groupName: name,
            participants: ["user1", ...userIds],
            timestamp: Date.now(),
            lastMessage: {
              text: "Group created",
              timestamp: Date.now(),
            },
            unreadCount: 0,
            members,
            avatar: groupAvatar,
          };

          if (onCreateChat) {
            onCreateChat(newGroupChat);
          }
        }}
      />
    </Box>
  );
};

export default ChatList;
