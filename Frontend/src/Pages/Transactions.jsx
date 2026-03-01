import { useEffect, useState } from "react";
import { apiRequest } from "../Services/API";
import Modal from "../components/Modal";

const MONTHS = [
	"All",
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const inputClass =
	"w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition";

function Field({ label, children }) {
	return (
		<div className="space-y-1">
			<label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
				{label}
			</label>
			{children}
		</div>
	);
}

export default function Transactions() {
	const today = new Date();

	const [transactions, setTransactions] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// Filters
	const [filterMonth, setFilterMonth] = useState(today.getMonth() + 1);
	const [filterYear, setFilterYear] = useState(today.getFullYear());
	const [filterType, setFilterType] = useState("");

	// Modal
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState(null);

	const emptyForm = {
		type: "expense",
		amount: "",
		category: "",
		description: "",
		date: today.toISOString().split("T")[0],
	};
	const [form, setForm] = useState(emptyForm);

	// ── Fetch categories once on mount ────────────────────────────────────────
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await apiRequest.get("/categories");
				const data = res.data.data || res.data;
				setCategories(Array.isArray(data) ? data : []);
			} catch (err) {
				console.error("Failed to load categories", err);
			}
		};
		fetchCategories();
	}, []);

	// ── Fetch transactions whenever filters change ────────────────────────────
	useEffect(() => {
		const fetchTransactions = async () => {
			setLoading(true);
			setError("");
			try {
				const params = { year: filterYear };
				if (filterMonth !== 0) params.month = filterMonth;
				if (filterType) params.type = filterType;

				const res = await apiRequest.get("/transactions", { params });
				const data = res.data.data || res.data;
				setTransactions(Array.isArray(data) ? data : []);
			} catch (err) {
				setError("Failed to load transactions");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchTransactions();
	}, [filterMonth, filterYear, filterType]);

	// ── Handlers ──────────────────────────────────────────────────────────────
	const openCreate = () => {
		setEditing(null);
		setForm(emptyForm);
		setModalOpen(true);
	};

	const openEdit = (tx) => {
		setEditing(tx);
		setForm({
			type: tx.type,
			amount: tx.amount,
			category: tx.category?._id || "",
			description: tx.description || "",
			date: tx.date?.split("T")[0] || today.toISOString().split("T")[0],
		});
		setModalOpen(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editing) {
				await apiRequest.put(`/transactions/${editing._id}`, form);
			} else {
				await apiRequest.post("/transactions/create", form);
			}
			setModalOpen(false);
			// Re-fetch to reflect changes
			const params = { year: filterYear };
			if (filterMonth !== 0) params.month = filterMonth;
			if (filterType) params.type = filterType;
			const res = await apiRequest.get("/transactions", { params });
			const data = res.data.data || res.data;
			setTransactions(Array.isArray(data) ? data : []);
		} catch (err) {
			alert(err.response?.data?.message || "Something went wrong");
			console.error(err);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this transaction?")) return;
		try {
			await apiRequest.delete(`/transactions/${id}`);
			setTransactions((prev) => prev.filter((t) => t._id !== id));
		} catch (err) {
			alert(err.response?.data?.message || "Failed to delete");
			console.error(err);
		}
	};

	// Totals for the current filter period
	const totalIncome = transactions
		.filter((t) => t.type === "income")
		.reduce((s, t) => s + t.amount, 0);
	const totalExpense = transactions
		.filter((t) => t.type === "expense")
		.reduce((s, t) => s + t.amount, 0);

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
					<p className="text-slate-500 text-sm mt-1">
						Manage your income and expenses
					</p>
				</div>
				<button
					onClick={openCreate}
					className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold text-sm px-4 py-2 rounded-xl transition"
				>
					+ Add Transaction
				</button>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-wrap gap-3">
				<select
					value={filterMonth}
					onChange={(e) => setFilterMonth(Number(e.target.value))}
					className={inputClass + " w-36"}
				>
					{MONTHS.map((m, i) => (
						<option key={i} value={i}>
							{m}
						</option>
					))}
				</select>
				<input
					type="number"
					value={filterYear}
					min={2000}
					max={2100}
					onChange={(e) => setFilterYear(e.target.value)}
					className={inputClass + " w-24"}
				/>
				<select
					value={filterType}
					onChange={(e) => setFilterType(e.target.value)}
					className={inputClass + " w-32"}
				>
					<option value="">All Types</option>
					<option value="income">Income</option>
					<option value="expense">Expense</option>
				</select>

				{/* Mini totals */}
				<div className="ml-auto flex gap-4 text-sm items-center">
					<span className="text-emerald-600 font-semibold">
						+${totalIncome.toLocaleString()}
					</span>
					<span className="text-red-500 font-semibold">
						-${totalExpense.toLocaleString()}
					</span>
					<span className="text-slate-600 font-bold border-l pl-4">
						Balance: ${(totalIncome - totalExpense).toLocaleString()}
					</span>
				</div>
			</div>

			{/* Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
				{loading ? (
					<p className="text-center text-slate-400 py-12">Loading...</p>
				) : error ? (
					<p className="text-center text-red-500 py-12">{error}</p>
				) : transactions.length === 0 ? (
					<p className="text-center text-slate-400 py-12">
						No transactions found. Add one!
					</p>
				) : (
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left border-b border-stone-100 text-slate-500 text-xs uppercase tracking-wider">
								<th className="px-5 py-3 font-medium">Category</th>
								<th className="px-5 py-3 font-medium">Description</th>
								<th className="px-5 py-3 font-medium">Date</th>
								<th className="px-5 py-3 font-medium text-right">Amount</th>
								<th className="px-5 py-3 font-medium text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-stone-50">
							{transactions.map((tx) => (
								<tr
									key={tx._id}
									className="hover:bg-stone-50 transition-colors"
								>
									<td className="px-5 py-3">
										<div className="flex items-center gap-2">
											<span className="text-base">
												{tx.category?.icon || "💳"}
											</span>
											<span className="text-slate-700 font-medium">
												{tx.category?.name || "Uncategorized"}
											</span>
										</div>
									</td>
									<td className="px-5 py-3 text-slate-500">
										{tx.description || "—"}
									</td>
									<td className="px-5 py-3 text-slate-500">
										{new Date(tx.date).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</td>
									<td
										className={`px-5 py-3 text-right font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-red-500"}`}
									>
										{tx.type === "income" ? "+" : "-"}$
										{tx.amount.toLocaleString()}
									</td>
									<td className="px-5 py-3 text-right">
										<button
											onClick={() => openEdit(tx)}
											className="text-slate-400 hover:text-amber-500 mr-3 transition text-base"
										>
											✎
										</button>
										<button
											onClick={() => handleDelete(tx._id)}
											className="text-slate-400 hover:text-red-500 transition text-base"
										>
											✕
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{/* Add / Edit Modal */}
			{modalOpen && (
				<Modal
					title={editing ? "Edit Transaction" : "Add Transaction"}
					onClose={() => setModalOpen(false)}
				>
					<form onSubmit={handleSubmit} className="space-y-4">
						<Field label="Type">
							<div className="flex gap-2">
								{["expense", "income"].map((t) => (
									<button
										key={t}
										type="button"
										onClick={() => setForm({ ...form, type: t })}
										className={`flex-1 py-2 rounded-lg text-sm font-medium border transition capitalize ${
											form.type === t
												? t === "income"
													? "bg-emerald-500 text-white border-emerald-500"
													: "bg-red-500 text-white border-red-500"
												: "border-stone-200 text-slate-500 hover:border-stone-400"
										}`}
									>
										{t}
									</button>
								))}
							</div>
						</Field>

						<Field label="Amount">
							<input
								type="number"
								min="0.01"
								step="0.01"
								required
								value={form.amount}
								onChange={(e) => setForm({ ...form, amount: e.target.value })}
								placeholder="0.00"
								className={inputClass}
							/>
						</Field>

						<Field label="Category">
							<select
								required
								value={form.category}
								onChange={(e) => setForm({ ...form, category: e.target.value })}
								className={inputClass}
							>
								<option value="">Select category</option>
								{categories
									.filter((c) => c.type === form.type)
									.map((c) => (
										<option key={c._id} value={c._id}>
											{c.icon} {c.name}
										</option>
									))}
							</select>
						</Field>

						<Field label="Description">
							<input
								type="text"
								value={form.description}
								onChange={(e) =>
									setForm({ ...form, description: e.target.value })
								}
								placeholder="Optional note"
								className={inputClass}
							/>
						</Field>

						<Field label="Date">
							<input
								type="date"
								required
								value={form.date}
								onChange={(e) => setForm({ ...form, date: e.target.value })}
								className={inputClass}
							/>
						</Field>

						<div className="flex gap-3 pt-2">
							<button
								type="button"
								onClick={() => setModalOpen(false)}
								className="flex-1 border border-stone-200 text-slate-600 text-sm font-medium py-2 rounded-xl hover:bg-stone-50 transition"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-semibold py-2 rounded-xl transition"
							>
								{editing ? "Save Changes" : "Add Transaction"}
							</button>
						</div>
					</form>
				</Modal>
			)}
		</div>
	);
}
