import React from "react";
import { TextField, InputAdornment, IconButton, Box } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useTheme } from "@emotion/react";

interface PromptInputProps {
  isWaiting: boolean;
  handleButtonPress: Function;
  handleButtonRelease: Function;
  selectedLanguage: string;
  selectedLanguage2: string;
  selectedFeature: string;
  selectedTranscriptionSpeed: string | null;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (
    input: string,
    selectedLanguage: string,
    selectedLanguage2: string,
    selectedFeature: string,
    gptResponse: string | null,
  ) => void;
  gptResponse: string | null;
}

const PromptInput: React.FC<PromptInputProps> = ({
  isWaiting,
  handleButtonPress,
  handleButtonRelease,
  selectedLanguage,
  selectedLanguage2,
  selectedFeature,
  selectedTranscriptionSpeed,
  inputValue,
  setInputValue,
  handleSubmit,
  gptResponse,
}) => {
  const theme: any = useTheme();

  // @ts-ignore
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
      <TextField
        fullWidth
        multiline
        rows={6}
        variant="outlined"
        disabled={isWaiting}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={(event) => {
          if (
            // on mobile phones we can use the enter key for next line
            window.innerWidth > 400 &&
            event.key === "Enter" &&
            !event.shiftKey
          ) {
            console.log(window.innerWidth);
            handleSubmit(
              inputValue,
              selectedLanguage,
              selectedLanguage2,
              selectedFeature,
              gptResponse,
            );
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onMouseDown={() =>
                  handleButtonPress(
                    selectedLanguage,
                    selectedLanguage2,
                    selectedFeature,
                    selectedTranscriptionSpeed,
                  )
                }
                onMouseUp={() => handleButtonRelease()}
                onTouchStart={() => {
                  handleButtonPress(
                    selectedLanguage,
                    selectedLanguage2,
                    selectedFeature,
                    selectedTranscriptionSpeed,
                  );
                }}
                onTouchEnd={() => handleButtonRelease()}
                onTouchCancel={() => handleButtonRelease}
                disabled={isWaiting}
                sx={{
                  color: theme.palette.primary.main, // sets the color of the Mic icon
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light, // hover background color
                  },
                }}
              >
                <MicIcon />
              </IconButton>
              <IconButton
                onClick={() =>
                  handleSubmit(
                    inputValue,
                    selectedLanguage,
                    selectedLanguage2,
                    selectedFeature,
                    gptResponse,
                  )
                }
                sx={{
                  color: theme.palette.secondary.main, // sets the color of the Send icon
                  position: "absolute",
                  bottom: 1,
                  right: 1,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light, // hover background color
                  },
                }}
                disabled={isWaiting}
              >
                <SendRoundedIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default PromptInput;
