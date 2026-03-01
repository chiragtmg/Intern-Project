import { useEffect, useState } from "react";
import {apiRequest} from "../Services/API";
import Modal from "../Components/Modal";

const EMOJI_OPTIONS = [
	"🍕",
	"🛒",
	"🚗",
	"🏠",
	"💊",
	"✈️",
	"🎮",
	"👗",
	"📚",
	"💡",
	"💼",
	"💰",
	"📈",
	"🎁",
	"🏋️",
	"🐾",
	"☕",
	"🎵",
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

function CategoryCard({ cat, onEdit, onDelete }) {
	return (
		<div className="bg-white border border-stone-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
			<span className="text-3xl">{cat.icon}</span>
			<div className="flex-1 min-w-0">
				<p className="font-semibold text-slate-800 text-sm truncate">
					{cat.name}
				</p>
				<span
					className={`text-xs font-medium px-2 py-0.5 rounded-full ${
						cat.type === "income"
							? "bg-emerald-100 text-emerald-700"
							: "bg-red-100 text-red-600"
					}`}
				>
					{cat.type}
				</span>
			</div>
			<div className="flex gap-1 shrink-0">
				<button
					onClick={() => onEdit(cat)}
					className="text-slate-400 hover:text-amber-500 transition p-1 text-base"
				>
					✎
				</button>
				<button
					onClick={() => onDelete(cat._id)}
					className="text-slate-400 hover:text-red-500 transition p-1 text-base"
				>
					✕
				</button>
			</div>
		</div>
	);
}

export default function Categories() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState("expense");

	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const emptyForm = { name: "", type: "expense", icon: "📦" };
	const [form, setForm] = useState(emptyForm);

	// ── Fetch categories on mount ────────────────────────────────────────────
	useEffect(() => {
		const fetchCategories = async () => {
			setLoading(true);
			setError("");
			try {
				const res = await apiRequest.get("/categories");
				const data = res.data.data || res.data;
				setCategories(Array.isArray(data) ? data : []);
			} catch (err) {
				setError("Failed to load categories");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchCategories();
	}, []);

	// ── Helpers to refresh after mutations ───────────────────────────────────
	const refreshCategories = async () => {
		const res = await apiRequest.get("/categories");
		const data = res.data.data || res.data;
		setCategories(Array.isArray(data) ? data : []);
	};

	const openCreate = () => {
		setEditing(null);
		setForm({ ...emptyForm, type: activeTab });
		setModalOpen(true);
	};

	const openEdit = (cat) => {
		setEditing(cat);
		setForm({ name: cat.name, type: cat.type, icon: cat.icon });
		setModalOpen(true);
	};

	const handleDelete = async (id) => {
		if (
			!window.confirm(
				"Delete this category? Transactions using it won't be deleted.",
			)
		)
			return;
		try {
			await apiRequest.delete(`/categories/${id}`);
			setCategories((prev) => prev.filter((c) => c._id !== id));
		} catch (err) {
			alert(err.response?.data?.message || "Failed to delete");
			console.error(err);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editing) {
				await apiRequest.put(`/categories/${editing._id}`, form);
			} else {
				await apiRequest.post("/categories/create", form);
			}
			setModalOpen(false);
			await refreshCategories();
		} catch (err) {
			alert(err.response?.data?.message || "Something went wrong");
			console.error(err);
		}
	};

	const filtered = categories.filter((c) => c.type === activeTab);

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-800">Categories</h1>
					<p className="text-slate-500 text-sm mt-1">
						Organize your transactions
					</p>
				</div>
				<button
					onClick={openCreate}
					className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold text-sm px-4 py-2 rounded-xl transition"
				>
					+ New Category
				</button>
			</div>

			{/* Tabs */}
			<div className="flex gap-2 bg-stone-100 p-1 rounded-xl w-fit">
				{["expense", "income"].map((t) => (
					<button
						key={t}
						onClick={() => setActiveTab(t)}
						className={`px-5 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
							activeTab === t
								? "bg-white shadow text-slate-800"
								: "text-slate-500 hover:text-slate-700"
						}`}
					>
						{t}
					</button>
				))}
			</div>

			{/* Grid */}
			{loading ? (
				<p className="text-center text-slate-400 py-12">Loading...</p>
			) : error ? (
				<p className="text-center text-red-500 py-12">{error}</p>
			) : filtered.length === 0 ? (
				<div className="text-center py-16">
					<p className="text-5xl mb-3">📂</p>
					<p className="text-slate-500 text-sm">
						No {activeTab} categories yet.
					</p>
					<button
						onClick={openCreate}
						className="mt-4 text-amber-500 text-sm font-medium hover:underline"
					>
						Create your first one →
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{filtered.map((cat) => (
						<CategoryCard
							key={cat._id}
							cat={cat}
							onEdit={openEdit}
							onDelete={handleDelete}
						/>
					))}
				</div>
			)}

			{/* Modal */}
			{modalOpen && (
				<Modal
					title={editing ? "Edit Category" : "New Category"}
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

						<Field label="Name">
							<input
								type="text"
								required
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								placeholder="e.g. Groceries"
								className={inputClass}
							/>
						</Field>

						<Field label="Icon (pick one)">
							<div className="flex items-center gap-3 mb-2">
								<span className="text-4xl">{form.icon}</span>
								<input
									type="text"
									maxLength={2}
									value={form.icon}
									onChange={(e) => setForm({ ...form, icon: e.target.value })}
									className={inputClass + " w-20"}
								/>
							</div>
							<div className="flex flex-wrap gap-1">
								{EMOJI_OPTIONS.map((em) => (
									<button
										key={em}
										type="button"
										onClick={() => setForm({ ...form, icon: em })}
										className={`text-xl p-1.5 rounded-lg transition hover:bg-stone-100 ${form.icon === em ? "bg-amber-100 ring-1 ring-amber-400" : ""}`}
									>
										{em}
									</button>
								))}
							</div>
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
								{editing ? "Save Changes" : "Create"}
							</button>
						</div>
					</form>
				</Modal>
			)}
		</div>
	);
}
