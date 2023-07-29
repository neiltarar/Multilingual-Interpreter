import React from "react";
import { Box, Typography, Slider } from "@mui/material";

interface SlideBarProps {
	setSelectedTranscriptionSpeed: Function;
	selectedTranscriptionSpeed: string | null;
}

const SliderBar: React.FC<SlideBarProps> = ({
	setSelectedTranscriptionSpeed,
	selectedTranscriptionSpeed,
}) => {
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

	const translateSpeedToSliderValue = (speed: string | null) => {
		switch (speed) {
			case "tiny":
				return 100;
			case "base":
				return 75;
			case "small":
				return 50;
			case "medium":
				return 25;
			case "large":
				return 0;
			default:
				return 75; // or whatever default you want
		}
	};

	function valuetext(value: number) {
		return `${value}`;
	}

	return (
		<Box
			sx={{
				width: {
					xs: 300,
					sm: 450,
				},
				margin: {
					xs: "0.5rem auto",
					sm: "2.5rem auto",
				},
			}}
		>
			<Typography variant='subtitle1'>
				Slide to balance speed and accuracy of voice transcription.
			</Typography>
			<Slider
				value={translateSpeedToSliderValue(selectedTranscriptionSpeed)}
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
	);
};

export default SliderBar;
