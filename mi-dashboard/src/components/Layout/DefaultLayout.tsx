import React, { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import myTheme from "./myTheme";
import Footer from "./Footer";
import LogoutButton from "../Auth/LogoutButton";

interface DefaultLayoutProps {
	children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
	return (
		<ThemeProvider theme={myTheme}>
			<Box
				className='main-page'
				height='100vh'
				display='flex'
				flexDirection='column'
				justifyContent='space-between'
				alignItems='center'
				width='100vw'
			>
				<Box
					className='main-page'
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						textAlign: "center",
						minWidth: "390px",
						bgcolor: myTheme.palette.common.white,
						color: myTheme.palette.primary.main,
					}}
				>
					<Box
						className='logout-button'
						sx={{
							display: "flex",
							justifyContent: "flex-end",
							width: "100vw",
							margin: {
								xs: "1rem 1rem 2rem 0",
								sm: "1rem 5rem 0 0",
							},
						}}
					>
						<LogoutButton />
					</Box>
					<Typography variant='h2' gutterBottom>
						Universal Translator
					</Typography>
					<Box>{children}</Box>
				</Box>
				<Footer />
			</Box>
		</ThemeProvider>
	);
};

export default DefaultLayout;
