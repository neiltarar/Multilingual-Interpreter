import { createContext, useContext, useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import axios, { AxiosResponse } from "axios";

interface VoiceContextType {
  handleSubmit: (
    promptInput: string,
    selectedLanguage: string,
    selectedLanguage2: string,
    selectedFeature: string,
    gptResponse: string | null,
  ) => Promise<void>;
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

const PromptContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  return useContext(PromptContext);
};

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [GPTResponse, setGPTResponse] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const { currentUser, setCurrentUser, signout } = useAuth() as AuthContextType;

  const handleButtonPress = async (
    selectedLanguage: string,
    selectedLanguage2: string,
    selectedFeature: string,
    selectedTranscriptionSpeed: string,
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
            selectedTranscriptionSpeed,
          );
          setIsWaiting(true);

          try {
            await axios
              .post("/api/prompt-voice", formData)
              .then((res: AxiosResponse<any, any>): void => {
                if (res.status === 200) {
                  const { user } = res.data;
                  setCurrentUser({
                    user: {
                      name: user.name,
                      apiRights: user.apiRights,
                    },
                  });
                  localStorage.setItem(
                    "currentUser",
                    JSON.stringify({
                      user: {
                        name: user.name,
                        apiRights: user.apiRights,
                      },
                    }),
                  );
                  const transcribedSpeech = res.data.message;
                  setGPTResponse(transcribedSpeech);
                  setTimeout(() => setIsWaiting(false), 500);
                }
              })
              .catch((err): void => {
                setIsWaiting(false);
                console.error(err);
                signout();
              });
          } catch (error) {
            setIsWaiting(false);
            console.error("Error uploading recorded sound:", error);
            signout();
          }
        },
      );

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleButtonRelease = (): void => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSubmit = async (
    promptInput: string,
    selectedLanguage: string,
    selectedLanguage2: string,
    selectedFeature: string,
    gptResponse: string | null,
  ): Promise<void> => {
    // Create a FormData object to send the recorded data to the server
    const formData = new FormData();
    formData.append("selectedLanguage", selectedLanguage);
    formData.append("selectedLanguage2", selectedLanguage2);
    formData.append("selectedFeature", selectedFeature);
    formData.append("promptInput", promptInput);
    formData.append("gptResponse", gptResponse as string);
    setIsWaiting(true);
    try {
      await axios
        .post("/api/prompt-text", formData)
        .then((res) => {
          if (res.status === 200) {
            const { user } = res.data;
            setCurrentUser({
              user: {
                name: user.name,
                apiRights: user.apiRights,
                usersConversations: user.usersConversations,
              },
            });
            localStorage.setItem(
              "currentUser",
              JSON.stringify({
                user: {
                  name: user.name,
                  apiRights: user.apiRights,
                  usersConversations: user.usersConversations,
                },
              }),
            );
            const responseMessage = res.data.message;
            setGPTResponse(responseMessage);
            setTimeout(() => setIsWaiting(false), 500);
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
  };

  const value = {
    GPTResponse,
    setGPTResponse,
    handleButtonPress,
    handleButtonRelease,
    handleSubmit,
    isRecording,
    isWaiting,
  };

  return (
    <PromptContext.Provider value={value}>{children}</PromptContext.Provider>
  );
};
