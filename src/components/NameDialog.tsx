import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  Paper,
  styled,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import logo from "../assets/logo_with_name.png";

interface NameDialogProps {
  open: boolean;
  onSubmit: (name: string) => void;
}

// Create a styled backdrop for the blur effect
const BlurBackdrop = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: theme.zIndex.modal - 1,
  backdropFilter: "blur(8px)",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.7)"
      : "rgba(255, 255, 255, 0.7)",
}));

/**
 * Fade & slide-up animation for the card using framer-motion.
 */
const fadeVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      scale: {
        type: "spring",
        damping: 15,
        stiffness: 300,
      },
    },
  },
};

const NameDialog: React.FC<NameDialogProps> = ({ open, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <>
      {/* Custom backdrop with blur effect */}
      {open && <BlurBackdrop />}

      {/* Dialog with no backdrop of its own */}
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.modal,
          "& .MuiDialog-container": {
            backdropFilter: "none",
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "transparent",
          },
        }}
        hideBackdrop
      >
        <DialogContent sx={{ p: 0, backgroundColor: "transparent" }}>
          <motion.div variants={fadeVariant} initial="hidden" animate="visible">
            <Paper
              elevation={12}
              sx={{
                p: { xs: 3, sm: 6 },
                borderRadius: 3,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(24, 24, 24, 1)" // Full opacity
                    : "rgba(255, 255, 255, 1)", // Full opacity
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 12px 40px 5px rgba(0, 0, 0, 0.5)"
                    : "0 12px 40px 5px rgba(31, 38, 135, 0.2)",
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(255, 255, 255, 0.7)"
                }`,
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="ChatSphere logo"
                sx={{
                  width: isMobile ? 160 : 220,
                  height: "auto",
                  display: "block",
                  mx: "auto",
                  mb: 3,
                }}
              />

              <Typography
                variant={isMobile ? "body1" : "h6"}
                sx={{
                  textAlign: "center",
                  color: theme.palette.text.secondary,
                  mb: 4,
                }}
              >
                Connect, chat, and collaborate in real-time.
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="Your Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  error={!!error}
                  helperText={error}
                  autoFocus
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Enter ChatSphere
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NameDialog;
