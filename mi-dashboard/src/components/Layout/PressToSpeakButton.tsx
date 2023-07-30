import React from "react";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

interface PressToSpeakButtonProps {
	isWaiting: boolean;
	handleButtonPress: Function;
	selectedLanguage: string;
	selectedLanguage2: string;
	selectedFeature: string;
	selectedTranscriptionSpeed: string | null;
	handleButtonRelease: Function;
}

const PressToSpeakButton: React.FC<PressToSpeakButtonProps> = ({
	isWaiting,
	handleButtonPress,
	selectedLanguage,
	selectedLanguage2,
	selectedFeature,
	selectedTranscriptionSpeed,
	handleButtonRelease,
}) => {
	const theme = useTheme();

	return (
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
			<Typography variant='button' sx={{ color: theme.palette.common.white }}>
				Hold to speak
			</Typography>
		</Button>
	);
};

export default PressToSpeakButton;
