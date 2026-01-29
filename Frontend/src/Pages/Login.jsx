import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming you're using React Router
import { apiRequest } from "../Services/API";

const Login = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		try {
			const res = await apiRequest.post("/auth/login", {
				username: formData.username,
				password: formData.password,
			});
			console.log(res);
			// updateUser(res.data);
			navigate("/home");
		} catch (error) {
			setError(error.response?.data?.msg || "Something went wrong");
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				{/* Logo / Icon */}
				<div className="flex justify-center">
					<div className="h-16 w-16 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
						<svg
							className="h-10 w-10 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 9V7a5 5 0 00-10 0v2m-2 0h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"
							/>
						</svg>
					</div>
				</div>

				<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
					ExpenseTracker
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					Take control of your finances
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
					<form onSubmit={handleSubmit} className="space-y-6">
						{error && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
								{error}
							</div>
						)}
						{/* Username */}
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Username
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg
										className="h-5 w-5 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
								<input
									id="username"
									name="username"
									type="text"
									value={formData.username}
									onChange={handleChange}
									required
									className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
									placeholder="username"
								/>
							</div>
						</div>

						{/* Password */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg
										className="h-5 w-5 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-2.761 0-5 2.239-5 5h10c0-2.761-2.239-5-5-5z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 9V7a5 5 0 00-10 0v2m-2 0h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"
										/>
									</svg>
								</div>
								<input
									id="password"
									name="password"
									type="password"
									value={formData.password}
									onChange={handleChange}
									required
									className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
									placeholder="••••••••"
								/>
							</div>
						</div>

						{/* Forgot Password & Sign Up */}
						<div className="flex items-center justify-between">
							<div className="text-sm">
								<a
									href="#"
									className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
								>
									Forgot password?
								</a>
							</div>
							<div className="text-sm">
								<Link
									to="/register"
									className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
								>
									<span className="font-semibold">Sign up</span>
								</Link>
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={isLoading}
								className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 ${
									isLoading ? "opacity-70 cursor-not-allowed" : ""
								}`}
							>
								{isLoading ? "Logging..." : "Login"}
							</button>
						</div>
					</form>

					<p className="mt-8 text-center text-sm text-gray-500">
						By continuing, you agree to our{" "}
						<a href="#" className="text-emerald-600 hover:text-emerald-500">
							Terms of Service
						</a>{" "}
						and{" "}
						<a href="#" className="text-emerald-600 hover:text-emerald-500">
							Privacy Policy
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
