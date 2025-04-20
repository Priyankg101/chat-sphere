import { FC } from "react";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

interface ThemeSwitcherProps {
  toggleTheme: () => void;
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ toggleTheme }) => {
  const theme = useTheme();

  return (
    <Tooltip
      title={
        theme.palette.mode === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
    >
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          ml: 1,
          p: { xs: 1, sm: 1.5 },
          borderRadius: "50%",
          color: "inherit",
        }}
        aria-label="toggle theme"
      >
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeSwitcher;
