import { FC, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { IChat } from "../types/chat";
import { IMessage } from "../types/message";

interface ForwardMessageDialogProps {
  open: boolean;
  onClose: () => void;
  chats: IChat[];
  messageToForward: IMessage | null;
  onForward: (messageId: string, targetChatId: string) => void;
}

const ForwardMessageDialog: FC<ForwardMessageDialogProps> = ({
  open,
  onClose,
  chats,
  messageToForward,
  onForward,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleForward = () => {
    if (messageToForward && selectedChatId) {
      onForward(messageToForward.id, selectedChatId);
      onClose();
    }
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.groupName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (messageToForward ? chat.id !== messageToForward.chatId : true)
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          maxHeight: isMobile ? "100%" : "80vh",
          borderRadius: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
          >
            Forward Message
          </Typography>
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1 }}>
        <TextField
          fullWidth
          placeholder="Search chats"
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
            mb: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messageToForward && (
          <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Message to forward:
            </Typography>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "background.default",
                border: 1,
                borderColor: "divider",
                mb: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                {messageToForward.senderName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {messageToForward.text}
              </Typography>
            </Box>
            <Divider />
          </Box>
        )}

        <Typography
          variant="subtitle2"
          sx={{
            px: { xs: 2, sm: 3 },
            pt: 1,
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
          }}
        >
          Select a chat to forward to:
        </Typography>

        {filteredChats.length > 0 ? (
          <List sx={{ pt: 0, pb: 1, px: 0 }}>
            {filteredChats.map((chat) => (
              <ListItem
                button
                key={chat.id}
                selected={selectedChatId === chat.id}
                onClick={() => handleSelectChat(chat.id)}
                sx={{
                  py: { xs: 1, sm: 1.5 },
                  px: { xs: 2, sm: 3 },
                  "&.Mui-selected": {
                    bgcolor: "secondary.light",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: { xs: 40, sm: 45 },
                      height: { xs: 40, sm: 45 },
                    }}
                  >
                    {chat.groupName.substring(0, 1)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      {chat.groupName}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      }}
                    >
                      {chat.members?.length || 0} members
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 3,
              flexGrow: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No chats found matching "{searchQuery}"
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 500 }}>
          Cancel
        </Button>
        <Button
          onClick={handleForward}
          variant="contained"
          disabled={!selectedChatId}
          sx={{ px: 2 }}
        >
          Forward
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForwardMessageDialog;
