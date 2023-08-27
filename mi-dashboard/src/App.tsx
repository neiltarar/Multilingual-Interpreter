import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import { GPTPromptProvider } from "./contexts/PromptContext";
import { UserConversationsProvider } from "./contexts/UserConversationsContext";
import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UserConversationsProvider>
        <GPTPromptProvider>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </GPTPromptProvider>
      </UserConversationsProvider>
    </AuthProvider>
  );
};

export default App;
