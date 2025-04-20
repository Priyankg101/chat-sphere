import { FC, useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Switch,
  Divider,
  useMediaQuery,
  Theme,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IChat } from "../types/chat";

interface GroupInfoProps {
  chat?: IChat;
  open: boolean;
  onClose: () => void;
  onMuteToggle?: (chatId: string, muted: boolean) => void;
}

const GroupInfo: FC<GroupInfoProps> = ({
  chat,
  open,
  onClose,
  onMuteToggle = () => {},
}) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  const [muted, setMuted] = useState(false);

  // Initialize muted state from chat object or localStorage
  useEffect(() => {
    if (chat) {
      // First check if the chat object has muted state
      if (chat.muted !== undefined) {
        setMuted(chat.muted);
      } else {
        // Otherwise check localStorage
        const mutedChats = localStorage.getItem("mutedChats");
        if (mutedChats) {
          const mutedChatsArray = JSON.parse(mutedChats) as string[];
          setMuted(mutedChatsArray.includes(chat.id));
        }
      }
    }
  }, [chat]);

  const handleMuteToggle = () => {
    if (!chat) return;

    const newMutedState = !muted;
    setMuted(newMutedState);

    // Update localStorage
    const mutedChats = localStorage.getItem("mutedChats");
    let mutedChatsArray: string[] = [];

    if (mutedChats) {
      mutedChatsArray = JSON.parse(mutedChats) as string[];
    }

    if (newMutedState) {
      // Add chat ID to muted list if not already there
      if (!mutedChatsArray.includes(chat.id)) {
        mutedChatsArray.push(chat.id);
      }
    } else {
      // Remove chat ID from muted list
      mutedChatsArray = mutedChatsArray.filter((id) => id !== chat.id);
    }

    localStorage.setItem("mutedChats", JSON.stringify(mutedChatsArray));

    // Notify parent component
    onMuteToggle(chat.id, newMutedState);
  };

  if (!chat) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : "400px",
          bgcolor: "background.paper",
          height: "100%",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography variant="h6" component="div">
            Group Info
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "#FF6F61" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Group Avatar and Name */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#26A69A",
              fontSize: "2rem",
              mb: 2,
            }}
          >
            {chat.groupName.substring(0, 1)}
          </Avatar>
          <Typography variant="h5" align="center" sx={{ mb: 1 }}>
            {chat.groupName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 2 }}
          >
            {chat.members?.length || 0} members
          </Typography>
        </Box>

        {/* Mute Notification Toggle */}
        <Box
          sx={{
            bgcolor: "background.default",
            p: 2,
            borderRadius: 1,
            mb: 3,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={muted}
                onChange={handleMuteToggle}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#26A69A",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#26A69A",
                  },
                }}
              />
            }
            label="Mute Notifications"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Members List */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 500, mb: 1, color: "#26A69A" }}
        >
          Members
        </Typography>
        <List sx={{ flexGrow: 1, overflow: "auto" }}>
          {chat.members?.map((member, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: member.isAdmin ? "#FF6F61" : "primary.main",
                  }}
                >
                  {member.name.substring(0, 1)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={member.name}
                secondary={member.isAdmin ? "Admin" : null}
                primaryTypographyProps={{
                  fontWeight: member.isAdmin ? 500 : 400,
                }}
                secondaryTypographyProps={{
                  color: "#FF6F61",
                  fontWeight: 500,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default GroupInfo;
