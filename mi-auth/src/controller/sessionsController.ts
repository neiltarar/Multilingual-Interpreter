import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { user as userModels } from "../models/userModel";
import {
	saveRefreshToken,
	deleteRefreshToken,
	deleteRefreshTokenForUser,
} from "../models/sessionModel";

//@ts-ignore
export const signin = async (req, res) => {
	const { email, password } = req.body;
	const user = await userModels.findUserByEmail(email);

	// if user exists and is activated by the admin
	if (user && user.is_activated) {
		//@ts-ignore
		const passwordHash = user["password_hash"];

		// if user exists and the password is correct
		if (user && (await bcrypt.compare(password, passwordHash))) {
			// create access token
			const accessToken = jwt.sign(
				{ userId: user.id, email: user.email },
				//@ts-ignore
				process.env.ACCESS_TOKEN_SECRET_KEY,
				{ expiresIn: "1m" }
			);

			// create refresh token
			const refreshToken = jwt.sign(
				{ userId: user.id, email: user.email },
				//@ts-ignore
				process.env.REFRESH_TOKEN_SECRET_KEY,
				{ expiresIn: "48h" }
			);

			// delete any existing previous refresh tokens for the user and create a new one
			await deleteRefreshTokenForUser(user.id);
			const result = await saveRefreshToken(user.id, refreshToken);

			// if new refresh token is saved on db with no issues
			if (result) {
				// set response object, cookies etc
				res.cookie("accessToken", accessToken, {
					httpOnly: true,
					secure: false,
				});
				res.cookie("refreshToken", refreshToken, {
					httpOnly: true,
					secure: false,
				});
				res.status(200).json({
					message: "Successful Login",
					//@ts-ignore
					user: { name: user.first_name, id: user.id },
				});
			} else {
				console.log("Error: Couldn't save the refresh token");
				return res.status(500).json({ message: "Internal Server Error" }); // Add return statement here to prevent further execution
			}
		}
		// if the user exists but not yet activated
	} else if (user && !user.is_activated) {
		//@ts-ignore
		const passwordHash = user["password_hash"];
		if (user && (await bcrypt.compare(password, passwordHash))) {
			res.status(400).json({ message: "User is not activated by the admin" });
		} else {
			res.status(400).json({ message: "Unauthorised" });
		}
	} else {
		res.status(400).json({ message: "Unauthorised" });
	}
};

//@ts-ignore
export const signout = async (req, res) => {
	const accessToken = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;
	// If there's a refresh token, delete it from the database
	if (accessToken || refreshToken) {
		try {
			await deleteRefreshToken(refreshToken);
		} catch (error) {
			console.error("Failed to delete refresh token:", error);
			return res.sendStatus(500);
		}
	}

	// Clear the access token and refresh token cookies
	res.clearCookie("accessToken");
	res.clearCookie("refreshToken");
	res.status(200).json({ message: "Successfully logged out" });
};
