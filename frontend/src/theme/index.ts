import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2457d6",
      dark: "#183fa6",
      light: "#eaf0ff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#d2a84b",
      dark: "#a87d25",
      light: "#fff6df",
    },
    background: {
      default: "#f5f7fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#14213d",
      secondary: "#61708a",
    },
    divider: "#e3e8f1",
  },
  typography: {
    fontFamily:
      'Inter, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: "clamp(2rem, 4vw, 3.75rem)",
      fontWeight: 750,
      lineHeight: 1.08,
      letterSpacing: "-0.045em",
    },
    h2: {
      fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
      fontWeight: 750,
      lineHeight: 1.15,
      letterSpacing: "-0.035em",
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minWidth: 320,
          minHeight: "100vh",
          WebkitFontSmoothing: "antialiased",
        },
        "*": {
          boxSizing: "border-box",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 54,
          borderRadius: 12,
          backgroundColor: "#ffffff",
          transition: "box-shadow 160ms ease, background-color 160ms ease",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9aabc6",
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 4px rgba(36, 87, 214, 0.1)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
          },
        },
        notchedOutline: {
          borderColor: "#ccd5e3",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#61708a",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "none",
          "&.MuiButton-containedPrimary": {
            boxShadow: "0 10px 24px rgba(36, 87, 214, 0.22)",
            "&:hover": {
              boxShadow: "0 12px 28px rgba(36, 87, 214, 0.3)",
            },
          },
        },
      },
    },
  },
});
