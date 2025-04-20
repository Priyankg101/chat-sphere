import { Box, useTheme } from "@mui/material";

interface LogoProps {
  size?: number;
}

const Logo = ({ size = 40 }: LogoProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Outer circle */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          position: "absolute",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          boxShadow: `0 4px 20px rgba(33, 150, 243, 0.3)`,
        }}
      />

      {/* Inner speech bubble */}
      <Box
        sx={{
          width: "70%",
          height: "70%",
          borderRadius: "50%",
          position: "absolute",
          backgroundColor: isDark ? "#1a1a2e" : "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Small speech point */}
        <Box
          sx={{
            width: "30%",
            height: "30%",
            backgroundColor: isDark ? "#1a1a2e" : "white",
            position: "absolute",
            bottom: "-10%",
            right: "5%",
            borderRadius: "50%",
            transform: "rotate(45deg)",
          }}
        />
      </Box>

      {/* Small dot representing a message */}
      <Box
        sx={{
          width: "15%",
          height: "15%",
          borderRadius: "50%",
          backgroundColor: theme.palette.primary.main,
          position: "absolute",
          top: "30%",
          left: "30%",
        }}
      />
    </Box>
  );
};

export default Logo;
