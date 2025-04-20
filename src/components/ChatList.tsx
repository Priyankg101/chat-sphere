import { FC } from "react";
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
} from "@mui/material";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { IChat } from "../types/chat";

interface ChatListProps {
  chats: IChat[];
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
}

const ChatList: FC<ChatListProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
}) => {
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Typography
        variant="h6"
        sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
      >
        Conversations
      </Typography>
      <List
        sx={{
          width: "100%",
          overflow: "auto",
          maxHeight: { xs: "calc(100vh - 200px)", sm: "calc(100vh - 150px)" },
        }}
      >
        {chats.map((chat) => (
          <ListItem
            key={chat.id}
            alignItems="flex-start"
            button
            selected={chat.id === selectedChatId}
            onClick={() => onSelectChat(chat.id)}
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
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Avatar
                  alt={chat.groupName}
                  sx={{
                    width: { xs: 40, sm: 50 },
                    height: { xs: 40, sm: 50 },
                  }}
                >
                  {chat.groupName.substring(0, 1)}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: chat.unreadCount > 0 ? 600 : 400,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                  >
                    {chat.groupName}
                  </Typography>
                  {chat.muted && (
                    <Tooltip title="Notifications muted">
                      <VolumeOffIcon
                        sx={{
                          ml: 1,
                          fontSize: "0.85rem",
                          color: "#FF6F61",
                          opacity: 0.8,
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>
              }
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  {chat.lastMessage}
                </Typography>
              }
              secondaryTypographyProps={{ component: "div" }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                ml: 1,
                alignSelf: "flex-start",
              }}
            >
              {new Date(chat.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatList;
