import express from "express";
import {
	loginUser,
	logoutUser,
	registerUser,
} from "../controllers/authController.js"; // .js in last to find the file

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login", logoutUser);

export default router;
