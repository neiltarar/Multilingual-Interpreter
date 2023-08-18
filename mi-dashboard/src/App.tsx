import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import { VoiceProvider } from "./contexts/PromptContext";
import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <VoiceProvider>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </VoiceProvider>
    </AuthProvider>
  );
};

export default App;
