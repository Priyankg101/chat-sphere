import { FC, useState, useRef, useEffect } from "react";
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
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IMediaAttachment } from "../types/message";

interface MediaPreviewProps {
  media: IMediaAttachment;
  onMediaViewed?: () => void;
}

const MediaPreview: FC<MediaPreviewProps> = ({ media, onMediaViewed }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if media has already been viewed (for viewOnce media)
  useEffect(() => {
    if (media.viewOnce) {
      const key = `viewed_media_${media.url.substring(0, 100)}`;
      const viewed = localStorage.getItem(key);
      if (viewed) {
        setHasBeenViewed(true);
      }
    }
  }, [media]);

  // Play video when dialog opens
  useEffect(() => {
    if (dialogOpen && videoRef.current && media.type === "video") {
      // Try to play the video
      const playPromise = videoRef.current.play();

      // Handle autoplay restrictions
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Auto-play prevented by browser:", error);
          // We let the user manually start playback using controls
        });
      }
    }
  }, [dialogOpen, media.type]);

  // Helper to format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleOpenDialog = () => {
    if (
      (media.type === "image" || media.type === "video") &&
      !(media.viewOnce && hasBeenViewed)
    ) {
      setDialogOpen(true);

      // Mark as viewed if it's view-once media
      if (media.viewOnce && !hasBeenViewed) {
        setHasBeenViewed(true);

        // Store in localStorage to persist viewed status
        const key = `viewed_media_${media.url.substring(0, 100)}`;
        localStorage.setItem(key, "true");

        // Notify parent component
        if (onMediaViewed) {
          onMediaViewed();
        }
      }
    }
  };

  const handleCloseDialog = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setDialogOpen(false);
  };

  const renderPreview = () => {
    // For view-once media that has been viewed
    if (media.viewOnce && hasBeenViewed) {
      return (
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.04)",
            height: 150,
            width: "100%",
          }}
        >
          <VisibilityOffIcon
            sx={{
              fontSize: 40,
              mb: 1,
              color: (theme) => theme.palette.text.secondary,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: (theme) => theme.palette.text.secondary,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            This {media.type} has already been viewed
          </Typography>
        </Paper>
      );
    }

    // For view-once media that hasn't been viewed yet - show placeholder instead of preview
    if (media.viewOnce && !hasBeenViewed) {
      return (
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.04)",
            height: 150,
            width: "100%",
            cursor: "pointer",
            border: "1px dashed rgba(0, 0, 0, 0.2)",
            position: "relative",
          }}
          onClick={handleOpenDialog}
        >
          {media.type === "image" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(38, 166, 154, 0.1)",
                  borderRadius: "50%",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/icons/camera.svg"
                  alt="Camera"
                  style={{ width: 32, height: 32, opacity: 0.7 }}
                  onError={(e) => {
                    // Fallback if custom icon is not available
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallbackIcon = document.createElement("div");
                      fallbackIcon.innerHTML = "📷";
                      fallbackIcon.style.fontSize = "32px";
                      parent.appendChild(fallbackIcon);
                    }
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                View once photo
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(38, 166, 154, 0.1)",
                  borderRadius: "50%",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VideocamIcon
                  sx={{ fontSize: 32, color: "rgba(0, 0, 0, 0.6)" }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                View once video
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              display: "flex",
              alignItems: "center",
              bgcolor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              borderRadius: 4,
              px: 1,
              py: 0.5,
            }}
          >
            <VisibilityOffIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">View once</Typography>
          </Box>
        </Paper>
      );
    }

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
              height: { xs: "180px", sm: "220px" },
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
                height: "100%",
                borderRadius: 1,
                zIndex: 0,
                objectFit: "cover",
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
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                {media.name || "File"}
              </Typography>
              {media.size && (
                <Typography
                  variant="caption"
                  sx={{
                    color: (theme) => theme.palette.text.secondary,
                  }}
                >
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
          position: "relative",
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
              playsInline
              ref={videoRef}
              sx={{
                width: "100%",
                height: isMobile ? "auto" : "calc(100vh - 200px)",
                maxHeight: "calc(100vh - 64px)",
                objectFit: "contain",
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
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                maxWidth: "90%",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
              }}
            >
              {media.name}
            </Typography>
          )}

          {media.viewOnce && (
            <Box
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                borderRadius: 4,
                px: 1.5,
                py: 0.5,
                zIndex: 5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <VisibilityOffIcon sx={{ fontSize: 18, mr: 0.75 }} />
              <Typography variant="caption" fontWeight={500}>
                View once only
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaPreview;
