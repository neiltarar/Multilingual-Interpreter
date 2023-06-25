import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../Layout";
import Button from "@mui/material/Button";
import LogoutButton from "../Auth/LogoutButton";
import { useVoice } from "../../contexts/VoiceContext";
import { useAuth } from "../../contexts/AuthContext";
import DefaultLayout from "../Layout/DefaultLayout";
import soundWaveGif from "../../assets/waves.gif";

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
		isRecording,
		//@ts-ignore
		transcription,
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
		<DefaultLayout>
			<Layout>
				<LogoutButton />
				<div style={{ position: "relative", display: "inline-block" }}>
					<Button
						variant='contained'
						color='primary'
						onMouseDown={handleButtonPress}
						onMouseUp={handleButtonRelease}
						onTouchStart={handleButtonPress}
						onTouchEnd={handleButtonRelease}
						sx={{
							borderRadius: "50%",
							height: "80px",
							width: "80px",
							minWidth: "80px",
						}}
					>
						Hold to translate
					</Button>
					{isRecording && (
						<img
							src={soundWaveGif}
							alt='sound wave'
							style={{
								position: "absolute",
								bottom: "100%",
								height: "100%",
								width: "200%",
								left: "-50%",
								marginBottom: "20px",
							}}
						/>
					)}

					{transcription && (
						<>
							<h1>Turkish:</h1>
							<div
								style={{ position: "absolute", width: "400%", left: "-150%" }}
							>
								{transcription
									.split("\n")
									.map((sentence: string, index: number) => (
										<p>{sentence}</p>
									))}
							</div>
						</>
					)}
				</div>
			</Layout>
		</DefaultLayout>
	);
};

export default Home;
