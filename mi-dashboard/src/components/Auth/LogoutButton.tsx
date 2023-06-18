import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@mui/material";

const LogoutButton = () => {
	//@ts-ignore
	const { signout } = useAuth();

	return (
		<div style={{ position: "fixed", top: "20px", right: "30px" }}>
			<Button onClick={signout} variant='contained' color='primary'>
				Sign Out
			</Button>
		</div>
	);
};

export default LogoutButton;
