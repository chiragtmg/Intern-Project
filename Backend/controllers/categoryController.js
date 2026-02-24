import Category from "../models/categoryModel.js";

// GET all categories for logged-in user
export const getCategories = async (req, res) => {
	try {
		const categories = await Category.find({ user: req.userId });
		res.json(categories);
	} catch (err) {
		res.status(500).json({ message: "Server error" });
	}
};

// POST create a new category
export const createCategory = async (req, res) => {
	try {
		const { name, type } = req.body;
		const category = await Category.create({
			user: req.userId,
			name,
			type,
		});
		res.status(201).json(category);
	} catch (err) {
		res.status(500).json({ message: "Server error while creating" });
	}
};

// PUT update a category
export const updateCategory = async (req, res) => {
	try {
		const category = await Category.findOneAndUpdate(
			{ _id: req.params.id, user: req.userId }, // ensures user owns it
			req.body,
			{ new: true },
		);
		if (!category)
			return res.status(404).json({ message: "Category not found" });
		res.json(category);
	} catch (err) {
		res.status(500).json({ message: "Server error" });
	}
};

// DELETE a category
export const deleteCategory = async (req, res) => {
	try {
		const category = await Category.findOneAndDelete({
			_id: req.params.id,
			user: req.userId,
		});
		if (!category)
			return res.status(404).json({ message: "Category not found" });
		res.json({ message: "Category deleted" });
	} catch (err) {
		res.status(500).json({ message: "Server error" });
	}
};
