import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", verifyToken, getCategories);
router.post("/create", verifyToken, createCategory);
router.put("/:id", verifyToken, updateCategory);
router.delete("/:id", verifyToken, deleteCategory);

export default router;
