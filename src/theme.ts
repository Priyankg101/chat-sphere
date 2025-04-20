import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

// Create a theme instance
const getTheme = (mode: PaletteMode) => {
  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#26A69A", // Teal
      },
      secondary: {
        main: "#ECEFF1", // Soft gray
      },
      error: {
        main: "#FF6F61", // Coral accent
      },
      background: {
        default: mode === "light" ? "#FFFFFF" : "#121212",
        paper: mode === "light" ? "#F8F9FA" : "#1E1E1E",
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 16,
      h1: {
        fontSize: "2.5rem",
        "@media (max-width:600px)": {
          fontSize: "2rem",
        },
      },
      h2: {
        fontSize: "2rem",
        "@media (max-width:600px)": {
          fontSize: "1.75rem",
        },
      },
      h3: {
        fontSize: "1.75rem",
        "@media (max-width:600px)": {
          fontSize: "1.5rem",
        },
      },
      h4: {
        fontSize: "1.5rem",
        "@media (max-width:600px)": {
          fontSize: "1.25rem",
        },
      },
      h5: {
        fontSize: "1.25rem",
        "@media (max-width:600px)": {
          fontSize: "1.1rem",
        },
      },
      h6: {
        fontSize: "1.1rem",
        "@media (max-width:600px)": {
          fontSize: "1rem",
        },
      },
      body1: {
        fontSize: "1rem",
        "@media (max-width:600px)": {
          fontSize: "0.875rem",
        },
      },
      body2: {
        fontSize: "0.875rem",
        "@media (max-width:600px)": {
          fontSize: "0.75rem",
        },
      },
    },
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            "&:focus": {
              outline: "none",
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            "&:focus": {
              outline: "none",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            "&:focus": {
              outline: "none",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow:
              mode === "light"
                ? "0px 2px 8px rgba(0, 0, 0, 0.05)"
                : "0px 2px 8px rgba(0, 0, 0, 0.2)",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            "&:focus": {
              outline: "none",
            },
          },
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);

  return theme;
};

export default getTheme;
