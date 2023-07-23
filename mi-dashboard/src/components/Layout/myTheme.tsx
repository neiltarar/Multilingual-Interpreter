import { createTheme } from "@mui/material/styles";

const myTheme = createTheme({
	palette: {
		primary: {
			main: "#007AFF", // iOS Blue
		},
		secondary: {
			main: "#34C759", // iOS Green
		},
		error: {
			main: "#FF3B30", // iOS Red
		},
		background: {
			default: "#F0F0F0", // Light Gray
		},
		text: {
			primary: "#000000", // Black
			secondary: "#8E8E93", // iOS Gray
		},
	},
	typography: {
		fontFamily:
			"'SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
		h1: {
			fontSize: "2rem",
			fontWeight: "bold",
			color: "#000000", // Black
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
});

export default myTheme;
