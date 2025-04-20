import { FC, useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import AvatarUpload from "./AvatarUpload";
import { IUser } from "../types/user";

interface ProfileSettingsProps {
  currentUser: IUser;
  onUpdateProfile: (updatedUser: IUser) => void;
}

const ProfileSettings: FC<ProfileSettingsProps> = ({
  currentUser,
  onUpdateProfile,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [status, setStatus] = useState(currentUser.status || "");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    currentUser.avatar
  );

  // Update local state when prop changes
  useEffect(() => {
    setName(currentUser.name);
    setStatus(currentUser.status || "");
    setAvatarUrl(currentUser.avatar);
  }, [currentUser]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form if canceled
    setName(currentUser.name);
    setStatus(currentUser.status || "");
    setAvatarUrl(currentUser.avatar);
  };

  const handleSave = () => {
    const updatedUser: IUser = {
      ...currentUser,
      name,
      status,
      avatar: avatarUrl,
    };
    onUpdateProfile(updatedUser);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Edit Profile">
        <IconButton
          onClick={handleClickOpen}
          sx={{
            padding: 0.5,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: "divider",
            "&:hover": {
              backgroundColor: "action.hover",
              boxShadow: 1,
            },
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Box
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "light"
                      ? "grey.100"
                      : "background.paper",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: 1,
                }}
              >
                <EditIcon
                  sx={{
                    fontSize: 10,
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "common.black"
                        : "primary.main",
                  }}
                />
              </Box>
            }
          >
            {avatarUrl ? (
              <Box
                component="img"
                src={avatarUrl}
                alt={name}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
            ) : (
              <AccountCircleIcon
                sx={{
                  fontSize: 40,
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "grey.700"
                      : "primary.main",
                }}
              />
            )}
          </Badge>
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              my: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <AvatarUpload
              initialImage={avatarUrl}
              onImageSelected={setAvatarUrl}
              size={120}
              label="Profile Picture"
            />
          </Box>

          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 3 }}
          />

          <TextField
            margin="dense"
            label="Status"
            type="text"
            fullWidth
            variant="outlined"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="What's on your mind?"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary" disabled={!name.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileSettings;
