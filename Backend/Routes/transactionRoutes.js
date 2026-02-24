import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
	getSummary,
	getTransactions,
	createTransaction,
	updateTransaction,
	deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/summary", verifyToken, getSummary);
router.get("/", verifyToken, getTransactions);
router.post("/create", verifyToken, createTransaction);
router.put("/:id", verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);

export default router;


