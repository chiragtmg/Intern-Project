import Transaction from "../models/transactionModel.js";

// GET all transactions (with optional filters)
export const getTransactions = async (req, res) => {
	try {
		const { type, month, year } = req.query;
		let filter = { user: req.userId };

		// Filter by type (income/expense)
		if (type) filter.type = type;

		// Filter by month and year
		if (month && year) {
			const start = new Date(year, month - 1, 1); // e.g. March 1
			const end = new Date(year, month, 0, 23, 59, 59); // e.g. March 31
			filter.date = { $gte: start, $lte: end };
		} else if (year) {
			filter.date = {
				$gte: new Date(`${year}-01-01`),
				$lte: new Date(`${year}-12-31`),
			};
		}

		const transactions = await Transaction.find(filter)
			.populate("category", "name icon type") // grab category details
			.sort({ date: -1 }); // newest first

		res.json(transactions);
	} catch (err) {
		res.status(500).json({ message: "Server error" });
	}
};

// POST create a transaction
export const createTransaction = async (req, res) => {
	try {
		const { type, amount, category, description, date } = req.body;
		const transaction = await Transaction.create({
			user: req.userId,
			type,
			amount,
			category,
			description,
			date,
		});
		res.status(201).json(transaction);
	} catch (err) {
		res.status(500).json({ message: "Server error while creating" });
	}
};

// PUT update a transaction
export const updateTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findOneAndUpdate(
			{ _id: req.params.id, user: req.userId },
			req.body,
			{ new: true },
		);
		if (!transaction)
			return res.status(404).json({ message: "Transaction not found" });
		res.json(transaction);
	} catch (err) {
		res.status(500).json({ message: "Server error" });
	}
};

// DELETE a transaction
export const deleteTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findOneAndDelete({
			_id: req.params.id,
			user: req.userId,
		});
		if (!transaction)
			return res.status(404).json({ message: "Transaction not found" });
		res.json({ message: "Transaction deleted" });
	} catch (err) {
		res.status(500).json({ message: "Server error" });
	}
};

// GET summary (for charts & reports)
export const getSummary = async (req, res) => {
	try {
		const { month, year } = req.query;
		let filter = { user: req.userId };

		if (month && year) {
			filter.date = {
				$gte: new Date(year, month - 1, 1),
				$lte: new Date(year, month, 0, 23, 59, 59),
			};
		} else if (year) {
			filter.date = {
				$gte: new Date(`${year}-01-01`),
				$lte: new Date(`${year}-12-31`),
			};
		}

		// Total income
		const incomeResult = await Transaction.aggregate([
			{ $match: { ...filter, type: "income" } },
			{ $group: { _id: null, total: { $sum: "$amount" } } },
		]);

		// Total expense
		const expenseResult = await Transaction.aggregate([
			{ $match: { ...filter, type: "expense" } },
			{ $group: { _id: null, total: { $sum: "$amount" } } },
		]);

		// Spending by category (for pie chart)
		const byCategory = await Transaction.aggregate([
			{ $match: { ...filter, type: "expense" } },
			{ $group: { _id: "$category", total: { $sum: "$amount" } } },
			{
				$lookup: {
					from: "categories",
					localField: "_id",
					foreignField: "_id",
					as: "category",
				},
			},
			{ $unwind: "$category" },
			{
				$project: { name: "$category.name", icon: "$category.icon", total: 1 },
			},
		]);

		// Monthly breakdown (for bar/line chart) — only useful when filtering by year
		const monthly = await Transaction.aggregate([
			{ $match: filter },
			{
				$group: {
					_id: { month: { $month: "$date" }, type: "$type" },
					total: { $sum: "$amount" },
				},
			},
			{ $sort: { "_id.month": 1 } },
		]);

		const totalIncome = incomeResult[0]?.total || 0;
		const totalExpense = expenseResult[0]?.total || 0;

		res.json({
			totalIncome,
			totalExpense,
			balance: totalIncome - totalExpense,
			byCategory,
			monthly,
		});
	} catch (err) {
		res.status(500).json({ message: "Server error" });
	}
};
