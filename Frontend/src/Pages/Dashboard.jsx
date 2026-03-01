import { useEffect, useState } from "react";
import { apiRequest } from "../Services/API";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";
import Home from "./Home";

const MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
const PIE_COLORS = [
	"#f59e0b",
	"#3b82f6",
	"#10b981",
	"#f43f5e",
	"#8b5cf6",
	"#06b6d4",
	"#ec4899",
	"#f97316",
];

function StatCard({ label, amount, color, icon, trend }) {
	const colorMap = {
		income: "from-emerald-50 to-emerald-100/70 text-emerald-700",
		expense: "from-rose-50 to-rose-100/70 text-rose-700",
		balance: "from-amber-50 to-amber-100/70 text-amber-700",
	};

	return (
		<div
			className={`bg-gradient-to-br ${colorMap[color] || "from-gray-50 to-gray-100/80"} 
        rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-white/40 group`}
		>
			<div className="flex items-center justify-between mb-4">
				<div
					className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm
            ${
							color === "income"
								? "bg-emerald-100 text-emerald-600"
								: color === "expense"
									? "bg-rose-100 text-rose-600"
									: "bg-amber-100 text-amber-600"
						}`}
				>
					{icon}
				</div>
				{trend && (
					<span
						className={`text-xs font-medium px-2.5 py-1 rounded-full ${
							trend > 0
								? "bg-emerald-100 text-emerald-700"
								: "bg-rose-100 text-rose-700"
						}`}
					>
						{trend > 0 ? "+" : ""}
						{trend}%
					</span>
				)}
			</div>
			<p className="text-sm text-slate-600 font-medium tracking-wide">
				{label}
			</p>
			<p className="text-3xl font-extrabold text-slate-800 mt-1.5 tracking-tight">
				${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 0 })}
			</p>
		</div>
	);
}

export default function Dashboard() {
	const currentYear = new Date().getFullYear();
	const [year, setYear] = useState(currentYear);
	const [summary, setSummary] = useState(null);
	const [recent, setRecent] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchDashboardData = async () => {
			setLoading(true);
			setError("");
			try {
				const [summaryRes, txRes] = await Promise.all([
					apiRequest.get("/transactions/summary", { params: { year } }),
					apiRequest.get("/transactions", { params: { year } }),
				]);

				setSummary(summaryRes.data.data || summaryRes.data);
				const txData = txRes.data.data || txRes.data;
				setRecent(Array.isArray(txData) ? txRes.data.slice(0, 6) : []);
			} catch (err) {
				setError("Failed to load dashboard data");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, [year]);

	// Prepare chart data
	const monthlyMap = {};
	(summary?.monthly || []).forEach(({ _id, total }) => {
		const m = MONTH_NAMES[_id.month - 1];
		if (!monthlyMap[m]) monthlyMap[m] = { month: m, income: 0, expense: 0 };
		monthlyMap[m][_id.type] = total || 0;
	});
	const barData = Object.values(monthlyMap);

	const pieData = (summary?.byCategory || [])
		.filter((c) => c.total > 0 && c.type === "expense")
		.map((c) => ({
			name: c.name,
			icon: c.icon || "•",
			value: Math.abs(c.total),
		}));

	if (loading)
		return (
			<div className="flex justify-center items-center h-64 text-slate-400">
				Loading dashboard...
			</div>
		);
	if (error)
		return (
			<div className="text-center py-12 text-red-600 font-medium">{error}</div>
		);

	return (
		<div className="space-y-8 pb-12">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
						Dashboard
					</h1>
					<p className="text-slate-600 mt-1.5">Financial overview • {year}</p>
				</div>

				<div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-2 py-1.5 shadow-sm">
					<button
						onClick={() => setYear((y) => y - 1)}
						className="w-9 h-9 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-500 hover:text-slate-800"
					>
						←
					</button>
					<span className="w-16 text-center font-semibold text-slate-800">
						{year}
					</span>
					<button
						onClick={() => setYear((y) => y + 1)}
						disabled={year >= currentYear}
						className={`w-9 h-9 rounded-full transition-colors flex items-center justify-center
              ${year >= currentYear ? "text-slate-300 cursor-not-allowed" : "hover:bg-slate-100 text-slate-500 hover:text-slate-800"}`}
					>
						→
					</button>
				</div>
			</div>

			{/* Stat Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				<StatCard
					label="Total Income"
					amount={summary?.totalIncome || 0}
					icon="↑"
					color="income"
				/>
				<StatCard
					label="Total Expenses"
					amount={summary?.totalExpense || 0}
					icon="↓"
					color="expense"
				/>
				<StatCard
					label="Net Balance"
					amount={summary?.balance || 0}
					icon={summary?.balance >= 0 ? "👍" : "⚠️"}
					color="balance"
					// trend={summary?.balanceChangePercent} // ← add this field in backend if you want
				/>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Monthly Bar Chart */}
				<div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100/70">
					<h2 className="text-lg font-semibold text-gray-800 mb-5">
						Monthly Cash Flow
					</h2>
					{barData.length === 0 ? (
						<div className="h-56 flex items-center justify-center text-slate-400 text-sm">
							No transactions this year
						</div>
					) : (
						<ResponsiveContainer width="100%" height={260}>
							<BarChart data={barData} barGap={8} barCategoryGap="25%">
								<XAxis
									dataKey="month"
									axisLine={false}
									tickLine={false}
									tick={{ fontSize: 12, fill: "#64748b" }}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{ fontSize: 12, fill: "#64748b" }}
								/>
								<Tooltip
									cursor={{ fill: "rgba(0,0,0,0.04)" }}
									formatter={(v) => [`$${v.toLocaleString()}`, null]}
									labelStyle={{ color: "#1e293b" }}
								/>
								<Bar
									dataKey="income"
									fill="#10b981"
									radius={[6, 6, 0, 0]}
									name="Income"
								/>
								<Bar
									dataKey="expense"
									fill="#f43f5e"
									radius={[6, 6, 0, 0]}
									name="Expense"
								/>
							</BarChart>
						</ResponsiveContainer>
					)}
				</div>

				{/* Pie Chart */}
				<div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100/70">
					<h2 className="text-lg font-semibold text-gray-800 mb-5">
						Expenses by Category
					</h2>
					{pieData.length === 0 ? (
						<div className="h-56 flex items-center justify-center text-slate-400 text-sm">
							No expense data yet
						</div>
					) : (
						<ResponsiveContainer width="100%" height={260}>
							<PieChart>
								<Pie
									data={pieData}
									cx="50%"
									cy="50%"
									innerRadius={65}
									outerRadius={95}
									dataKey="value"
									paddingAngle={2}
								>
									{pieData.map((_, i) => (
										<Cell
											key={`cell-${i}`}
											fill={PIE_COLORS[i % PIE_COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
								<Legend
									iconType="circle"
									iconSize={10}
									layout="horizontal"
									verticalAlign="bottom"
									wrapperStyle={{ paddingTop: 12, fontSize: 13 }}
								/>
							</PieChart>
						</ResponsiveContainer>
					)}
				</div>
			</div>

			{/* Recent Transactions */}
			<div className="bg-white rounded-2xl shadow-md border border-slate-100/70 overflow-hidden">
				<div className="px-6 py-4 border-b border-slate-100">
					<h2 className="text-lg font-semibold text-gray-800">
						Recent Activity
					</h2>
				</div>
				{recent.length === 0 ? (
					<div className="py-12 text-center text-slate-400 text-sm">
						No transactions recorded
					</div>
				) : (
					<div className="divide-y divide-slate-100">
						{recent.map((tx) => (
							<div
								key={tx._id}
								className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/70 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
										{tx.category?.icon || "💳"}
									</div>
									<div>
										<p className="font-medium text-slate-800">
											{tx.description || tx.category?.name || "Transaction"}
										</p>
										<p className="text-xs text-slate-500 mt-0.5">
											{new Date(tx.date).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</p>
									</div>
								</div>
								<span
									className={`font-semibold text-base ${
										tx.type === "income" ? "text-emerald-600" : "text-rose-600"
									}`}
								>
									{tx.type === "income" ? "+" : "-"}$
									{Number(tx.amount).toLocaleString()}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
