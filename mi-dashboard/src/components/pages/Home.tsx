import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { useVoice } from "../../contexts/PromptContext";
import { useAuth } from "../../contexts/AuthContext";
import DefaultLayout from "../Layout/DefaultLayout";
import SliderBar from "../Layout/SliderBar";
import FormControls from "../Layout/FormControls";
import PromptInput from "../Layout/PromptInput";
import GPTResponseText from "../Layout/GPTResponseText";
import soundWaveGif from "../../assets/waves.gif";
import "../../App.css";

interface Conversation {
  topic: string;
  conversation_id: number;
}
interface User {
  user: {
    name: string;
    usersConversations: Conversation[];
    apiRights: {
      totalReqLeft: number;
      unlimitedReq: boolean;
    };
  };
}

interface AuthContextType {
  currentUser: User | null;
}

interface VoiceContextType {
  GPTResponse: string;
  setTranscription: React.Dispatch<React.SetStateAction<string | null>>;
  handleButtonPress: (
    selectedLanguage: string,
    selectedLanguage2: string,
    selectedFeature: string,
    selectedTranscriptionSpeed: string,
  ) => Promise<void>;
  handleButtonRelease: () => void;
  handleSubmit: () => Promise<void>;
  isRecording: boolean;
  isWaiting: boolean;
  setIsWaiting: (value: boolean) => void;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth() as AuthContextType;
  const [inputValue, setInputValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedLanguage2, setSelectedLanguage2] = useState("Turkish");
  const [selectedFeature, setSelectedFeature] = useState("gptHelper");
  const [selectedTranscriptionSpeed, setSelectedTranscriptionSpeed] = useState<
    string | null
  >("base");

  const {
    isRecording,
    GPTResponse,
    handleButtonPress,
    handleButtonRelease,
    handleSubmit,
    isWaiting,
  } = useVoice() as VoiceContextType;

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  return (
    <DefaultLayout currentUser={currentUser}>
      <Typography
        variant="body1"
        sx={{
          fontSize: "14pt",
          m: "1rem 0 1rem 0",
        }}
      >
        Hello {currentUser?.user.name}; you have
        {currentUser?.user.apiRights?.unlimitedReq
          ? " unlimited API requests"
          : ` ${currentUser?.user.apiRights?.totalReqLeft} API requests left`}
      </Typography>
      <Box
        sx={{
          textAlign: "justify",
          margin: {
            xs: "2rem 3rem",
            sm: "2rem 4rem",
          },
          height: {
            xs: "1rem",
            sm: "1rem",
          },
        }}
      >
        {isRecording ? (
          <Box
            sx={{
              width: {
                xs: 300,
                sm: 450,
              },
              margin: {
                xs: "0.5rem auto",
                sm: "2.5rem auto",
              },
            }}
          >
            <img src={soundWaveGif} alt="sound wave gif" />
          </Box>
        ) : (
          <SliderBar
            selectedTranscriptionSpeed={selectedTranscriptionSpeed}
            setSelectedTranscriptionSpeed={setSelectedTranscriptionSpeed}
          />
        )}
      </Box>

      <Box
        sx={{
          height: "100%",
          mt: "4rem",
          position: "relative",
          width: "100%",
        }}
      >
        <FormControls
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          selectedLanguage2={selectedLanguage2}
          setSelectedLanguage2={setSelectedLanguage2}
        />
        {((currentUser && currentUser.user.apiRights.totalReqLeft > 0) ||
          currentUser?.user.apiRights.unlimitedReq) && (
          <PromptInput
            isWaiting={isWaiting}
            handleButtonPress={handleButtonPress}
            selectedLanguage={selectedLanguage}
            selectedLanguage2={selectedLanguage2}
            selectedFeature={selectedFeature}
            selectedTranscriptionSpeed={selectedTranscriptionSpeed}
            handleButtonRelease={handleButtonRelease}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={handleSubmit}
            gptResponse={GPTResponse}
          />
        )}
        <GPTResponseText GPTResponse={GPTResponse} isWaiting={isWaiting} />
      </Box>
    </DefaultLayout>
  );
};

export default Home;
