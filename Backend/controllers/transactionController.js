import Transaction from "../models/transactionModel.js";
import mongoose from "mongoose";

// GET all transactions with filters
export const getTransactions = async (req, res) => {
	try {
		const { type, month, year } = req.query;
		const userObjectId = new mongoose.Types.ObjectId(req.userId);

		let filter = { user: userObjectId };

		if (type) filter.type = type;

		if (month && year) {
			filter.date = {
				$gte: new Date(year, month - 1, 1),
				$lte: new Date(year, month, 0, 23, 59, 59),
			};
		} else if (year) {
			filter.date = {
				$gte: new Date(`${year}-01-01T00:00:00.000Z`),
				$lte: new Date(`${year}-12-31T23:59:59.999Z`),
			};
		}

		const transactions = await Transaction.find(filter)
			.populate("category", "name icon type")
			.sort({ date: -1 });

		res.json(transactions);
	} catch (err) {
		console.error("Get Transactions Error:", err);
		res.status(500).json({ message: "Server error" });
	}
};

// CREATE transaction
export const createTransaction = async (req, res) => {
	try {
		const { type, amount, category, description, date } = req.body;

		const transaction = await Transaction.create({
			user: req.userId,
			type,
			amount,
			category,
			description,
			date: date || new Date(),
		});

		res.status(201).json(transaction);
	} catch (err) {
		console.error("Create Transaction Error:", err);
		res.status(500).json({ message: "Server error while creating transaction" });
	}
};

// UPDATE transaction
export const updateTransaction = async (req, res) => {
	try {
		const userObjectId = new mongoose.Types.ObjectId(req.userId);

		const transaction = await Transaction.findOneAndUpdate(
			{ _id: req.params.id, user: userObjectId },
			req.body,
			{ new: true }
		).populate("category", "name icon type");

		if (!transaction) {
			return res.status(404).json({ message: "Transaction not found" });
		}

		res.json(transaction);
	} catch (err) {
		console.error("Update Transaction Error:", err);
		res.status(500).json({ message: "Server error" });
	}
};

// DELETE transaction
export const deleteTransaction = async (req, res) => {
	try {
		const userObjectId = new mongoose.Types.ObjectId(req.userId);

		const transaction = await Transaction.findOneAndDelete({
			_id: req.params.id,
			user: userObjectId,
		});

		if (!transaction) {
			return res.status(404).json({ message: "Transaction not found" });
		}

		res.json({ message: "Transaction deleted successfully" });
	} catch (err) {
		console.error("Delete Transaction Error:", err);
		res.status(500).json({ message: "Server error" });
	}
};

// GET Summary (Dashboard)
export const getSummary = async (req, res) => {
	try {
		const { year } = req.query;
		const userObjectId = new mongoose.Types.ObjectId(req.userId);

		let filter = { user: userObjectId };

		if (year) {
			filter.date = {
				$gte: new Date(`${year}-01-01T00:00:00.000Z`),
				$lte: new Date(`${year}-12-31T23:59:59.999Z`),
			};
		}

		// Total Income
		const incomeResult = await Transaction.aggregate([
			{ $match: { ...filter, type: "income" } },
			{ $group: { _id: null, total: { $sum: "$amount" } } },
		]);

		// Total Expense
		const expenseResult = await Transaction.aggregate([
			{ $match: { ...filter, type: "expense" } },
			{ $group: { _id: null, total: { $sum: "$amount" } } },
		]);

		// Expenses by Category
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
				$project: {
					name: "$category.name",
					icon: "$category.icon",
					type: "$category.type",
					total: 1,
				},
			},
		]);

		// Monthly Breakdown
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
		console.error("Get Summary Error:", err);
		res.status(500).json({ message: "Server error" });
	}
};