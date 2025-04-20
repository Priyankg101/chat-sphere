import React, { useRef } from "react";
import { Popover, Box, Typography, Avatar, Button, Paper } from "@mui/material";
import { IUser } from "../types/user";

interface UserProfilePopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  user: IUser | null;
  onStartChat?: (userId: string) => void;
  currentUserId?: string;
  clearAvatarTimeout?: () => void;
}

const UserProfilePopover: React.FC<UserProfilePopoverProps> = ({
  open,
  anchorEl,
  onClose,
  user,
  onStartChat = () => {},
  currentUserId = "",
  clearAvatarTimeout = () => {},
}) => {
  // Use ref to track if mouse is inside the popover
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    // Clear the timeout that would close the popover
    clearAvatarTimeout();
  };

  const handleMouseLeave = () => {
    // Close the popover when mouse leaves
    onClose();
  };

  if (!user) return null;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 2,
          boxShadow: 3,
          mt: 0.5,
        },
        pointerEvents: "none", // This ensures mouse events pass through the popover container
      }}
    >
      <Box
        ref={popoverRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          pointerEvents: "auto", // This re-enables pointer events for the content
        }}
      >
        <Paper
          sx={{
            p: 2,
            width: { xs: 200, sm: 250 },
            maxWidth: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mb: 1,
                fontSize: "1.5rem",
                bgcolor: "primary.main",
              }}
            >
              {user.name.substring(0, 1)}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {user.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: user.isOnline ? "success.main" : "text.disabled",
                }}
              />
              {user.isOnline ? "Online" : "Offline"}
            </Typography>
            {user.status && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: "center" }}
              >
                {user.status}
              </Typography>
            )}
          </Box>

          {user.id !== currentUserId && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                onStartChat(user.id);
                onClose();
              }}
              sx={{ borderRadius: 2 }}
            >
              Message
            </Button>
          )}
        </Paper>
      </Box>
    </Popover>
  );
};

export default UserProfilePopover;
