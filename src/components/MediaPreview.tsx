import { FC, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VideocamIcon from "@mui/icons-material/Videocam";
import CloseIcon from "@mui/icons-material/Close";
import { IMediaAttachment } from "../types/message";

interface MediaPreviewProps {
  media: IMediaAttachment;
}

const MediaPreview: FC<MediaPreviewProps> = ({ media }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Helper to format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleOpenDialog = () => {
    if (media.type === "image" || media.type === "video") {
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
              cursor: "pointer",
            }}
            onClick={handleOpenDialog}
          />
        );
      case "video":
        return (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxHeight: "200px",
              borderRadius: 1,
              cursor: "pointer",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.2)",
                zIndex: 1,
                borderRadius: 1,
              },
            }}
            onClick={handleOpenDialog}
          >
            <Box
              component="video"
              src={media.url}
              sx={{
                width: "100%",
                maxHeight: "200px",
                borderRadius: 1,
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                width: 44,
                height: 44,
              }}
            >
              <VideocamIcon />
            </Box>
          </Box>
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
    <>
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

      {/* Full Screen Dialog for Media Preview */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : "80%",
            height: isMobile ? "100%" : "auto",
            m: 0,
            borderRadius: isMobile ? 0 : 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "background.paper",
          }}
        >
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              width: 44,
              height: 44,
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {media.type === "image" && (
            <Box
              component="img"
              src={media.url}
              alt={media.name || "Image"}
              sx={{
                maxWidth: "100%",
                maxHeight: "calc(100vh - 64px)",
                objectFit: "contain",
              }}
            />
          )}

          {media.type === "video" && (
            <Box
              component="video"
              src={media.url}
              controls
              autoPlay
              sx={{
                maxWidth: "100%",
                maxHeight: "calc(100vh - 64px)",
              }}
            />
          )}

          {media.name && (
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: "rgba(0,0,0,0.5)",
                color: "white",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                maxWidth: "90%",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {media.name}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaPreview;
