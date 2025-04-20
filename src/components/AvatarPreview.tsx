import { FC } from "react";
import {
  Dialog,
  Avatar,
  Box,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AvatarPreviewProps {
  open: boolean;
  onClose: () => void;
  name: string;
  avatar?: string;
  status?: string;
  email?: string;
  lastSeen?: number;
  isOnline?: boolean;
}

const AvatarPreview: FC<AvatarPreviewProps> = ({
  open,
  onClose,
  name,
  avatar,
  status = "Available",
  email,
  lastSeen,
  isOnline = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "#333333",
          color: "white",
          maxWidth: "400px",
          minWidth: { xs: "300px", sm: "350px", md: "400px" },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "relative",
          bgcolor: "#50a59e", // Teal color matching the screenshot
          color: "white",
          height: 120,
          width: "100%",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "white",
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content area with overlapping avatar */}
      <Box
        sx={{
          position: "relative",
          bgcolor: "#333333",
          pt: 8, // Space for the avatar
          pb: 3,
          px: 2,
          width: "100%",
          minHeight: "200px", // Ensure minimum height for content area
        }}
      >
        {/* Centered avatar that overlaps */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "transparent", // Ensure background is transparent
            borderRadius: "50%", // Make container circular like the avatar
            overflow: "hidden", // Prevent any content from extending outside
          }}
        >
          <Avatar
            src={avatar}
            alt={name}
            sx={{
              width: 120,
              height: 120,
              fontSize: "3rem",
              border: "4px solid #50a59e",
              backgroundColor: "#50a59e", // Changed boxShadow to backgroundColor
              outline: "none", // Remove any outline
            }}
          >
            {name.charAt(0)}
          </Avatar>
        </Box>

        {/* Name and status */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", mt: 1, fontWeight: 600 }}
          >
            {name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: isOnline ? "success.main" : "grey.500",
                mr: 1,
              }}
            />
            <Typography variant="body2" color="grey.400">
              {isOnline
                ? "Online"
                : lastSeen
                ? `Last seen ${new Date(lastSeen).toLocaleString()}`
                : "Offline"}
            </Typography>
          </Box>

          {/* Status box */}
          {status && (
            <Paper
              sx={{
                width: "100%",
                p: 2,
                borderRadius: 1,
                bgcolor: "#222222", // Darker background for the status box
                border: "1px solid #444444",
              }}
            >
              <Typography variant="caption" color="grey.500">
                Status
              </Typography>
              <Typography variant="body2" color="white">
                {status}
              </Typography>
            </Paper>
          )}

          {/* Email (if provided) */}
          {email && (
            <Paper
              sx={{
                width: "100%",
                p: 2,
                borderRadius: 1,
                bgcolor: "#222222",
                border: "1px solid #444444",
                mt: 2,
              }}
            >
              <Typography variant="caption" color="grey.500">
                Email
              </Typography>
              <Typography variant="body2" color="white">
                {email}
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default AvatarPreview;
