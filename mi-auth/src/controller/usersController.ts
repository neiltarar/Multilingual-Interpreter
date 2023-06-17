import bcrypt from "bcrypt";
import { createNewUser } from "../models/userModel";
import { isMatchingPasswords, isValidEmail } from "../utils/validators";
import { UserDto } from "../types/dto/UserDto";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req: any, res: any): Promise<any> => {
	const user: UserDto = req.body;
	const { firstName, lastName, email, password, passwordRepeat } = user;
	let errors = [];
	if (!isValidEmail(email)) {
		errors.push("Email is not valid");
	}
	if (!isMatchingPasswords(password, passwordRepeat)) {
		errors.push("Passwords do not match");
	}

	if (errors.length > 0) {
		return res.status(400).json({ message: errors.join(", ") });
	}

	const passwordHash = await bcrypt.hash(password, 11);
	try {
		const result = await createNewUser(user);

		if (!result) {
			return res.status(409).json({ message: "User already exists" });
		}

		return res.status(200).json({
			message: "Successfully created a user.",
			email: result[0]["email"],
		});
	} catch (error) {
		console.error("An error occurred during user creation:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
