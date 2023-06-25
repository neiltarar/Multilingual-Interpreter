import { createContext, useContext, useState, useRef } from "react";
import axios from "axios";

interface VoiceContextType {
	//TODO define the properties and methods of your context value
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

	const handleButtonPress = async () => {
		setIsRecording(true);
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
						await axios
							.post("http://localhost:5000/api/upload", formData)
							.then((res) => {
								const transcriptedSpeech = res.data.message;
								setTranscription(transcriptedSpeech);
								console.log(transcriptedSpeech);
							})
							.catch((err) => console.error(err));

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
		setIsRecording(false);
	};

	const value = {
		transcription,
		setTranscription,
		handleButtonPress,
		handleButtonRelease,
		isRecording,
	};

	return (
		<VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
	);
};
