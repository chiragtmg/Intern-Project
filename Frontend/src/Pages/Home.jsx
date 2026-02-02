import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
	const { currentUser } = useContext(AuthContext);
	console.log(currentUser);
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-emerald-600 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
							<svg
								className="h-6 w-6 text-white"
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
						<h1 className="text-2xl font-bold">ExpenseTracker</h1>
					</div>
					<div className="flex items-center gap-4">
						<span className="text-sm hidden sm:inline">
							<Link to= "/profile">
							{currentUser ? currentUser.username : "Guest"}
							</Link>
						</span>
						<div className="h-9 w-9 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-medium">
							C
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Balance Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
						<p className="text-sm text-gray-600 mb-1">Total Balance</p>
						<p className="text-3xl font-bold text-gray-900">NPR</p>
						<p className="text-sm text-emerald-600 mt-2">
							↑ 12.4% from last month
						</p>
					</div>

					<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
						<p className="text-sm text-gray-600 mb-1">Income</p>
						<p className="text-3xl font-bold text-emerald-600">+NPR</p>
					</div>

					<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
						<p className="text-sm text-gray-600 mb-1">Expenses</p>
						<p className="text-3xl font-bold text-red-600">-NPR</p>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="flex flex-wrap gap-4 mb-10">
					<button className="flex-1 md:flex-none bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2 min-w-[160px]">
						<svg
							className="w-5 h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Add Income
					</button>

					<button className="flex-1 md:flex-none bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition shadow-sm flex items-center justify-center gap-2 min-w-[160px]">
						<svg
							className="w-5 h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M20 12H4"
							/>
						</svg>
						Add Expense
					</button>

					<button className="flex-1 md:flex-none bg-gray-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-sm flex items-center justify-center gap-2 min-w-[160px]">
						<svg
							className="w-5 h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						View Reports
					</button>
				</div>

				{/* Recent Transactions */}
				<div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
					<div className="px-6 py-5 border-b border-gray-100">
						<h2 className="text-xl font-semibold text-gray-900">
							Recent Transactions
						</h2>
					</div>
					{/* <div className="divide-y divide-gray-100">
						{recentTransactions.map((tx) => (
							<div
								key={tx.id}
								className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
							>
								<div>
									<p className="font-medium text-gray-900">{tx.title}</p>
									<p className="text-sm text-gray-500">{tx.date}</p>
								</div>
								<p
									className={`font-semibold ${
										tx.type === "income" ? "text-emerald-600" : "text-red-600"
									}`}
								>
									{tx.type === "income" ? "+" : ""}
									{tx.amount.toLocaleString()} NPR
								</p>
							</div>
						))}
					</div> */}
					<div className="px-6 py-4 text-center">
						<button className="text-emerald-600 hover:text-emerald-700 font-medium">
							View all transactions →
						</button>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Home;
