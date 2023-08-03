import db from "../db/db";

interface createUserProps {
	firstName: string;
	lastName: string;
	email: string;
	passwordHash: string;
}

interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	password_hash: string;
	is_activated: boolean;
	unlimited_req: boolean;
	total_req_left: number;
}

export const user = {
	createNewUser: async ({
		firstName,
		lastName,
		email,
		passwordHash,
	}: createUserProps): Promise<string> => {
		try {
			const result = await db(
				"INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING email",
				[firstName, lastName, email, passwordHash]
			);
			//@ts-ignore
			return result;
		} catch (error: any) {
			if (error.code === "23505" && error.constraint === "users_email_key") {
				console.log("Email already exists."); // Custom error handling
			} else {
				console.error("An error occurred during user creation:", error);
			}
			throw error; // Throw the error to be caught by the caller
		}
	},
	findUserByEmail: async (email: string): Promise<User | null> => {
		const result: any[] | undefined = await db(
			"SELECT * FROM users WHERE email=$1",
			[email]
		);
		if (result && result.length > 0) {
			const user: User = result[0];
			return user;
		} else {
			return null;
		}
	},
};
