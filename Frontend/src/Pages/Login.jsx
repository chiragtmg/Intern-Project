import React from "react";

const Login = () => {
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
					{/* Tabs - Login / Sign Up */}
					<div className="flex justify-center mb-8">
						<div className="inline-flex rounded-full bg-gray-100 p-1">
							<button
								type="button"
								className="px-6 py-2 rounded-full text-sm font-medium transition-all bg-white shadow-sm text-gray-900"
							>
								Login
							</button>
							<button
								type="button"
								className="px-6 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
							>
								Sign Up
							</button>
						</div>
					</div>

					<form className="space-y-6">
						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Email
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
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
									placeholder="you@example.com"
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
									autoComplete="current-password"
									required
									className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
									placeholder="••••••••"
								/>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="text-sm">
								<a
									href="#"
									className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
								>
									Forgot password?
								</a>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-medium transition-all duration-200"
							>
								Login
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
