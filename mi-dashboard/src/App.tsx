import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import SignIn from "./components/Auth/SignIn";
// import SignUp from "./components/Auth/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import SignUp from "./components/Auth/SignUp";

const App: React.FC = () => {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path='/signin' element={<SignIn />} />
					<Route path='/signup' element={<SignUp />} />
					<Route path='/' element={<Home />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
};

export default App;
