import { FC, useState, useEffect } from "react";
import {
  IconButton,
  Tooltip,
  useTheme,
  Menu,
  MenuItem,
  Box,
  Typography,
  Select,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PaletteIcon from "@mui/icons-material/Palette";
import { BackgroundType, BackgroundThumbnails } from "./ChatBackground";

interface ThemeSwitcherProps {
  toggleTheme: () => void;
  currentBackground?: BackgroundType;
  onChangeBackground?: (background: BackgroundType) => void;
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = ({
  toggleTheme,
  currentBackground = "solid",
  onChangeBackground = () => {},
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Load saved background preference
  useEffect(() => {
    try {
      const savedBackground = localStorage.getItem(
        "chatBackgroundType"
      ) as BackgroundType | null;
      if (
        savedBackground &&
        ["gradient", "wave", "solid"].includes(savedBackground)
      ) {
        onChangeBackground(savedBackground);
      }
    } catch (error) {
      console.error("Error loading background preference:", error);
    }
  }, [onChangeBackground]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeBackground = (event: SelectChangeEvent<string>) => {
    const newBackground = event.target.value as BackgroundType;
    onChangeBackground(newBackground);

    // Save to localStorage
    try {
      localStorage.setItem("chatBackgroundType", newBackground);
    } catch (error) {
      console.error("Error saving background preference:", error);
    }
  };

  return (
    <>
      <Tooltip title="Appearance settings">
        <IconButton
          onClick={handleClick}
          color="inherit"
          sx={{
            ml: 1,
            p: { xs: 1, sm: 1.5 },
            borderRadius: "50%",
            color: "inherit",
          }}
          aria-label="appearance settings"
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="appearance-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "appearance-button",
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 220,
            p: 1,
          },
        }}
      >
        <MenuItem onClick={toggleTheme} sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon fontSize="small" />
            ) : (
              <Brightness4Icon fontSize="small" />
            )}
            <Typography variant="body2">
              {theme.palette.mode === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"}
            </Typography>
          </Box>
        </MenuItem>

        <Box sx={{ px: 2, pb: 1, pt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Chat Background
          </Typography>

          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <Select
              value={currentBackground}
              onChange={handleChangeBackground}
              sx={{
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  py: 1,
                },
              }}
            >
              <MenuItem value="gradient">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 24, height: 24 }}>
                    {BackgroundThumbnails.gradient}
                  </Box>
                  <Typography variant="body2">Gradient</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="wave">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 24, height: 24 }}>
                    {BackgroundThumbnails.wave}
                  </Box>
                  <Typography variant="body2">Wave Pattern</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="solid">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 24, height: 24 }}>
                    {BackgroundThumbnails.solid}
                  </Box>
                  <Typography variant="body2">Solid Gray</Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Menu>
    </>
  );
};

export default ThemeSwitcher;
