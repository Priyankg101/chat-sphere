import { FC } from "react";
import { Box, Typography, useTheme, Paper } from "@mui/material";

interface TypingIndicatorProps {
  typingUsers?: string[];
}

const TypingIndicator: FC<TypingIndicatorProps> = ({ typingUsers = [] }) => {
  const theme = useTheme();

  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} is typing`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0]} and ${typingUsers[1]} are typing`;
    } else if (typingUsers.length === 3) {
      return `${typingUsers[0]}, ${typingUsers[1]}, and ${typingUsers[2]} are typing`;
    } else {
      return `${typingUsers.length} people are typing`;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        maxWidth: { xs: "85%", sm: "70%" },
        mt: 0.5,
        mb: 0.5,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 1,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.03)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mr: 1, fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
        >
          {getTypingText()}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: { xs: 4, sm: 6 },
              height: { xs: 4, sm: 6 },
              borderRadius: "50%",
              backgroundColor: theme.palette.primary.main,
              opacity: 0.7,
              mx: 0.5,
              animation: "pulse 1.4s infinite ease-in-out",
              animationDelay: "0s",
              "@keyframes pulse": {
                "0%, 100%": {
                  transform: "scale(1)",
                  opacity: 0.5,
                },
                "50%": {
                  transform: "scale(1.1)",
                  opacity: 1,
                },
              },
            }}
          />
          <Box
            sx={{
              width: { xs: 4, sm: 6 },
              height: { xs: 4, sm: 6 },
              borderRadius: "50%",
              backgroundColor: theme.palette.primary.main,
              opacity: 0.7,
              mx: 0.5,
              animation: "pulse 1.4s infinite ease-in-out",
              animationDelay: "0.2s",
              "@keyframes pulse": {
                "0%, 100%": {
                  transform: "scale(1)",
                  opacity: 0.5,
                },
                "50%": {
                  transform: "scale(1.1)",
                  opacity: 1,
                },
              },
            }}
          />
          <Box
            sx={{
              width: { xs: 4, sm: 6 },
              height: { xs: 4, sm: 6 },
              borderRadius: "50%",
              backgroundColor: theme.palette.primary.main,
              opacity: 0.7,
              mx: 0.5,
              animation: "pulse 1.4s infinite ease-in-out",
              animationDelay: "0.4s",
              "@keyframes pulse": {
                "0%, 100%": {
                  transform: "scale(1)",
                  opacity: 0.5,
                },
                "50%": {
                  transform: "scale(1.1)",
                  opacity: 1,
                },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TypingIndicator;
