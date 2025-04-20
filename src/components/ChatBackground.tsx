import { FC } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export type BackgroundType = "gradient" | "wave" | "solid";

interface ChatBackgroundProps {
  backgroundType: BackgroundType;
  opacity?: number;
}

// Wave pattern as base64 SVG (light, subtle design)
const waveSvgBase64 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxwYXRoIGQ9Ik0gMCAxMCBRIDEwIDIwIDIwIDEwIFQgNDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgzOCwgMTY2LCAxNTQsIDAuMTUpIiBzdHJva2Utd2lkdGg9IjEuNSI+PC9wYXRoPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIj48L3JlY3Q+PC9zdmc+";

const ChatBackground: FC<ChatBackgroundProps> = ({
  backgroundType,
  opacity = 1,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Determine background style based on type
  const getBackground = () => {
    switch (backgroundType) {
      case "gradient":
        return {
          background: isDarkMode
            ? `linear-gradient(135deg, rgba(38, 166, 154, 0.2), rgba(255, 111, 97, 0.2))`
            : `linear-gradient(135deg, rgba(38, 166, 154, 0.15), rgba(255, 111, 97, 0.15))`,
        };
      case "wave":
        return {
          backgroundImage: `url(${waveSvgBase64})`,
          backgroundRepeat: "repeat",
          backgroundSize: "400px 400px",
        };
      case "solid":
      default:
        return {
          backgroundColor: isDarkMode
            ? "rgba(30, 30, 30, 0.8)"
            : "rgba(236, 239, 241, 0.8)",
        };
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        opacity,
        transition: "all 0.3s ease",
        ...getBackground(),
      }}
    />
  );
};

// Thumbnail previews for the background selector
export const BackgroundThumbnails: Record<BackgroundType, React.ReactNode> = {
  gradient: (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #26A69A, #FF6F61)",
        borderRadius: 1,
      }}
    />
  ),
  wave: (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${waveSvgBase64})`,
        backgroundRepeat: "repeat",
        backgroundSize: "40px 40px",
        borderRadius: 1,
        backgroundColor: "#f5f5f5",
      }}
    />
  ),
  solid: (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#ECEFF1",
        borderRadius: 1,
      }}
    />
  ),
};

export default ChatBackground;
