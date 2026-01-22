import express from "express";
import dotenv from "dotenv"; //to call variable from dotenv and hide url or main files
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express(); // app knows express is used as backend

app.use(express.json()); // converting into json format while getting and posting
app.use(cookieParser()); //used as pocket for token to store
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true, // to connect to frontend
	}),
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.get("/", (req, res) => {
	res.send("welcome to the recipe api");
});

app.get("/about", (req, res) => {
	res.status(200).json({ message: "This is about page." });
});

mongoose // lighter than mongodb and good at error handling
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log("Server is running on port", process.env.PORT); //running in port 4000 and process helps to call port from env
		});
		console.log("Connected to mongo db");
	})
	.catch((error) => {
		console.error("Database connection error", error);
	});
