import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../Layout";
import Button from "@mui/material/Button";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const API_URL =
	process.env.NODE_ENV === "production"
		? process.env.REACT_APP_API_URL_DEPLOY
		: process.env.REACT_APP_API_URL_DEV;

interface Props {
	currentUser: { user: { name: string; id: number } };
}

const Home: React.FC = () => {
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const navigate = useNavigate();
	const location = useLocation();
	// @ts-ignore
	const { currentUser, beers, fetchBeers } = useAuth();

	useEffect(() => {
		if (!currentUser) {
			navigate("/signin");
		}
	}, [currentUser, navigate]);

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
