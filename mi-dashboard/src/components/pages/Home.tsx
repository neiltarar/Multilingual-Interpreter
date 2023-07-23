import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import { Typography, Select, MenuItem, FormControl } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
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
	const theme = useTheme();
	const navigate = useNavigate();
	const [selectedLanguage, setSelectedLanguage] = useState("English");
	const [selectedLanguage2, setSelectedLanguage2] = useState("Turkish");
	const [selectedFeature, setSelectedFeature] = useState("transcribe");

	const [testText, setTestText] = useState("test");

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
					m: "1rem 0 8rem 0",
				}}
			>
				Hello {currentUser && currentUser.user.name}
			</Typography>
			<div
				style={{
					height: "100%",
					marginTop: "4rem",
					position: "relative",
					width: "100%",
				}}
			>
				<div style={{ margin: "0 0 3rem 0" }}>
					<FormControl
						variant='standard'
						color='primary'
						size='medium'
						sx={{ m: 1, minWidth: 120 }}
					>
						<Select
							value={selectedFeature}
							onChange={(e) => setSelectedFeature(e.target.value)}
						>
							<MenuItem value='transcribe'>Transcript</MenuItem>
							<MenuItem value='translate'>Translate</MenuItem>
						</Select>
					</FormControl>
				</div>
				<Button
					variant='contained'
					color='primary'
					onMouseDown={() =>
						handleButtonPress(
							selectedLanguage,
							selectedLanguage2,
							selectedFeature
						)
					}
					onMouseUp={() => handleButtonRelease()}
					onTouchStart={() => {
						handleButtonPress(
							selectedLanguage,
							selectedLanguage2,
							selectedFeature
						);
						setTestText("On touch start");
					}}
					onTouchEnd={() => {
						handleButtonRelease();
						setTestText("On touch end");
					}}
					onTouchCancel={() => handleButtonRelease()}
					sx={{
						"borderRadius": "50%",
						"height": "120px", // Increased size
						"width": "120px", // Increased size
						"minWidth": "120px",
						"backgroundColor": theme.palette.primary.main,
						"color": theme.palette.common.white, // Changed text color to white
						"&:hover": {
							backgroundColor: theme.palette.primary.dark, // darker shade when hovered
						},
					}}
				>
					<Typography
						variant='button'
						sx={{ color: theme.palette.common.white }}
					>
						Hold to translate
					</Typography>
				</Button>
				{selectedFeature === "transcribe" ? (
					<div
						style={{ display: "flex", gap: "2rem", margin: "1.5rem 0 1.5rem " }}
					>
						<FormControl
							variant='standard'
							color='primary'
							size='medium'
							sx={{ m: 1, minWidth: 120 }}
						>
							<Select
								value={selectedLanguage}
								onChange={(e) => setSelectedLanguage(e.target.value)}
								sx={{ color: theme.palette.text.primary }} // black text
							>
								<MenuItem value='English'>English</MenuItem>
								<MenuItem value='Turkish'>Turkish</MenuItem>
							</Select>
						</FormControl>
					</div>
				) : (
					<div
						style={{ display: "flex", gap: "2rem", margin: "1.5rem 0 1.5rem " }}
					>
						<FormControl
							variant='filled'
							color='primary'
							size='medium'
							sx={{ m: 1, minWidth: 120 }}
						>
							<Select
								value={selectedLanguage}
								onChange={(e) => setSelectedLanguage(e.target.value)}
							>
								<MenuItem value='English'>English</MenuItem>
								<MenuItem value='Turkish'>Turkish</MenuItem>
							</Select>
						</FormControl>
						<FormControl
							variant='filled'
							color='primary'
							size='medium'
							sx={{ m: 1, minWidth: 120 }}
						>
							<Select
								value={selectedLanguage2}
								onChange={(e) => setSelectedLanguage2(e.target.value)}
							>
								<MenuItem value='English'>English</MenuItem>
								<MenuItem value='Turkish'>Turkish</MenuItem>
							</Select>
						</FormControl>
					</div>
				)}

				{isRecording && (
					<img
						src={soundWaveGif}
						alt='sound wave'
						style={{
							position: "absolute",
							bottom: "100%",
							height: "35%",
							width: "280%",
							left: "-100%",
							marginBottom: "1rem",
						}}
					/>
				)}

				{transcription && !isWaiting ? (
					<>
						<div
							style={{
								width: "100%",
								textAlign: "center",
								marginTop: "1rem",
							}}
						>
							{transcription
								.split("\n")
								.map((sentence: string, index: number) => (
									<Typography variant='body1' key={index}>
										{sentence}
									</Typography>
								))}
						</div>
					</>
				) : (
					(transcription || isWaiting) && <CircularProgress />
				)}
			</div>
		</DefaultLayout>
	);
};

export default Home;
