import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const { currentUser, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("transactions");

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const totalIncome = 1000;
	const totalExpense = 500;
	const balance = totalIncome - totalExpense;

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Header */}
			<header className="bg-white shadow-md sticky top-0 z-10">
				<div className="container mx-auto px-4 py-4 flex justify-between items-center">
					<div>
						<h1 className="text-2xl font-bold text-blue-600">
							Expense Tracker
						</h1>
						<p className="text-gray-600">Welcome, {currentUser?.username}!</p>
					</div>

					<button
						onClick={handleLogout}
						className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
					>
						Logout
					</button>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-6">
				{/* Overview Cards */}
				<div className="grid md:grid-cols-3 gap-4 mb-6">
					{/* Balance Card */}
					<div className="bg-white p-5 rounded-lg shadow">
						<h3 className="text-gray-500 text-sm">Total Balance</h3>
						<h2
							className={`text-3xl font-bold ${
								balance >= 0 ? "text-green-600" : "text-red-600"
							}`}
						>
							${Math.abs(balance).toFixed(2)}
						</h2>
						<p className="text-gray-500 text-sm">
							{balance >= 0 ? "Positive balance" : "Negative balance"}
						</p>
					</div>

					{/* Income Card */}
					<div className="bg-white p-5 rounded-lg shadow">
						<h3 className="text-gray-500 text-sm">Total Income</h3>
						<h2 className="text-3xl font-bold text-green-600">
							${totalIncome.toFixed(2)}
						</h2>
						<p className="text-gray-500 text-sm">All time</p>
					</div>

					{/* Expense Card */}
					<div className="bg-white p-5 rounded-lg shadow">
						<h3 className="text-gray-500 text-sm">Total Expenses</h3>
						<h2 className="text-3xl font-bold text-red-600">
							${totalExpense.toFixed(2)}
						</h2>
						<p className="text-gray-500 text-sm">All time</p>
					</div>
				</div>

				{/* Tabs Navigation */}
				<div className="flex gap-4 mb-6 border-b">
					{["transactions", "categories", "reports", "charts"].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`pb-2 capitalize ${
								activeTab === tab
									? "border-b-2 border-blue-600 text-blue-600 font-semibold"
									: "text-gray-600"
							}`}
						>
							{tab}
						</button>
					))}
				</div>

				{/* Tab Content */}
				<div className="bg-white p-6 rounded-lg shadow">
					{activeTab === "transactions" && (
						<div>
							<h2 className="text-xl font-semibold mb-2">Transactions</h2>
							<p className="text-gray-600 mb-4">
								Manage your income and expense transactions
							</p>
							{/* Add your TransactionForm and TransactionList here */}
						</div>
					)}

					{activeTab === "categories" && (
						<div>
							<h2 className="text-xl font-semibold mb-2">
								Category Management
							</h2>
							<p className="text-gray-600">
								Organize your transactions with custom categories
							</p>
						</div>
					)}

					{activeTab === "reports" && (
						<div>
							<h2 className="text-xl font-semibold mb-2">Reports</h2>
							<p className="text-gray-600">
								View detailed financial reports and summaries
							</p>
						</div>
					)}

					{activeTab === "charts" && (
						<div>
							<h2 className="text-xl font-semibold mb-2">Charts & Analytics</h2>
							<p className="text-gray-600">
								Visualize your financial data with interactive charts
							</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default Home;
