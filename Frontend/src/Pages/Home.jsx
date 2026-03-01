import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

const Home = () => {
	const { currentUser, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("transactions");

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const NAV_ITEMS = [
		{ to: "/dashboard", label: "Dashboard", icon: "▦" },
		{ to: "/transactions", label: "Transactions", icon: "⇄" },
		{ to: "/categories", label: "Categories", icon: "◈" },
		{ to: "/reports", label: "Reports", icon: "◎" },
	];

	return (
		<div className="flex h-screen bg-stone-50 font-sans overflow-hidden">
			{/* ── Sidebar ── */}
			<aside className="w-60 bg-slate-900 flex flex-col shrink-0">
				{/* Logo */}
				<div className="px-6 py-6 border-b border-slate-700">
					<h1 className="text-white text-xl font-bold tracking-tight">
						💰 <span className="text-amber-400">Spend</span>Wise
					</h1>
					<p className="text-slate-400 text-xs mt-1 truncate">{currentUser?.email}</p>
				</div>

				{/* Nav links */}
				<nav className="flex-1 px-3 py-4 space-y-1">
					{NAV_ITEMS.map(({ to, label, icon }) => (
						<NavLink
							key={to}
							to={to}
							className={({ isActive }) =>
								`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ` +
								(isActive
									? "bg-amber-400 text-slate-900"
									: "text-slate-400 hover:bg-slate-800 hover:text-white")
							}
						>
							<span className="text-base">{icon}</span>
							{label}
						</NavLink>
					))}
				</nav>

				{/* Logout */}
				<div className="px-3 py-4 border-t border-slate-700">
					<button
						onClick={handleLogout}
						className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all"
					>
						<span>⎋</span> Logout
					</button>
				</div>
			</aside>

			{/* ── Main content ── */}
			<main className="flex-1 overflow-y-auto">
				<div className="max-w-5xl mx-auto px-6 py-8">{}</div>
			</main>
		</div>
	);
};

export default Home;
