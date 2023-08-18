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

export const userModels = {
  createNewUser: async ({
    firstName,
    lastName,
    email,
    passwordHash,
  }: createUserProps): Promise<string> => {
    try {
      //@ts-ignore
      return await db(
        "INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING email",
        [firstName, lastName, email, passwordHash],
      );
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
    try {
      const result: any[] | undefined = await db(
        "SELECT * FROM users WHERE email=$1",
        [email],
      );

      if (result && result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching user by email ${email}:`, error);
      throw new Error("Database error when fetching user");
    }
  },

  findUserById: async (id: number): Promise<User | null> => {
    try {
      const result: any[] | undefined = await db(
        "SELECT first_name, unlimited_req, total_req_left FROM users WHERE id=$1",
        [id],
      );
      if (result && result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching user by id ${id}:`, error);
      throw new Error("Database error when fetching user");
    }
  },

  apiRequestDeduction: async (id: number): Promise<User | null> => {
    try {
      const result = await db(
        `UPDATE users SET total_req_left = CASE 
				WHEN unlimited_req = false 
				AND total_req_left > 0 
				THEN total_req_left - 1 
				ELSE total_req_left END 
				WHERE id = $1 RETURNING first_name, unlimited_req, total_req_left`,
        [id],
      );
      if (result && result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    } catch (error: any) {
      console.error("An error occurred during API request deduction:", error);
      throw error;
    }
  },
};
