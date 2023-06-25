import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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
	const [selectedLanguage, setSelectedLanguage] = useState("English");

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
			<LogoutButton />
			<div
				style={{
					height: "100%",
					marginTop: "6rem",
					position: "relative",
					display: "inline-block",
				}}
			>
				<Button
					variant='contained'
					color='primary'
					onMouseDown={() => handleButtonPress(selectedLanguage)}
					onMouseUp={() => handleButtonRelease()}
					sx={{
						borderRadius: "50%",
						height: "80px",
						width: "80px",
						minWidth: "80px",
					}}
				>
					Hold to translate
				</Button>
				<div style={{ margin: "1.5rem 0 1.5rem " }}>
					<select
						value={selectedLanguage}
						onChange={(e) => setSelectedLanguage(e.target.value)}
					>
						<option value='English'>English</option>
						<option value='Turkish'>Türkçe</option>
					</select>
				</div>
				{isRecording && (
					<img
						src={soundWaveGif}
						alt='sound wave'
						style={{
							position: "absolute",
							bottom: "100%",
							height: "70%",
							width: "200%",
							left: "-50%",
							marginBottom: "20px",
						}}
					/>
				)}

				{transcription && (
					<>
						<div style={{ position: "absolute", width: "400%", left: "-150%" }}>
							{transcription
								.split("\n")
								.map((sentence: string, index: number) => (
									<p>{sentence}</p>
								))}
						</div>
					</>
				)}
			</div>
		</DefaultLayout>
	);
};

export default Home;
