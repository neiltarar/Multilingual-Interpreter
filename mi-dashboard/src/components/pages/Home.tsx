import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import { Typography, Select, MenuItem, FormControl } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
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

const marks = [
	{
		value: 0,
		label: "slowest",
	},
	{
		value: 25,
		label: "slow",
	},
	{
		value: 50,
		label: "modarate",
	},
	{
		value: 75,
		label: "fast",
	},
	{
		value: 100,
		label: "fastest",
	},
];

const Home: React.FC = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [selectedLanguage, setSelectedLanguage] = useState("English");
	const [selectedLanguage2, setSelectedLanguage2] = useState("Turkish");
	const [selectedFeature, setSelectedFeature] = useState("transcribe");
	const [selectedTranscriptionSpeed, setSelectedTranscriptionSpeed] = useState<
		string | null
	>("base");

	function valuetext(value: number) {
		return `${value}`;
	}

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
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: "1rem",
						margin: "0 0 1rem 0",
					}}
				>
					<FormControl
						variant='standard'
						color='primary'
						size='medium'
						sx={{ m: 3, minWidth: 120 }}
					>
						<Select
							value={selectedFeature}
							onChange={(e) => setSelectedFeature(e.target.value)}
						>
							<MenuItem value='transcribe'>Transcript</MenuItem>
							<MenuItem value='translate'>Translate</MenuItem>
						</Select>
					</FormControl>
					{selectedFeature === "transcribe" ? (
						<FormControl
							variant='standard'
							color='primary'
							size='medium'
							sx={{ m: 3, minWidth: 120 }}
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
					) : (
						<div
							style={{
								display: "flex",
								gap: "0.5rem",
								margin: "1rem 0 1rem 0",
							}}
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
								>
									<MenuItem value='English'>English</MenuItem>
									<MenuItem value='Turkish'>Turkish</MenuItem>
								</Select>
							</FormControl>
							<FormControl
								variant='standard'
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
				</div>
				<Button
					disabled={isWaiting}
					variant='contained'
					color='primary'
					onMouseDown={() =>
						handleButtonPress(
							selectedLanguage,
							selectedLanguage2,
							selectedFeature,
							selectedTranscriptionSpeed
						)
					}
					onMouseUp={() => handleButtonRelease()}
					onTouchStart={() => {
						handleButtonPress(
							selectedLanguage,
							selectedLanguage2,
							selectedFeature,
							selectedTranscriptionSpeed
						);
					}}
					onTouchEnd={() => {
						handleButtonRelease();
					}}
					onTouchCancel={() => handleButtonRelease()}
					sx={{
						"borderRadius": "50%",
						"height": "100px", // Increased size
						"width": "100px", // Increased size
						"minWidth": "100px",
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
				<Box
					sx={{
						width: {
							xs: 350,
							sm: 550,
						},
						margin: {
							xs: "0.5rem auto",
							sm: "2.5rem auto",
						},
					}}
				>
					<Slider
						aria-label='Always visible'
						defaultValue={75}
						getAriaValueText={valuetext}
						step={25}
						marks={marks}
						onChange={(event, newValue) => {
							switch (newValue) {
								case 100:
									setSelectedTranscriptionSpeed("tiny");
									break;
								case 75:
									setSelectedTranscriptionSpeed("base");
									break;
								case 50:
									setSelectedTranscriptionSpeed("small");
									break;
								case 25:
									setSelectedTranscriptionSpeed("medium");
									break;
								case 0:
									setSelectedTranscriptionSpeed("large");
									break;
								default:
									setSelectedTranscriptionSpeed(null);
							}
						}}
					/>
				</Box>
				{isRecording && (
					<img
						src={soundWaveGif}
						alt='sound wave'
						style={{
							position: "absolute",
							bottom: "100%",
							height: "25%",
							width: "100%",
							left: "0%",
							marginBottom: "1rem",
						}}
					/>
				)}

				{transcription && !isWaiting ? (
					<React.Fragment>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								margin: "1rem 2rem",
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
					</React.Fragment>
				) : (
					(transcription || isWaiting) && <CircularProgress />
				)}
			</div>
		</DefaultLayout>
	);
};

export default Home;
