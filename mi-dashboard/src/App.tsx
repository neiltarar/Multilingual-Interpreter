import React from "react";
import { BrowserRouter, Routes, Router, Route } from "react-router-dom";
import Home from "./components/pages/Home";

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
