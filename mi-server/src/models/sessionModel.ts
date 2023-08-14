import db from "../db/db";

export const saveRefreshToken = async (
	userId: number,
	refreshToken: string
) => {
	const result = await db(
		"INSERT INTO refresh_tokens(user_id, refresh_token) VALUES($1, $2) RETURNING *",
		[userId, refreshToken]
	);
	return result;
};

export const findRefreshToken = async (refreshToken: string) => {
	try {
		const result = await db(
			"SELECT * FROM refresh_tokens WHERE refresh_token = $1",
			[refreshToken]
		);
		//@ts-ignore
		return result[0];
	} catch (error) {
		console.error("Error occurred while searching for refresh token: ", error);
		return null;
	}
};

export const deleteRefreshTokenForUser = async (userId: number) => {
	try {
		const result = await db("DELETE FROM refresh_tokens WHERE user_id = $1", [
			userId,
		]);
		return result;
	} catch (error) {
		console.error("Failed to delete refresh token:", error);
		throw error;
	}
};

export const deleteRefreshToken = async (refreshToken: string) => {
	try {
		const result = await db(
			"DELETE FROM refresh_tokens WHERE refresh_token = $1",
			[refreshToken]
		);
		return result;
	} catch (error) {
		console.error("Failed to delete refresh token:", error);
		throw error;
	}
};
