import { Routes, Route } from "react-router";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Friends from "./pages/Friends";
import Books from "./pages/Books";
import Footer from "./components/Footer";
import Login from "./pages/Login/Login";

import "./App.css";

function App() {
	const [token, setToken] = useState(
		() => sessionStorage.getItem("token") || ""
	);
	
	useEffect(() => {
		token
			? sessionStorage.setItem("token", token)
			: sessionStorage.removeItem("token");
	}, [token]);

	return token ? (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/freunde" element={<Friends />} />
				<Route path="/buecher" element={<Books />} />
			</Routes>
			<Footer />
		</>
	) : (
		<Login setToken={setToken} />
	);
}

export default App;
