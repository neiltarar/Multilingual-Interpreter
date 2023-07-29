import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useVoice } from "../../contexts/VoiceContext";
import { useAuth } from "../../contexts/AuthContext";
import DefaultLayout from "../Layout/DefaultLayout";
import SliderBar from "../Layout/SliderBar";
import FormControls from "../Layout/FormControls";
import PressToSpeakButton from "../Layout/PressToSpeakButton";
import soundWaveGif from "../../assets/waves.gif";
import "../../App.css";

interface Props {
	currentUser: { user: { name: string; id: number } };
}

const Home: React.FC = () => {
	const navigate = useNavigate();
	const [selectedLanguage, setSelectedLanguage] = useState("English");
	const [selectedLanguage2, setSelectedLanguage2] = useState("Turkish");
	const [selectedFeature, setSelectedFeature] = useState("transcribe");
	const [selectedTranscriptionSpeed, setSelectedTranscriptionSpeed] = useState<
		string | null
	>("base");

	const {
		//@ts-ignore
		isRecording,
		//@ts-ignore
		transcription,
		//@ts-ignore
		handleButtonPress,
		//@ts-ignore
		handleButtonRelease,
		//@ts-ignore
		isWaiting,
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
			<Typography
				variant='body1'
				sx={{
					fontSize: "14pt",
					m: "1rem 0 1rem 0",
				}}
			>
				Hello {currentUser && currentUser.user.name}
			</Typography>
			<Box
				sx={{
					textAlign: "justify",
					margin: {
						xs: "2rem 3rem",
						sm: "2rem 4rem",
					},
					height: {
						xs: "1rem",
						sm: "1rem",
					},
				}}
			>
				{isRecording ? (
					<img
						src={soundWaveGif}
						alt='sound wave gif'
						style={{ width: "300px" }}
					/>
				) : (
					<SliderBar
						selectedTranscriptionSpeed={selectedTranscriptionSpeed}
						setSelectedTranscriptionSpeed={setSelectedTranscriptionSpeed}
					/>
				)}
			</Box>

			<Box
				sx={{
					height: "100%",
					mt: "4rem",
					position: "relative",
					width: "100%",
				}}
			>
				<FormControls
					selectedFeature={selectedFeature}
					setSelectedFeature={setSelectedFeature}
					selectedLanguage={selectedLanguage}
					setSelectedLanguage={setSelectedLanguage}
					selectedLanguage2={selectedLanguage2}
					setSelectedLanguage2={setSelectedLanguage2}
				/>
				<PressToSpeakButton
					isWaiting={isWaiting}
					handleButtonPress={handleButtonPress}
					selectedLanguage={selectedLanguage}
					selectedLanguage2={selectedLanguage2}
					selectedFeature={selectedFeature}
					selectedTranscriptionSpeed={selectedTranscriptionSpeed}
					handleButtonRelease={handleButtonRelease}
				/>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						m: "2rem auto",
					}}
				>
					{transcription && !isWaiting ? (
						<>
							{transcription
								.split("\n")
								.map((sentence: string, index: number) => (
									<Typography variant='body1' key={index}>
										{sentence}
									</Typography>
								))}
						</>
					) : (
						(transcription || isWaiting) && <CircularProgress />
					)}
				</Box>
			</Box>
		</DefaultLayout>
	);
};

export default Home;
