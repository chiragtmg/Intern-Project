import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import UserForm from "./Pages/UserForm";

const App = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Login />}></Route>
					<Route path="home" element={<Home />}></Route>
					<Route path="profile" element={<Profile />} />
					<Route path="userform" element={<UserForm />} />
				</Route>
				<Route path="/login" element={<Login />}></Route>
				<Route path="/register" element={<Register />}></Route>
			</Routes>
		</>
	);
};

export default App;
