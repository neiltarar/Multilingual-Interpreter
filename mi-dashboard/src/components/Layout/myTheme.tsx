import { createTheme } from "@mui/material/styles";

const myTheme = createTheme({
	palette: {
		primary: {
			main: "#607D8B", // Blue Grey
		},
		secondary: {
			main: "#FFC107", // Amber for contrast
		},
		error: {
			main: "#f44336", // Red
		},
		background: {
			default: "#F5F5F5", // Light Grey
		},
	},
	typography: {
		h1: {
			fontSize: "2.5rem",
			fontWeight: "bold",
		},
		h2: {
			fontSize: "2rem",
			fontWeight: "bold",
		},
		h3: {
			fontSize: "1.75rem",
			fontWeight: "bold",
		},
		h4: {
			fontSize: "1.5rem",
			fontWeight: "bold",
		},
		h5: {
			fontSize: "1.25rem",
			fontWeight: "bold",
		},
		h6: {
			fontSize: "1rem",
			fontWeight: "bold",
		},
		subtitle1: {
			fontSize: "0.875rem",
		},
		body1: {
			fontSize: "0.875rem",
		},
		body2: {
			fontSize: "0.75rem",
		},
		button: {
			textTransform: "none",
		},
	},
});

export default myTheme;
