import React, { useRef } from "react";
import Layout from "../Layout";
import Button from "@mui/material/Button";
import axios from "axios";

const Home: React.FC = () => {
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);

	const handleButtonPress = async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			mediaRecorderRef.current = new MediaRecorder(mediaStream);

			mediaRecorderRef.current.addEventListener(
				"dataavailable",
				async (event) => {
					const recordedData = event.data;

					// Create a FormData object to send the recorded data to the server
					const formData = new FormData();
					formData.append("recordedSound", recordedData, "recorded-sound.wav");

					try {
						// Send the recorded data to the server using Axios
						await axios.post("http://localhost:5000/api/upload", formData);

						console.log("Recorded sound uploaded successfully");
					} catch (error) {
						console.error("Error uploading recorded sound:", error);
					}
				}
			);

			mediaRecorderRef.current.start();
		} catch (error) {
			console.error("Error accessing microphone:", error);
		}
	};

	const handleButtonRelease = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
		}
	};

	return (
		<Layout>
			<h1>Home Page</h1>
			<Button
				variant='contained'
				color='primary'
				onMouseDown={handleButtonPress}
				onMouseUp={handleButtonRelease}
				onTouchStart={handleButtonPress}
				onTouchEnd={handleButtonRelease}
			>
				Hold to Record
			</Button>
		</Layout>
	);
};

export default Home;
