import { createContext, useContext, useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

interface VoiceContextType {
	//TODO define the properties and methods of the context value
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
	return useContext(VoiceContext);
};

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const [transcription, setTranscription] = useState(null);
	const [isRecording, setIsRecording] = useState(false);
	const [isWaiting, setIsWaiting] = useState(false);
	// @ts-ignore
	const { signout } = useAuth();

	const handleButtonPress = async (
		selectedLanguage: string,
		selectedLanguage2: string,
		selectedFeature: string,
		selectedTranscriptionSpeed: string
	) => {
		setIsRecording(true);
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false,
			});
			mediaRecorderRef.current = new MediaRecorder(mediaStream);

			mediaRecorderRef.current.addEventListener(
				"dataavailable",
				async (event) => {
					const recordedData = event.data;

					// Create a FormData object to send the recorded data to the server
					const formData = new FormData();
					formData.append("recordedSound", recordedData, "recorded-sound.wav");
					formData.append("selectedLanguage", selectedLanguage);
					formData.append("selectedLanguage2", selectedLanguage2);
					formData.append("selectedFeature", selectedFeature);
					formData.append(
						"selectedTranscriptionSpeed",
						selectedTranscriptionSpeed
					);
					setIsWaiting(true);

					try {
						// Send the recorded data to the server using Axios
						await axios
							.post("/api/upload", formData)
							.then((res) => {
								const transcriptedSpeech = res.data.message;
								setTranscription(transcriptedSpeech);
								setTimeout(() => setIsWaiting(false), 500);
							})
							.catch((err) => {
								setIsWaiting(false);
								console.error(err);
								signout();
							});
					} catch (error) {
						setIsWaiting(false);
						console.error("Error uploading recorded sound:", error);
						signout();
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
		setIsRecording(false);
	};

	const value = {
		transcription,
		setTranscription,
		handleButtonPress,
		handleButtonRelease,
		isRecording,
		isWaiting,
	};

	return (
		<VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
	);
};
