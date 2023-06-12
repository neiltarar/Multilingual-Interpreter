import React from "react";
import { Box } from "@mui/material";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<Box
			display='flex'
			justifyContent='center'
			alignItems='center'
			minHeight='100vh'
		>
			<div className='layout'>{children}</div>
		</Box>
	);
};

export default Layout;
