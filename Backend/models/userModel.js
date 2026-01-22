import mongoose from "mongoose";

const { Schema } = mongoose; // declaring mongoose used in schema

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, "Username is requird"], // make frontend light
			trim: true,
			minlength: [3, "Need 3 character"],
			maxlength: [50, "Upto 50 character"],
		},
		email: {
			type: String,
			required: [true, "email is requird"],
			trim: true,
			unique: true,
			lowercase: true,
			match: [/^\S+@\S+\.\S+$/, "Please valid email"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Minimum is 6 character long"],
		},
		avatar: {
			type: String,
			default: null,
		},
	},
	{
		timestamps: true, // helps to identify create and update time in mongo db
	}
);

export default mongoose.model("User", userSchema); // exporting userSchema in User
