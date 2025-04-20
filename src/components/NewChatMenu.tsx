import { FC, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
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
  Typography,
  Checkbox,
  InputAdornment,
  Paper,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { IUser } from "../types/user";
import AvatarUpload from "./AvatarUpload";

interface NewChatMenuProps {
  onCreateIndividualChat: (userId: string) => void;
  onCreateGroupChat: (
    name: string,
    userIds: string[],
    groupAvatar?: string
  ) => void;
  users: IUser[];
}

const NewChatMenu: FC<NewChatMenuProps> = ({
  onCreateIndividualChat,
  onCreateGroupChat,
  users,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isIndividualChatOpen, setIsIndividualChatOpen] = useState(false);
  const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupAvatar, setGroupAvatar] = useState<string | undefined>(undefined);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenIndividualChat = () => {
    setIsIndividualChatOpen(true);
    handleClose();
  };

  const handleOpenGroupChat = () => {
    setIsGroupChatOpen(true);
    handleClose();
  };

  const handleCloseIndividualChat = () => {
    setIsIndividualChatOpen(false);
    setSearchQuery("");
  };

  const handleCloseGroupChat = () => {
    setIsGroupChatOpen(false);
    setGroupName("");
    setSelectedUsers([]);
    setSearchQuery("");
    setGroupAvatar(undefined);
  };

  const handleIndividualChatSelect = (userId: string) => {
    onCreateIndividualChat(userId);
    handleCloseIndividualChat();
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      onCreateGroupChat(groupName, selectedUsers, groupAvatar);
      handleCloseGroupChat();
    }
  };

  const handleToggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          bgcolor: "primary.main",
          color: "white",
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          "&:hover": {
            bgcolor: "primary.dark",
          },
          boxShadow: 3,
        }}
      >
        <AddIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleOpenIndividualChat}>
          <PersonAddIcon sx={{ mr: 1 }} />
          New Chat
        </MenuItem>
        <MenuItem onClick={handleOpenGroupChat}>
          <GroupAddIcon sx={{ mr: 1 }} />
          New Group
        </MenuItem>
      </Menu>

      {/* Individual Chat Dialog */}
      <Dialog
        open={isIndividualChatOpen}
        onClose={handleCloseIndividualChat}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Start New Chat</DialogTitle>
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
            {filteredUsers.map((user) => (
              <ListItem
                button
                key={user.id}
                onClick={() => handleIndividualChatSelect(user.id)}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar} alt={user.name}>
                    {user.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={user.status || "Available"}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIndividualChat}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Group Chat Dialog */}
      <Dialog
        open={isGroupChatOpen}
        onClose={handleCloseGroupChat}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mb: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <AvatarUpload
              initialImage={groupAvatar}
              onImageSelected={setGroupAvatar}
              size={80}
              label="Group Avatar"
            />
          </Box>

          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            type="text"
            fullWidth
            variant="outlined"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Add Participants
          </Typography>

          <TextField
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

          <Paper
            variant="outlined"
            sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}
          >
            <List>
              {filteredUsers.map((user) => (
                <ListItem
                  button
                  key={user.id}
                  onClick={() => handleToggleUser(user.id)}
                  sx={{
                    bgcolor: selectedUsers.includes(user.id)
                      ? "rgba(38, 166, 154, 0.08)"
                      : "transparent",
                  }}
                >
                  <Checkbox
                    edge="start"
                    checked={selectedUsers.includes(user.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemAvatar>
                    <Avatar src={user.avatar} alt={user.name}>
                      {user.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={user.status || "Available"}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {selectedUsers.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selected ({selectedUsers.length})
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {selectedUsers.map((userId) => {
                  const user = users.find((u) => u.id === userId);
                  return (
                    user && (
                      <Chip
                        key={userId}
                        avatar={
                          <Avatar src={user.avatar} alt={user.name}>
                            {user.name.charAt(0)}
                          </Avatar>
                        }
                        label={user.name}
                        onDelete={() => handleToggleUser(userId)}
                        color="primary"
                        variant="outlined"
                      />
                    )
                  );
                })}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGroupChat}>Cancel</Button>
          <Button
            onClick={handleCreateGroup}
            color="primary"
            disabled={!groupName.trim() || selectedUsers.length === 0}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewChatMenu;
