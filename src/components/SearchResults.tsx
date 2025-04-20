import { FC, useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
  Collapse,
  InputBase,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IMessage } from "../types/message";
import { IChat } from "../types/chat";
import { formatDistanceToNow } from "date-fns";

interface SearchResultsProps {
  searchQuery: string;
  onClose: () => void;
  chats: IChat[];
  messages: IMessage[];
  onSelectResult: (messageId: string, chatId: string) => void;
  onClearSearch: () => void;
  onUpdateQuery: (query: string) => void;
}

interface MessageResult {
  message: IMessage;
  chat: IChat;
}

const SearchResults: FC<SearchResultsProps> = ({
  searchQuery,
  onClose,
  chats,
  messages,
  onSelectResult,
  onClearSearch,
  onUpdateQuery,
}) => {
  const [results, setResults] = useState<MessageResult[]>([]);
  const [expandedChats, setExpandedChats] = useState<Record<string, boolean>>(
    {}
  );
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Add debounce timer reference
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Search messages when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    // Find all messages that match the query
    const matchingMessages = messages.filter((msg) =>
      msg.text.toLowerCase().includes(query)
    );

    // Group messages by chat
    const messageResults = matchingMessages
      .map((message) => {
        const chat = chats.find((c) => c.id === message.chatId) as IChat;
        return { message, chat };
      })
      .filter((result) => result.chat); // Filter out any messages with no associated chat

    // Sort by timestamp, newest first
    messageResults.sort((a, b) => b.message.timestamp - a.message.timestamp);

    setResults(messageResults);

    // Initialize expanded state for all chats with results
    const initialExpandedState: Record<string, boolean> = {};
    messageResults.forEach(({ chat }) => {
      if (!initialExpandedState[chat.id]) {
        initialExpandedState[chat.id] = true; // Start with all expanded
      }
    });
    setExpandedChats(initialExpandedState);

    setLocalQuery(searchQuery);
  }, [searchQuery, messages, chats]);

  // Handle toggling chat expansion
  const toggleChatExpansion = (chatId: string) => {
    setExpandedChats((prev) => ({
      ...prev,
      [chatId]: !prev[chatId],
    }));
  };

  // Handle search input changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setLocalQuery(newQuery);

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer (300ms debounce)
    debounceTimerRef.current = setTimeout(() => {
      // Update the search query after the debounce period
      onUpdateQuery(newQuery);
    }, 300);
  };

  // Clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Keep this to prevent page refresh if Enter is pressed
  };

  // Handle search clearing
  const handleClearSearch = () => {
    setLocalQuery("");
    onClearSearch();
  };

  // Group results by chat
  const resultsByChat = results.reduce<Record<string, MessageResult[]>>(
    (acc, result) => {
      const chatId = result.chat.id;
      if (!acc[chatId]) {
        acc[chatId] = [];
      }
      acc[chatId].push(result);
      return acc;
    },
    {}
  );

  // Count total results
  const totalResults = results.length;

  // Highlight matching text
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
      {/* Search Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton edge="start" onClick={onClose} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Search Results</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({totalResults})
          </Typography>
        </Box>

        {/* Search Box */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "action.hover",
            borderRadius: 2,
            px: 2,
            py: 0.5,
          }}
        >
          <SearchIcon color="action" sx={{ mr: 1 }} />
          <InputBase
            placeholder="Search messages..."
            fullWidth
            value={localQuery}
            onChange={handleSearchChange}
            sx={{ fontSize: "0.9rem" }}
            autoFocus
          />
          {localQuery && (
            <IconButton size="small" onClick={handleClearSearch}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Search Results */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {totalResults === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 3,
              textAlign: "center",
            }}
          >
            <SearchIcon
              sx={{ fontSize: "3rem", color: "text.secondary", mb: 2 }}
            />
            {searchQuery ? (
              <Typography variant="body1" color="text.secondary">
                No messages found matching "{searchQuery}"
              </Typography>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Enter a search term to find messages
              </Typography>
            )}
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {Object.entries(resultsByChat).map(([chatId, chatResults]) => (
              <Box key={chatId}>
                <ListItem
                  button
                  onClick={() => toggleChatExpansion(chatId)}
                  sx={{ bgcolor: "background.default", py: 1 }}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={chatResults.length}
                      color="primary"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "0.6rem",
                          height: "16px",
                          minWidth: "16px",
                        },
                      }}
                    >
                      <Avatar src={chatResults[0].chat.avatar}>
                        {chatResults[0].chat.groupName.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {chatResults[0].chat.type === "group" ? (
                          <GroupIcon
                            fontSize="small"
                            sx={{
                              mr: 0.5,
                              fontSize: "0.9rem",
                              color: "primary.main",
                            }}
                          />
                        ) : (
                          <PersonIcon
                            fontSize="small"
                            sx={{
                              mr: 0.5,
                              fontSize: "0.9rem",
                              color: "text.secondary",
                            }}
                          />
                        )}
                        <Typography variant="subtitle1">
                          {chatResults[0].chat.groupName}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {chatResults.length}{" "}
                        {chatResults.length === 1 ? "message" : "messages"}{" "}
                        found
                      </Typography>
                    }
                  />
                  {expandedChats[chatId] ? (
                    <KeyboardArrowUpIcon color="action" />
                  ) : (
                    <KeyboardArrowDownIcon color="action" />
                  )}
                </ListItem>

                <Collapse in={expandedChats[chatId]}>
                  <List disablePadding>
                    {chatResults.map((result) => (
                      <ListItem
                        key={result.message.id}
                        button
                        onClick={() =>
                          onSelectResult(result.message.id, result.chat.id)
                        }
                        sx={{
                          pl: 6,
                          pr: 2,
                          py: 1,
                          borderLeft: "3px solid transparent",
                          "&:hover": {
                            borderLeft: "3px solid",
                            borderLeftColor: "primary.main",
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>{result.message.senderName}</span>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDistanceToNow(result.message.timestamp, {
                                  addSuffix: true,
                                })}
                              </Typography>
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.5,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "100%",
                              }}
                            >
                              {highlightMatch(result.message.text, searchQuery)}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
                <Divider />
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default SearchResults;
