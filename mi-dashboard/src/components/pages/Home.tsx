import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { useVoice } from "../../contexts/VoiceContext";
import { useAuth } from "../../contexts/AuthContext";
import DefaultLayout from "../Layout/DefaultLayout";
import SliderBar from "../Layout/SliderBar";
import FormControls from "../Layout/FormControls";
import PressToSpeakButton from "../Layout/PressToSpeakButton";
import GPTResponseText from "../Layout/GPTResponseText";
import soundWaveGif from "../../assets/waves.gif";
import "../../App.css";

interface User {
	user: { name: string; id: number };
}

interface AuthContextType {
	currentUser: User | null;
}

interface VoiceContextType {
	transcription: string;
	setTranscription: React.Dispatch<React.SetStateAction<string | null>>;
	handleButtonPress: (
		selectedLanguage: string,
		selectedLanguage2: string,
		selectedFeature: string,
		selectedTranscriptionSpeed: string
	) => Promise<void>;
	handleButtonRelease: () => void;
	isRecording: boolean;
	isWaiting: boolean;
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
		isRecording,
		transcription,
		handleButtonPress,
		handleButtonRelease,
		isWaiting,
	} = useVoice() as VoiceContextType;

	const { currentUser } = useAuth() as AuthContextType;

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
				<GPTResponseText transcription={transcription} isWaiting={isWaiting} />
			</Box>
		</DefaultLayout>
	);
};

export default Home;
