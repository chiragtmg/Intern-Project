import mongoose from "mongoose";

const { Schema } = mongoose; // declaring mongoose used in schema

const categorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);