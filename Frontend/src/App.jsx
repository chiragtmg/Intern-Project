import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import UserForm from "./Pages/UserForm";
import Dashboard from "./Pages/Dashboard";
import Transactions from "./Pages/Transactions";
import Categories from "./Pages/Categories";
import Reports from "./Pages/Reports";

const App = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Login />}></Route>
					<Route path="profile" element={<Profile />} />
					<Route path="userform" element={<UserForm />} />
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="transactions" element={<Transactions />} />
					<Route path="categories" element={<Categories />} />
					<Route path="Reports" element={<Reports />} />
				</Route>
				<Route path="/login" element={<Login />}></Route>
				<Route path="/register" element={<Register />}></Route>
			</Routes>
		</>
	);
};

export default App;
