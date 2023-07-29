import React from "react";
import {
	CircularProgress,
	Box,
	TextField,
	IconButton,
	InputAdornment,
} from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";

interface GPTResponseTextProps {
	transcription: string;
	isWaiting: boolean;
}

const GPTResponseText: React.FC<GPTResponseTextProps> = ({
	transcription,
	isWaiting,
}) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				m: "2rem auto",
				width: "95%",
			}}
		>
			{transcription && !isWaiting ? (
				<TextField
					multiline
					fullWidth
					value={transcription
						.split(" ")
						.reduce((acc: string, word: string, i: number) => {
							return acc + word + (i % 50 === 0 ? "\n" : " ");
						}, "")}
					inputProps={{
						readOnly: true,
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment
								position='end'
								style={{ position: "absolute", right: 0, top: 20 }}
							>
								<IconButton
									onClick={() => navigator.clipboard.writeText(transcription)}
								>
									<FileCopyIcon />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			) : (
				(transcription || isWaiting) && <CircularProgress />
			)}
		</Box>
	);
};

export default GPTResponseText;
