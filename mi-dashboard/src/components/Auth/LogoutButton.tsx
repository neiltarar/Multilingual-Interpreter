import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import { Button, Box } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import myTheme from "../Layout/myTheme";

const StyledSignOutButton = styled(Button)(({ theme }) => ({
	"color": "#000",
	"border": "none",
	"outline": "none",
	"boxShadow": "none",
	"borderRadius": "1.5rem",
	"margin": "0.1rem 0.5rem",
	"fontSize": "1rem",
	"fontWeight": "bold",
	"height": "2.5rem",
	"&:hover": {
		transform: "scale(1.15)",
		boxShadow: "none",
		border: "none",
		outline: "none",
	},
	"&:active": {
		boxShadow: "inset 3px 3px 3px #b8b9be, inset -3px -3px 3px #ffffff",
	},
}));

const LogoutButton = () => {
	//@ts-ignore
	const { signout } = useAuth();

	return (
		<ThemeProvider theme={myTheme}>
			<StyledSignOutButton size='small' onClick={signout} variant='outlined'>
				Sign Out
			</StyledSignOutButton>
		</ThemeProvider>
	);
};

export default LogoutButton;
