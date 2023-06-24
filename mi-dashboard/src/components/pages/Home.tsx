import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../Layout";
import Button from "@mui/material/Button";
import LogoutButton from "../Auth/LogoutButton";
import { useVoice } from "../../contexts/VoiceContext";
import { useAuth } from "../../contexts/AuthContext";

const API_URL =
	process.env.NODE_ENV === "production"
		? process.env.REACT_APP_API_URL_DEPLOY
		: process.env.REACT_APP_API_URL_DEV;

interface Props {
	currentUser: { user: { name: string; id: number } };
}

const Home: React.FC = () => {
	const navigate = useNavigate();

	const {
		//@ts-ignore
		transcription,
		//@ts-ignore
		setTranscription,
		//@ts-ignore
		handleButtonPress,
		//@ts-ignore
		handleButtonRelease,
	} = useVoice();

	// @ts-ignore
	const { currentUser } = useAuth();

	useEffect(() => {
		if (!currentUser) {
			navigate("/signin");
		}
	}, [currentUser, navigate]);

	return (
		<Layout>
			<LogoutButton />
			<h1>Home Page</h1>
			<Button
				variant='contained'
				color='primary'
				onMouseDown={handleButtonPress}
				onMouseUp={handleButtonRelease}
				onTouchStart={handleButtonPress}
				onTouchEnd={handleButtonRelease}
			>
				Hold to Record
			</Button>
			{transcription ? (
				<>
					<h1>Turkish:</h1>
					<p>{transcription}</p>
				</>
			) : (
				<></>
			)}
		</Layout>
	);
};

export default Home;
