import { createTheme } from "@mui/material/styles";

const myTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#007AFF",
			contrastText: "#FFFFFF",
		},
		secondary: {
			main: "#34C759",
			contrastText: "#FFFFFF",
		},
		error: {
			main: "#FF3B30",
		},
		background: {
			default: "#F0F0F0",
			paper: "#FFFFFF", // Surface color
		},
		text: {
			primary: "#000000",
			secondary: "#8E8E93",
		},
	},
	typography: {
		fontFamily:
			"'SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
		h1: {
			fontSize: "2rem",
			fontWeight: "bold",
			color: "#000000",
			textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)", // subtle shadow
		},
		h2: {
			fontSize: "1.5rem",
			fontWeight: "bold",
			color: "#000000", // Black
		},
		h3: {
			fontSize: "1.25rem",
			fontWeight: "bold",
			color: "#000000", // Black
		},
		h4: {
			fontSize: "1.125rem",
			fontWeight: "bold",
			color: "#000000", // Black
		},
		h5: {
			fontSize: "1.0625rem",
			fontWeight: "bold",
			color: "#000000", // Black
		},
		h6: {
			fontSize: "1rem",
			fontWeight: "bold",
			color: "#000000", // Black
		},
		subtitle1: {
			fontSize: "1rem",
			color: "#8E8E93", // iOS Gray
		},
		body1: {
			fontSize: "1rem",
			color: "#000000", // Black
		},
		body2: {
			fontSize: "0.875rem",
			color: "#000000", // Black
		},
		button: {
			textTransform: "none",
			fontSize: "0.875rem",
			fontWeight: "bold",
			color: "#007AFF", // iOS Blue
		},
	},
	components: {
		// Rounded corners
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: "12px",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: "12px",
				},
			},
		},
	},
});

export default myTheme;
