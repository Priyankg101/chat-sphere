import { FC, useState } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import SearchIcon from "@mui/icons-material/Search";
import { IUser } from "../types/user";
import { IChat } from "../types/chat";
import { v4 as uuidv4 } from "uuid";

interface DirectMessageButtonProps {
  users: IUser[];
  onCreateChat: (chat: IChat) => void;
  currentChats: IChat[];
  currentUserId: string;
  position?: {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
  };
}

const DirectMessageButton: FC<DirectMessageButtonProps> = ({
  users,
  onCreateChat,
  currentChats,
  currentUserId,
  position = { bottom: 24, right: 100 },
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSearchQuery("");
  };

  const handleUserSelect = (user: IUser) => {
    // Check if chat already exists
    const existingChat = currentChats.find(
      (chat) =>
        chat.type === "individual" &&
        chat.participants.includes(user.id) &&
        chat.participants.includes(currentUserId)
    );

    if (existingChat) {
      // If chat exists, just notify the parent
      onCreateChat(existingChat);
    } else {
      // Create a new chat
      const newChat: IChat = {
        id: uuidv4(),
        groupName: user.name,
        participants: [currentUserId, user.id],
        type: "individual",
        lastMessage: {
          text: "Start a conversation",
          timestamp: Date.now(),
        },
        timestamp: Date.now(),
        unreadCount: 0,
        members: [
          { id: currentUserId, name: "You" },
          { id: user.id, name: user.name },
        ],
        avatar: user.avatar,
      };

      onCreateChat(newChat);
    }

    handleCloseDialog();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.id !== currentUserId &&
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Tooltip title="Start a direct message">
        <IconButton
          onClick={handleOpenDialog}
          sx={{
            bgcolor: "secondary.main",
            color: "white",
            position: "absolute",
            ...position,
            width: 50,
            height: 50,
            "&:hover": {
              bgcolor: "secondary.dark",
            },
            boxShadow: 3,
          }}
        >
          <MessageIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Start Direct Message</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search contacts"
            type="text"
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <ListItem
                  button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  sx={{
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    mb: 0.5,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      sx={{ bgcolor: user.avatar ? undefined : "primary.main" }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={
                      user.isOnline
                        ? "Online"
                        : user.lastSeen
                        ? `Last seen ${new Date(
                            user.lastSeen
                          ).toLocaleTimeString()}`
                        : "Offline"
                    }
                    primaryTypographyProps={{
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: "center" }}>
                No contacts found matching "{searchQuery}"
              </Box>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DirectMessageButton;
