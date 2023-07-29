import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
	return (
		<Box
			sx={{
				backgroundColor: "rgba(173, 216, 230, 0.5)", // semi-transparent light blue
				color: "white",
				p: 2,
				width: "100vw",
				boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.7)", // slight shadow
				mt: "auto",
			}}
		>
			<Typography variant='body2' align='center'>
				This application uses the&nbsp;
				<Link
					href='https://huggingface.co/openai/whisper-large'
					target='_blank'
					rel='noopener noreferrer'
					color='inherit'
				>
					Whisper ASR API by OpenAI
				</Link>
				&nbsp; for speech transcription, and the&nbsp;
				<Link
					href='https://openai.com/research/chatgpt'
					target='_blank'
					rel='noopener noreferrer'
					color='inherit'
				>
					ChatGPT API by OpenAI
				</Link>
				&nbsp; for translation.
			</Typography>
			<Typography variant='body2' align='center' mt={1}>
				Created by&nbsp;
				<Link
					href='https://neil-tarar.com'
					target='_blank'
					rel='noopener noreferrer'
					color='inherit'
				>
					Neil Tarar
				</Link>
				.
			</Typography>
		</Box>
	);
};

export default Footer;
