import React, { ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import myTheme from "./myTheme";

interface DefaultLayoutProps {
	children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
	return (
		<ThemeProvider theme={myTheme}>
			<Box
				sx={{
					mt: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					textAlign: "center",
					minHeight: "100vh",
					bgcolor: myTheme.palette.common.white,
					color: myTheme.palette.primary.main,
				}}
			>
				<Typography variant='h6' component='h1' gutterBottom>
					Universal Translator
				</Typography>
				<Box>{children}</Box>
			</Box>
		</ThemeProvider>
	);
};

export default DefaultLayout;
