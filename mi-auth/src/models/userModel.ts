import db from "../db/db";
import { UserDto } from "../types/dto/UserDto";

export const createNewUser = async (user: UserDto): Promise<any> => {
	try {
		const result = await db(
			"INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING email",
			[user.firstName, user.lastName, user.email, user.passwordHash]
		);
		return result;
	} catch (error: any) {
		if (error.code === "23505" && error.constraint === "users_email_key") {
			console.log("Email already exists."); // Custom error handling
		} else {
			console.error("An error occurred during user creation:", error);
		}
	}
};
