import { createContext, useContext, useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

interface VoiceContextType {
	//TODO define the properties and methods of the context value
}

interface AuthContextType {
	currentUser: {
		user: {
			name: string;
			apiRights: {
				totalReqLeft: number;
				unlimitedReq: boolean;
			};
		};
	};
	setCurrentUser: (user: any) => void;
	signout: () => void;
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
	const { currentUser, setCurrentUser, signout } = useAuth() as AuthContextType;

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
						// TODO handle this on the BE later. We are doing the check regardless so no safety issue
						if (currentUser && currentUser.user.apiRights.totalReqLeft !== 0) {
							const updatedCurrentUser = {
								user: {
									name: currentUser.user.name,
									apiRights: {
										totalReqLeft: currentUser.user.apiRights.totalReqLeft - 1,
										unlimitedReq: currentUser.user.apiRights.unlimitedReq,
									},
								},
							};

							localStorage.setItem(
								"currentUser",
								JSON.stringify(updatedCurrentUser)
							);
							setCurrentUser(updatedCurrentUser);
						}
						// ABOVE WILL BE HANDLED IN THE BE LATER!!!

						// Send the recorded data to the server using Axios
						await axios
							.post("/api/upload", formData)
							.then((res) => {
								if (!res.data.apiStatus) {
									const transcriptedSpeech = res.data.message;
									setTranscription(transcriptedSpeech);
									setTimeout(() => setIsWaiting(false), 500);
								} else {
									const transcriptedSpeech = res.data.message;
									setTranscription(transcriptedSpeech);
									setIsWaiting(true);
								}
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

	const handleSubmit = async (
		promptInput: string,
		selectedLanguage: string,
		selectedLanguage2: string,
		selectedFeature: string
	) => {
		// Create a FormData object to send the recorded data to the server
		const formData = new FormData();
		formData.append("selectedLanguage", selectedLanguage);
		formData.append("selectedLanguage2", selectedLanguage2);
		formData.append("selectedFeature", selectedFeature);
		formData.append("promptInput", promptInput);
		setIsWaiting(true);
		try {
			// TODO handle this on the BE later. We are doing the check regardless so no safety issue
			if (currentUser && currentUser.user.apiRights.totalReqLeft !== 0) {
				const updatedCurrentUser = {
					user: {
						name: currentUser.user.name,
						apiRights: {
							totalReqLeft: currentUser.user.apiRights.totalReqLeft - 1,
							unlimitedReq: currentUser.user.apiRights.unlimitedReq,
						},
					},
				};

				localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
				setCurrentUser(updatedCurrentUser);
			}
			// ABOVE WILL BE HANDLED IN THE BE LATER!!!

			// Send the recorded data to the server using Axios
			setIsWaiting(true);
			await axios
				.post("/api/prompt", formData)
				.then((res) => {
					console.log("response", res);
					if (!res.data.apiStatus) {
						const responseMessage = res.data.message;
						setTranscription(responseMessage);
						setTimeout(() => setIsWaiting(false), 500);
					} else {
						const transcriptedSpeech = res.data.message;
						setTranscription(transcriptedSpeech);
						setIsWaiting(true);
					}
				})
				.catch((err) => {
					setIsWaiting(false);
					console.error(err);
					signout();
				});
		} catch (error) {
			setIsWaiting(false);
			console.error("Error sending prompt:", error);
			signout();
		}
		console.log(
			promptInput,
			selectedLanguage,
			selectedLanguage2,
			selectedFeature
		);
	};

	const value = {
		transcription,
		setTranscription,
		handleButtonPress,
		handleButtonRelease,
		handleSubmit,
		isRecording,
		isWaiting,
	};

	return (
		<VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
	);
};
