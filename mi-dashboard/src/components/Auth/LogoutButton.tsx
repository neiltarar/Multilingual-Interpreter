import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import { Button, Box } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import myTheme from "../Layout/myTheme";

const StyledSignOutButton = styled(Button)(({ theme }) => ({
	"color": theme.palette.primary.main,
	"borderColor": theme.palette.primary.main,
	"fontSize": "0.8rem",
	"fontWeight": "bold",
	"height": "2.5rem",
	"textTransform": "none",
	"boxShadow": "5px 5px 15px #b8b9be, -5px -5px 15px #ffffff",
	"&:hover": {
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.common.white,
		borderColor: theme.palette.secondary.main,
		transform: "scale(1.05)",
		boxShadow: "none",
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
			<Box
				sx={{ "& button": { m: 1 } }}
				style={{
					position: "fixed",
					top: "20px",
					right: "30px",
				}}
			>
				<StyledSignOutButton size='small' onClick={signout} variant='outlined'>
					Sign Out
				</StyledSignOutButton>
			</Box>
		</ThemeProvider>
	);
};

export default LogoutButton;
