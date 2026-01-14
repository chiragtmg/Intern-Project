import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import Login from "./Pages/Login";
import Home from "./Pages/Home";

const App = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Login />}></Route>
				</Route>

				<Route path="/login" element={<Login />}></Route>
			</Routes>
		</>
	);
};

export default App;
