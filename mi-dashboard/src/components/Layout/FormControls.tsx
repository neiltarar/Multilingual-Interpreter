import React from "react";
import { Box, FormControl, Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface FormControlsProps {
	selectedFeature: string;
	setSelectedFeature: Function;
	selectedLanguage: string;
	setSelectedLanguage: Function;
	selectedLanguage2: string;
	setSelectedLanguage2: Function;
}

const FormControls: React.FC<FormControlsProps> = ({
	selectedFeature,
	setSelectedFeature,
	selectedLanguage,
	setSelectedLanguage,
	selectedLanguage2,
	setSelectedLanguage2,
}) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				gap: "0.1rem",
				m: "7rem 0 1rem 0",
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
					<MenuItem value='gptHelper'>GPT Helper</MenuItem>
					<MenuItem value='imageGenerator'>Image Generator</MenuItem>
				</Select>
			</FormControl>
			{!(selectedFeature === "translate") ? (
				<FormControl
					variant='standard'
					color='primary'
					size='medium'
					sx={{ m: 3, minWidth: 120 }}
				>
					<Select
						value={selectedLanguage}
						onChange={(e) => setSelectedLanguage(e.target.value)}
						sx={{ color: theme.palette.text.primary }}
					>
						<MenuItem value='English'>English</MenuItem>
						<MenuItem value='Turkish'>Turkish</MenuItem>
						<MenuItem value='Spanish'>Spanish</MenuItem>
						<MenuItem value='French'>French</MenuItem>
					</Select>
				</FormControl>
			) : (
				<Box sx={{ display: "flex", gap: "0.5rem", m: "1rem 0" }}>
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
							<MenuItem value='Spanish'>Spanish</MenuItem>
							<MenuItem value='French'>French</MenuItem>
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
							<MenuItem value='Spanish'>Spanish</MenuItem>
							<MenuItem value='French'>French</MenuItem>
						</Select>
					</FormControl>
				</Box>
			)}
		</Box>
	);
};

export default FormControls;
