import { FC } from "react";
import { Box, Paper, Typography } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";

interface MediaFile {
  type: "image" | "video" | "file";
  url: string;
  name?: string;
  size?: number;
}

interface MediaPreviewProps {
  media: MediaFile;
}

const MediaPreview: FC<MediaPreviewProps> = ({ media }) => {
  // Helper to format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderPreview = () => {
    switch (media.type) {
      case "image":
        return (
          <Box
            component="img"
            src={media.url}
            alt={media.name || "Image"}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: 1,
            }}
          />
        );
      case "video":
        return (
          <Box
            component="video"
            src={media.url}
            controls
            sx={{
              width: "100%",
              maxHeight: "200px",
              borderRadius: 1,
            }}
          />
        );
      case "file":
      default:
        return (
          <Paper
            sx={{
              p: 1.5,
              display: "flex",
              alignItems: "center",
              borderRadius: 1,
              bgcolor: "background.default",
              maxWidth: "100%",
            }}
          >
            <InsertDriveFileIcon sx={{ mr: 1 }} />
            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                }}
              >
                {media.name || "File"}
              </Typography>
              {media.size && (
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(media.size)}
                </Typography>
              )}
            </Box>
          </Paper>
        );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "300px",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {renderPreview()}
    </Box>
  );
};

export default MediaPreview;
