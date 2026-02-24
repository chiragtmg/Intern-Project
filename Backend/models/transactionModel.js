import mongoose from "mongoose";

const { Schema } = mongoose; // declaring mongoose used in schema

const transactionSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		type: { type: String, enum: ["income", "expense"], required: true },
		amount: { type: Number, required: true },
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		description: { type: String, default: "" },
		date: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

export default mongoose.model("Transaction", transactionSchema);
