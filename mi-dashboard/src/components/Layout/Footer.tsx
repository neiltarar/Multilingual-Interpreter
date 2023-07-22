import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
	return (
		<Box
			sx={{
				backgroundColor: "primary.main",
				color: "white",
				p: 3,
				width: "100vw",
				m: "0 auto",
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
					href='http://neil-tarar.com'
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
