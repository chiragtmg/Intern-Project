import { useEffect, useState } from "react";
import { apiRequest } from "../Services/API";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Legend,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
} from "recharts";

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
	"#84cc16",
];

function SummaryBox({ label, value, sub, color }) {
	return (
		<div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
			<p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
				{label}
			</p>
			<p className={`text-3xl font-bold mt-2 ${color}`}>
				${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}
			</p>
			{sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
		</div>
	);
}

export default function Reports() {
	const today = new Date();
	const [year, setYear] = useState(today.getFullYear());
	const [month, setMonth] = useState("");
	const [mode, setMode] = useState("yearly");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// ── Fetch summary whenever year / month / mode changes ───────────────────
	useEffect(() => {
		const fetchSummary = async () => {
			setLoading(true);
			setError("");
			try {
				const params = { year };
				if (mode === "monthly" && month) params.month = month;

				const res = await apiRequest.get("/transactions/summary", { params });
				const summaryData = res.data.data || res.data;
				setData(summaryData);
			} catch (err) {
				setError("Failed to load report data");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		// Only run if we're in yearly mode, or monthly mode with a month selected
		if (mode === "yearly" || (mode === "monthly" && month)) {
			fetchSummary();
		}
	}, [year, month, mode]);

	// ── Transform monthly array for charts ────────────────────────────────────
	// Backend returns: [{ _id: { month: 3, type: 'income' }, total: 500 }]
	// We need:         [{ month: 'Mar', income: 500, expense: 200 }]
	const monthlyChartData = (() => {
		if (!data?.monthly) return [];
		const map = {};
		data.monthly.forEach(({ _id, total }) => {
			const m = MONTH_NAMES[_id.month - 1];
			if (!map[m]) map[m] = { month: m, income: 0, expense: 0 };
			map[m][_id.type] = total;
		});
		return MONTH_NAMES.map(
			(m) => map[m] || { month: m, income: 0, expense: 0 },
		);
	})();

	const pieData = (data?.byCategory || []).map((c) => ({
		name: `${c.icon} ${c.name}`,
		value: c.total,
	}));

	const savingsRate = data?.totalIncome
		? (
				((data.totalIncome - data.totalExpense) / data.totalIncome) *
				100
			).toFixed(1)
		: 0;

	return (
		<div className="space-y-5">
			<div>
				<h1 className="text-2xl font-bold text-slate-800">Reports</h1>
				<p className="text-slate-500 text-sm mt-1">
					Analyze your financial patterns
				</p>
			</div>

			{/* Filter bar */}
			<div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-wrap gap-3 items-center">
				<div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
					{["yearly", "monthly"].map((m) => (
						<button
							key={m}
							onClick={() => {
								setMode(m);
								if (m === "yearly") setMonth("");
							}}
							className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
								mode === m
									? "bg-white shadow text-slate-800"
									: "text-slate-500 hover:text-slate-700"
							}`}
						>
							{m}
						</button>
					))}
				</div>

				<input
					type="number"
					value={year}
					min={2000}
					max={2100}
					onChange={(e) => setYear(e.target.value)}
					className="border border-stone-200 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-amber-400"
				/>

				{mode === "monthly" && (
					<select
						value={month}
						onChange={(e) => setMonth(e.target.value)}
						className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
					>
						<option value="">Pick month</option>
						{MONTH_NAMES.map((m, i) => (
							<option key={i} value={i + 1}>
								{m}
							</option>
						))}
					</select>
				)}
			</div>

			{loading ? (
				<p className="text-center text-slate-400 py-12">Loading...</p>
			) : error ? (
				<p className="text-center text-red-500 py-12">{error}</p>
			) : (
				<>
					{/* Summary cards */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						<SummaryBox
							label="Total Income"
							value={data?.totalIncome || 0}
							color="text-emerald-600"
						/>
						<SummaryBox
							label="Total Expenses"
							value={data?.totalExpense || 0}
							color="text-red-500"
						/>
						<SummaryBox
							label="Net Balance"
							value={data?.balance || 0}
							color="text-slate-800"
						/>
						<div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
							<p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
								Savings Rate
							</p>
							<p className="text-3xl font-bold mt-2 text-amber-500">
								{savingsRate}%
							</p>
							<p className="text-xs text-slate-400 mt-1">of income saved</p>
						</div>
					</div>

					{/* Charts */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{/* Income vs Expense bar chart */}
						<div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
							<h2 className="text-sm font-semibold text-slate-700 mb-4">
								Income vs Expenses
							</h2>
							{monthlyChartData.length === 0 ? (
								<p className="text-slate-400 text-sm text-center py-10">
									No data
								</p>
							) : (
								<ResponsiveContainer width="100%" height={220}>
									<BarChart data={monthlyChartData} barCategoryGap="35%">
										<XAxis
											dataKey="month"
											tick={{ fontSize: 11 }}
											axisLine={false}
											tickLine={false}
										/>
										<YAxis
											tick={{ fontSize: 11 }}
											axisLine={false}
											tickLine={false}
										/>
										<Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
										<Legend iconType="circle" iconSize={8} />
										<Bar
											dataKey="income"
											fill="#10b981"
											radius={[4, 4, 0, 0]}
											name="Income"
										/>
										<Bar
											dataKey="expense"
											fill="#f43f5e"
											radius={[4, 4, 0, 0]}
											name="Expense"
										/>
									</BarChart>
								</ResponsiveContainer>
							)}
						</div>

						{/* Balance trend line chart */}
						<div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
							<h2 className="text-sm font-semibold text-slate-700 mb-4">
								Balance Trend
							</h2>
							{monthlyChartData.length === 0 ? (
								<p className="text-slate-400 text-sm text-center py-10">
									No data
								</p>
							) : (
								<ResponsiveContainer width="100%" height={220}>
									<LineChart
										data={monthlyChartData.map((d) => ({
											...d,
											balance: d.income - d.expense,
										}))}
									>
										<XAxis
											dataKey="month"
											tick={{ fontSize: 11 }}
											axisLine={false}
											tickLine={false}
										/>
										<YAxis
											tick={{ fontSize: 11 }}
											axisLine={false}
											tickLine={false}
										/>
										<Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
										<Line
											type="monotone"
											dataKey="balance"
											name="Balance"
											stroke="#f59e0b"
											strokeWidth={2.5}
											dot={{ r: 3 }}
											activeDot={{ r: 5 }}
										/>
									</LineChart>
								</ResponsiveContainer>
							)}
						</div>

						{/* Expense pie chart */}
						<div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
							<h2 className="text-sm font-semibold text-slate-700 mb-4">
								Expense by Category
							</h2>
							{pieData.length === 0 ? (
								<p className="text-slate-400 text-sm text-center py-10">
									No expense data
								</p>
							) : (
								<ResponsiveContainer width="100%" height={220}>
									<PieChart>
										<Pie
											data={pieData}
											cx="50%"
											cy="50%"
											innerRadius={50}
											outerRadius={80}
											dataKey="value"
										>
											{pieData.map((_, i) => (
												<Cell
													key={i}
													fill={PIE_COLORS[i % PIE_COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
										<Legend iconType="circle" iconSize={8} />
									</PieChart>
								</ResponsiveContainer>
							)}
						</div>

						{/* Category percentage breakdown */}
						<div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
							<h2 className="text-sm font-semibold text-slate-700 mb-4">
								Category Breakdown
							</h2>
							{pieData.length === 0 ? (
								<p className="text-slate-400 text-sm text-center py-10">
									No data
								</p>
							) : (
								<div className="space-y-3">
									{(data?.byCategory || [])
										.sort((a, b) => b.total - a.total)
										.map((cat, i) => {
											const pct = data.totalExpense
												? ((cat.total / data.totalExpense) * 100).toFixed(1)
												: 0;
											return (
												<div key={i}>
													<div className="flex items-center justify-between text-sm mb-1">
														<span className="text-slate-700">
															{cat.icon} {cat.name}
														</span>
														<span className="font-semibold text-slate-800">
															${cat.total.toLocaleString()}{" "}
															<span className="text-slate-400 font-normal">
																({pct}%)
															</span>
														</span>
													</div>
													<div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
														<div
															className="h-full rounded-full"
															style={{
																width: `${pct}%`,
																backgroundColor:
																	PIE_COLORS[i % PIE_COLORS.length],
															}}
														/>
													</div>
												</div>
											);
										})}
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
