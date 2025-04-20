import { FC, useState, useRef } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

// Default avatar options
const DEFAULT_AVATARS = [
  // Colorful gradients for default avatar backgrounds
  "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "#26A69A", // Teal
  "#5E35B1", // Deep Purple
  "#FB8C00", // Orange
  "#2196F3", // Blue
];

interface AvatarUploadProps {
  initialImage?: string;
  onImageSelected: (imageUrl: string | undefined) => void;
  size?: number;
  label?: string;
}

const AvatarUpload: FC<AvatarUploadProps> = ({
  initialImage,
  onImageSelected,
  size = 64,
  label = "Upload Image",
}) => {
  const [image, setImage] = useState<string | undefined>(initialImage);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImage(imageUrl);
        onImageSelected(imageUrl);
      };
      reader.readAsDataURL(file);
    }
    handleClose();
  };

  const handleSelectDefaultAvatar = (background: string) => {
    // For default avatars, we'll use a generated data URL with the background color/gradient
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Create a gradient or solid background
      if (background.includes("gradient")) {
        const grad = ctx.createLinearGradient(0, 0, 200, 200);

        // Extract colors from the gradient string
        const colors = background.match(/#[a-f0-9]{6}/gi);
        if (colors && colors.length >= 2) {
          grad.addColorStop(0, colors[0]);
          grad.addColorStop(1, colors[1]);
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = background;
        }
      } else {
        ctx.fillStyle = background;
      }

      // Fill with background
      ctx.fillRect(0, 0, 200, 200);

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png");
      setImage(dataUrl);
      onImageSelected(dataUrl);
    }

    handleClose();
  };

  const handleRemoveImage = () => {
    setImage(undefined);
    onImageSelected(undefined);
    handleClose();
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Tooltip title={label} arrow>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            src={image}
            sx={{
              width: size,
              height: size,
              fontSize: size / 2,
              cursor: "pointer",
              bgcolor: image ? "transparent" : "primary.main",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
            onClick={handleClick}
          >
            {!image && <EmojiEmotionsIcon />}
          </Avatar>
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": { bgcolor: "background.default" },
            }}
            onClick={handleClick}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Tooltip>

      {label && (
        <Typography
          variant="caption"
          display="block"
          mt={1}
          color="text.secondary"
        >
          {label}
        </Typography>
      )}

      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem
          onClick={() => fileInputRef.current?.click()}
          sx={{ minWidth: 150 }}
        >
          <PhotoCameraIcon fontSize="small" sx={{ mr: 1 }} />
          Upload Photo
        </MenuItem>

        <MenuItem
          onClick={handleRemoveImage}
          disabled={!image}
          sx={{ minWidth: 150 }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Remove Photo
        </MenuItem>

        {/* Default avatar options */}
        {DEFAULT_AVATARS.map((background, index) => (
          <MenuItem
            key={index}
            onClick={() => handleSelectDefaultAvatar(background)}
            sx={{
              justifyContent: "center",
              py: 0.5,
              display: "inline-flex",
              width: "33%",
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background,
                fontSize: 14,
              }}
            >
              {index + 1}
            </Avatar>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default AvatarUpload;
